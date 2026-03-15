// Analytics.jsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';
import WorkingHoursChart from '../components/WorkingHoursChart';
import ProjectNetworkChart from '../components/ProjectNetworkChart';
import './Analytics.css';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullPage />;
  }

  const { overview, taskTrend, projectStats, teamProductivity } = analytics;

  return (
    <div className="analytics">
      <div className="page-header">
        <h1>Analytics</h1>
        <p className="page-subtitle">Insights and metrics for your projects and team</p>
      </div>

      <div className="analytics-overview">
        <Card className="overview-card">
          <div className="overview-metric">
            <div className="metric-icon">📊</div>
            <div>
              <div className="metric-value">{overview.completionRate}%</div>
              <div className="metric-label">Completion Rate</div>
            </div>
          </div>
        </Card>

        <Card className="overview-card">
          <div className="overview-metric">
            <div className="metric-icon">✓</div>
            <div>
              <div className="metric-value">{overview.completedTasks}/{overview.totalTasks}</div>
              <div className="metric-label">Tasks Completed</div>
            </div>
          </div>
        </Card>

        <Card className="overview-card">
          <div className="overview-metric">
            <div className="metric-icon">⚡</div>
            <div>
              <div className="metric-value">{overview.inProgressTasks}</div>
              <div className="metric-label">In Progress</div>
            </div>
          </div>
        </Card>

        <Card className="overview-card">
          <div className="overview-metric">
            <div className="metric-icon">🎯</div>
            <div>
              <div className="metric-value">{overview.highPriorityTasks}</div>
              <div className="metric-label">High Priority</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="analytics-grid">
        <Card className="chart-card">
          <h2 className="chart-title">Task Completion Trend</h2>
          <p className="chart-subtitle">Last 7 days</p>
          <div className="bar-chart">
            {taskTrend.map((day, index) => {
              const maxValue = Math.max(...taskTrend.map(d => d.completed));
              const height = (day.completed / maxValue) * 100;
              
              return (
                <div key={index} className="bar-container">
                  <div className="bar-value">{day.completed}</div>
                  <div 
                    className="bar" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="bar-label">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="chart-card">
          <h2 className="chart-title">Project Progress</h2>
          <p className="chart-subtitle">Current status of all projects</p>
          <div className="progress-list">
            {projectStats.map((project, index) => (
              <div key={index} className="progress-item">
                <div className="progress-item-header">
                  <span className="progress-item-name">{project.name}</span>
                  <span className="progress-item-value">{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="progress-item-footer">
                  Budget: ${project.budget.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="chart-card">
        <WorkingHoursChart employees={teamProductivity.map(m => m.name)} />
      </Card>

      <Card className="chart-card">
        <ProjectNetworkChart teamProductivity={teamProductivity} projectStats={projectStats} />
      </Card>

      <Card className="chart-card">
        <h2 className="chart-title">Team Productivity</h2>
        <p className="chart-subtitle">Tasks completed and hours logged per team member</p>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Tasks Completed</th>
                <th>Hours Logged</th>
                <th>Avg. Hours/Task</th>
              </tr>
            </thead>
            <tbody>
              {teamProductivity.map((member, index) => (
                <tr key={index}>
                  <td className="member-cell">{member.name}</td>
                  <td>{member.tasksCompleted}</td>
                  <td>{member.hoursLogged}h</td>
                  <td>{(member.hoursLogged / member.tasksCompleted).toFixed(1)}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="analytics-grid">
        <Card className="stat-detail-card">
          <h3>Task Distribution</h3>
          <div className="stat-detail-grid">
            <div className="stat-detail-item">
              <div className="stat-detail-label">To Do</div>
              <div className="stat-detail-value stat-todo">{overview.todoTasks}</div>
            </div>
            <div className="stat-detail-item">
              <div className="stat-detail-label">In Progress</div>
              <div className="stat-detail-value stat-progress">{overview.inProgressTasks}</div>
            </div>
            <div className="stat-detail-item">
              <div className="stat-detail-label">Completed</div>
              <div className="stat-detail-value stat-completed">{overview.completedTasks}</div>
            </div>
          </div>
        </Card>

        <Card className="stat-detail-card">
          <h3>Project Status</h3>
          <div className="stat-detail-grid">
            <div className="stat-detail-item">
              <div className="stat-detail-label">Active Projects</div>
              <div className="stat-detail-value stat-active">{overview.activeProjects}</div>
            </div>
            <div className="stat-detail-item">
              <div className="stat-detail-label">Completed</div>
              <div className="stat-detail-value stat-completed">{overview.completedProjects}</div>
            </div>
            <div className="stat-detail-item">
              <div className="stat-detail-label">Team Members</div>
              <div className="stat-detail-value stat-team">{overview.teamMembers}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
