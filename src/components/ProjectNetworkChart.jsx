import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './ProjectNetworkChart.css';

// ─── Deterministic helpers ────────────────────────────────────────────────────

function djb2Hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h, 33) ^ str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

/** Generate a stable hue (0-359) from a string */
function nameHue(name) {
  return djb2Hash(name) % 360;
}

// ─── Custom Node Types ────────────────────────────────────────────────────────

function TeamMemberNode({ data }) {
  const hue = nameHue(data.label);
  return (
    <div className="pnc-member-node" style={{ '--member-hue': hue }}>
      <div className="pnc-member-avatar">{initials(data.label)}</div>
      <div className="pnc-member-info">
        <div className="pnc-member-name">{data.label}</div>
        <div className="pnc-member-meta">
          <span className="pnc-badge pnc-badge--tasks">{data.tasksCompleted} tasks</span>
          <span className="pnc-badge pnc-badge--hours">{data.hoursLogged}h</span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="pnc-handle pnc-handle--source"
      />
    </div>
  );
}

function ProjectNode({ data }) {
  const progressColor =
    data.progress >= 75 ? '#10b981' :
    data.progress >= 40 ? '#f59e0b' : '#6366f1';

  return (
    <div className="pnc-project-node">
      <Handle
        type="target"
        position={Position.Left}
        className="pnc-handle pnc-handle--target"
      />
      <div className="pnc-project-header">
        <div className="pnc-project-icon">📁</div>
        <div className="pnc-project-name">{data.label}</div>
      </div>
      <div className="pnc-project-progress-track">
        <div
          className="pnc-project-progress-fill"
          style={{ width: `${data.progress}%`, background: progressColor }}
        />
      </div>
      <div className="pnc-project-footer">
        <span style={{ color: progressColor, fontWeight: 600 }}>{data.progress}%</span>
        <span className="pnc-project-budget">${(data.budget / 1000).toFixed(0)}k</span>
      </div>
    </div>
  );
}

const nodeTypes = { teamMember: TeamMemberNode, project: ProjectNode };

// ─── Default data (used when props are empty) ─────────────────────────────────

const DEFAULT_MEMBERS = [
  { name: 'Alice Johnson',  tasksCompleted: 24, hoursLogged: 168 },
  { name: 'Bob Schmidt',    tasksCompleted: 18, hoursLogged: 145 },
  { name: 'Carol White',    tasksCompleted: 31, hoursLogged: 192 },
  { name: 'David Lee',      tasksCompleted: 12, hoursLogged: 98  },
  { name: 'Eva Martinez',   tasksCompleted: 27, hoursLogged: 175 },
  { name: 'Frank Chen',     tasksCompleted: 20, hoursLogged: 160 },
];

const DEFAULT_PROJECTS = [
  { name: 'Platform Redesign',  progress: 72, budget: 85000  },
  { name: 'Mobile App v2',      progress: 45, budget: 120000 },
  { name: 'API Gateway',        progress: 88, budget: 55000  },
  { name: 'Analytics Suite',    progress: 30, budget: 95000  },
  { name: 'Customer Portal',    progress: 61, budget: 70000  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const MEMBER_X  = 40;
const PROJECT_X = 540;
const MEMBER_GAP  = 115;
const PROJECT_GAP = 130;

export default function ProjectNetworkChart({ teamProductivity, projectStats }) {
  const members  = teamProductivity?.length > 0 ? teamProductivity : DEFAULT_MEMBERS;
  const projects = projectStats?.length      > 0 ? projectStats     : DEFAULT_PROJECTS;

  const [highlightedMember, setHighlightedMember] = useState(null);

  // ── build nodes ────────────────────────────────────────────────────────────
  const initialNodes = useMemo(() => {
    const memberNodes = members.map((m, i) => ({
      id:       `m-${i}`,
      type:     'teamMember',
      position: { x: MEMBER_X, y: i * MEMBER_GAP },
      data: {
        label:          m.name,
        tasksCompleted: m.tasksCompleted,
        hoursLogged:    m.hoursLogged,
      },
      draggable: true,
    }));

    const projectNodes = projects.map((p, i) => ({
      id:       `p-${i}`,
      type:     'project',
      position: { x: PROJECT_X, y: i * PROJECT_GAP + (members.length * MEMBER_GAP - projects.length * PROJECT_GAP) / 2 },
      data: {
        label:    p.name,
        progress: p.progress,
        budget:   p.budget,
      },
      draggable: true,
    }));

    return [...memberNodes, ...projectNodes];
  }, [members, projects]);

  // ── build edges: 2-3 projects per member, deterministic ───────────────────
  const initialEdges = useMemo(() => {
    const edges  = [];
    const pCount = projects.length;

    members.forEach((m, mi) => {
      const h = djb2Hash(m.name);
      const count = 2 + (h % 2); // 2 or 3 projects
      const assigned = new Set();

      // Primary project: hash-based
      assigned.add(h % pCount);
      // Additional projects: spread by prime offsets
      for (let k = 1; assigned.size < Math.min(count, pCount); k++) {
        assigned.add((h + k * 7) % pCount);
      }

      assigned.forEach(pi => {
        const hue = nameHue(m.name);
        edges.push({
          id:     `e-m${mi}-p${pi}`,
          source: `m-${mi}`,
          target: `p-${pi}`,
          type:   'smoothstep',
          markerEnd: {
            type:  MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: `hsl(${hue}, 60%, 55%)`,
          },
          style: {
            stroke:      `hsl(${hue}, 60%, 55%)`,
            strokeWidth: 1.8,
            opacity:     0.65,
          },
          animated: false,
        });
      });
    });

    return edges;
  }, [members, projects]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Highlight all edges + connected nodes when hovering a member node
  const onNodeMouseEnter = useCallback((_, node) => {
    if (!node.id.startsWith('m-')) return;
    setHighlightedMember(node.id);

    const connectedProjects = new Set(
      initialEdges
        .filter(e => e.source === node.id)
        .map(e => e.target),
    );

    setEdges(eds =>
      eds.map(e => ({
        ...e,
        animated: e.source === node.id,
        style: {
          ...e.style,
          opacity: e.source === node.id ? 1 : 0.12,
          strokeWidth: e.source === node.id ? 2.5 : 1,
        },
      })),
    );

    setNodes(ns =>
      ns.map(n => ({
        ...n,
        style: {
          ...n.style,
          opacity:
            n.id === node.id || connectedProjects.has(n.id) ? 1 : 0.25,
        },
      })),
    );
  }, [initialEdges, setEdges, setNodes]);

  const onNodeMouseLeave = useCallback(() => {
    setHighlightedMember(null);
    setEdges(eds =>
      eds.map(e => ({
        ...e,
        animated: false,
        style: { ...e.style, opacity: 0.65, strokeWidth: 1.8 },
      })),
    );
    setNodes(ns => ns.map(n => ({ ...n, style: { ...n.style, opacity: 1 } })));
  }, [setEdges, setNodes]);

  return (
    <div className="project-network-chart">
      {/* Header */}
      <div className="whc-header">
        <div className="whc-title-block">
          <h2 className="chart-title">Team &amp; Project Network</h2>
          <p className="chart-subtitle">
            Who is assigned to which project — hover a team member to highlight their connections, drag nodes to rearrange
          </p>
        </div>
        <div className="pnc-legend">
          <span className="pnc-legend-item pnc-legend-item--member">
            <span className="pnc-legend-dot" />Team Member
          </span>
          <span className="pnc-legend-item pnc-legend-item--project">
            <span className="pnc-legend-dot pnc-legend-dot--project" />Project
          </span>
        </div>
      </div>

      {/* ReactFlow canvas */}
      <div className="pnc-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: false }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.2}
            color="#e5e7eb"
          />
          <Controls
            showInteractive={false}
            className="pnc-controls"
          />
          <MiniMap
            nodeColor={n =>
              n.type === 'teamMember'
                ? `hsl(${nameHue(n.data?.label ?? '')}, 60%, 55%)`
                : '#10b981'
            }
            maskColor="rgba(249,250,251,0.85)"
            className="pnc-minimap"
          />
          <Panel position="top-right" className="pnc-hint-panel">
            <span>🖱 Scroll to zoom · Drag to pan</span>
          </Panel>
        </ReactFlow>
      </div>

      {/* Stats strip */}
      <div className="pnc-stats-strip">
        <div className="pnc-stat">
          <span className="pnc-stat-value">{members.length}</span>
          <span className="pnc-stat-label">Team Members</span>
        </div>
        <div className="pnc-stat-divider" />
        <div className="pnc-stat">
          <span className="pnc-stat-value">{projects.length}</span>
          <span className="pnc-stat-label">Active Projects</span>
        </div>
        <div className="pnc-stat-divider" />
        <div className="pnc-stat">
          <span className="pnc-stat-value">{initialEdges.length}</span>
          <span className="pnc-stat-label">Assignments</span>
        </div>
        <div className="pnc-stat-divider" />
        <div className="pnc-stat">
          <span className="pnc-stat-value">
            {(initialEdges.length / members.length).toFixed(1)}
          </span>
          <span className="pnc-stat-label">Avg Projects / Person</span>
        </div>
      </div>
    </div>
  );
}
