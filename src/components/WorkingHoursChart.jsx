import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import './WorkingHoursChart.css';

// ─── Deterministic mock-data utilities ───────────────────────────────────────

/** djb2 hash — maps a string to an unsigned 32-bit integer */
function djb2Hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h, 33) ^ str.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Mulberry32 PRNG — returns a closure that yields [0, 1) floats */
function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Derive per-employee work-pattern constants from their name */
function getEmployeeProfile(name) {
  const h = djb2Hash(name);
  return {
    baseHours: 6.5 + (h % 25) * 0.12, // avg 6.5 – 9.4 h/day
    stdDev: 0.8 + (h % 15) * 0.1,      // variance 0.8 – 2.2 h
  };
}

/** Return simulated working hours for one employee on a single date */
function getDailyHours(name, date) {
  const { baseHours, stdDev } = getEmployeeProfile(name);
  const seed = djb2Hash(name + '|' + date.toISOString().slice(0, 10));
  const rng = mulberry32(seed);
  const dow = date.getDay();
  // weekends: ~10 % chance of some work
  if (dow === 0 || dow === 6) {
    return rng() < 0.1 ? Math.round(rng() * 30) / 10 : 0;
  }
  // Box-Muller Gaussian approximation
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  const gauss = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(0, Math.round((baseHours + gauss * stdDev) * 10) / 10);
}

// ─── Date-range helpers ───────────────────────────────────────────────────────

const REFERENCE_DATE = new Date('2026-03-13');

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function startOfWeek(date) {           // Monday-based
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getDatesInRange(start, end) {
  const dates = [];
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endD = new Date(end);
  endD.setHours(0, 0, 0, 0);
  while (cur <= endD) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function getStartDate(period) {
  const d = new Date(REFERENCE_DATE);
  if      (period === '7d')  d.setDate(d.getDate() - 6);
  else if (period === '30d') d.setDate(d.getDate() - 29);
  else if (period === '3m')  d.setMonth(d.getMonth() - 3);
  else                       d.setFullYear(d.getFullYear() - 1);
  return d;
}

function formatBucketLabel(date, granularity) {
  if (granularity === 'daily')   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (granularity === 'weekly')  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Build x-axis buckets from a flat array of days */
function buildBuckets(allDays, granularity) {
  if (granularity === 'daily') {
    return allDays.map(d => ({ start: d, label: formatBucketLabel(d, 'daily') }));
  }
  const seen = new Set();
  const buckets = [];
  for (const d of allDays) {
    const anchor = granularity === 'weekly' ? startOfWeek(d) : startOfMonth(d);
    const key = anchor.toISOString().slice(0, granularity === 'weekly' ? 10 : 7);
    if (!seen.has(key)) {
      seen.add(key);
      const label =
        granularity === 'weekly'
          ? `Wk ${formatBucketLabel(anchor, 'weekly')}`
          : formatBucketLabel(anchor, 'monthly');
      buckets.push({ start: anchor, label });
    }
  }
  return buckets;
}

/** Aggregate hours for one employee across an entire bucket */
function getBucketHours(name, bucket, granularity) {
  if (granularity === 'daily') return getDailyHours(name, bucket.start);

  let total = 0;
  if (granularity === 'weekly') {
    for (let i = 0; i < 7; i++) total += getDailyHours(name, addDays(bucket.start, i));
  } else {
    const { getFullYear: fy, getMonth: gm } = bucket.start;
    const year = bucket.start.getFullYear();
    const month = bucket.start.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= days; d++) total += getDailyHours(name, new Date(year, month, d));
  }
  return Math.round(total * 10) / 10;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16',
  '#f97316', '#0ea5e9',
];

const PERIOD_OPTIONS = [
  { label: '1 Week',   value: '7d'  },
  { label: '1 Month',  value: '30d' },
  { label: '3 Months', value: '3m'  },
  { label: '1 Year',   value: '12m' },
];

const GRANULARITY_MAP = {
  '7d':  ['daily'],
  '30d': ['daily', 'weekly'],
  '3m':  ['daily', 'weekly', 'monthly'],
  '12m': ['weekly', 'monthly'],
};

const GRANULARITY_LABELS = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

const DEFAULT_GRANULARITY = { '7d': 'daily', '30d': 'daily', '3m': 'weekly', '12m': 'monthly' };

const CHART_TYPES = [{ label: 'Bar', value: 'bar' }, { label: 'Line', value: 'line' }];

const DEFAULT_EMPLOYEES = [
  'Alice Johnson', 'Bob Schmidt', 'Carol White',
  'David Lee',     'Eva Martinez', 'Frank Chen',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorkingHoursChart({ employees: employeesProp }) {
  const employees =
    employeesProp && employeesProp.length > 0 ? employeesProp : DEFAULT_EMPLOYEES;

  const [period,      setPeriod]      = useState('30d');
  const [granularity, setGranularity] = useState('daily');
  const [chartType,   setChartType]   = useState('bar');

  const handlePeriodChange = (p) => {
    setPeriod(p);
    const valid = GRANULARITY_MAP[p];
    if (!valid.includes(granularity)) setGranularity(DEFAULT_GRANULARITY[p]);
  };

  // Build xAxis labels + series data
  const { xAxis, series, bucketCount } = useMemo(() => {
    const allDays = getDatesInRange(getStartDate(period), REFERENCE_DATE);
    const buckets = buildBuckets(allDays, granularity);

    const series = employees.map((emp, i) => {
      const data = buckets.map(b => getBucketHours(emp, b, granularity));
      const color = COLORS[i % COLORS.length];
      const base = { name: emp, data, color, emphasis: { focus: 'series' } };

      return chartType === 'bar'
        ? { ...base, type: 'bar', barMaxWidth: 28 }
        : {
            ...base,
            type: 'line',
            smooth: true,
            lineStyle: { width: 2 },
            areaStyle: { opacity: 0.07 },
            symbol: 'circle',
            symbolSize: buckets.length > 60 ? 3 : 6,
          };
    });

    return { xAxis: buckets.map(b => b.label), series, bucketCount: buckets.length };
  }, [employees, period, granularity, chartType]);

  const yAxisName =
    granularity === 'daily'   ? 'Hours / Day' :
    granularity === 'weekly'  ? 'Hours / Week' :
                                'Hours / Month';

  const option = useMemo(() => ({
    animation: true,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: chartType === 'bar' ? 'shadow' : 'cross' },
      backgroundColor: '#fff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: { color: '#374151', fontSize: 13 },
      formatter(params) {
        const rows = params
          .map(
            p => `<div class="whc-tt-row">
              <span class="whc-tt-dot" style="background:${p.color}"></span>
              <span class="whc-tt-name">${p.seriesName}</span>
              <strong class="whc-tt-val">${p.value}h</strong>
            </div>`,
          )
          .join('');
        return `<div class="whc-tt-date">${params[0].axisValue}</div>${rows}`;
      },
    },
    legend: {
      type: 'scroll',
      bottom: 58,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 13, color: '#374151' },
    },
    grid: { top: 16, left: 58, right: 44, bottom: 108 },
    xAxis: {
      type: 'category',
      data: xAxis,
      axisLabel: {
        rotate: bucketCount > 15 ? 35 : 0,
        fontSize: 12,
        color: '#6b7280',
      },
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameLocation: 'middle',
      nameGap: 44,
      nameTextStyle: { color: '#6b7280', fontSize: 12, fontWeight: 600 },
      axisLabel: { formatter: v => `${v}h`, color: '#6b7280', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLine: { show: false },
    },
    dataZoom: [
      {
        type: 'slider',
        bottom: 14,
        height: 22,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        fillerColor: 'rgba(99,102,241,0.15)',
        handleStyle: { color: '#6366f1', borderColor: '#6366f1' },
        moveHandleStyle: { color: '#6366f1' },
        textStyle: { color: '#6b7280', fontSize: 11 },
        // Show last 30 buckets by default when there are more
        start: bucketCount > 30 ? Math.max(0, 100 - (30 / bucketCount) * 100) : 0,
        end: 100,
      },
      { type: 'inside' },
    ],
    toolbox: {
      right: 8,
      top: 0,
      itemSize: 15,
      iconStyle: { borderColor: '#9ca3af' },
      emphasis: { iconStyle: { borderColor: '#6366f1' } },
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
          title: { zoom: 'Zoom area', back: 'Undo zoom' },
        },
        restore:      { title: 'Reset chart' },
        saveAsImage:  { title: 'Save as PNG' },
      },
    },
    series,
  }), [xAxis, yAxisName, bucketCount, series, chartType]);

  return (
    <div className="working-hours-chart">
      {/* ── Header ── */}
      <div className="whc-header">
        <div className="whc-title-block">
          <h2 className="chart-title">Employee Working Hours</h2>
          <p className="chart-subtitle">
            Hours logged per team member — use the slider or scroll to zoom the time axis
          </p>
        </div>

        <div className="whc-controls">
          {/* Period */}
          <div className="whc-control-group">
            <span className="whc-label">Period</span>
            <div className="whc-toggle" role="group" aria-label="Select time period">
              {PERIOD_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`whc-btn${period === opt.value ? ' whc-btn--active' : ''}`}
                  onClick={() => handlePeriodChange(opt.value)}
                  aria-pressed={period === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Granularity */}
          <div className="whc-control-group">
            <span className="whc-label">Granularity</span>
            <div className="whc-toggle" role="group" aria-label="Select granularity">
              {GRANULARITY_MAP[period].map(g => (
                <button
                  key={g}
                  className={`whc-btn${granularity === g ? ' whc-btn--active' : ''}`}
                  onClick={() => setGranularity(g)}
                  aria-pressed={granularity === g}
                >
                  {GRANULARITY_LABELS[g]}
                </button>
              ))}
            </div>
          </div>

          {/* Chart type */}
          <div className="whc-control-group">
            <span className="whc-label">Type</span>
            <div className="whc-toggle" role="group" aria-label="Select chart type">
              {CHART_TYPES.map(opt => (
                <button
                  key={opt.value}
                  className={`whc-btn${chartType === opt.value ? ' whc-btn--active' : ''}`}
                  onClick={() => setChartType(opt.value)}
                  aria-pressed={chartType === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <ReactECharts
        option={option}
        notMerge={true}
        lazyUpdate={false}
        style={{ height: '420px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
