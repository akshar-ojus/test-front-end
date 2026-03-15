// Dashboard.jsx --- Main dashboard page showing project stats, recent tasks, and upcoming deadlines
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';
import './Dashboard.css';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const dashboardData = await api.getDashboardSummary();
      setData(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullPage />;
  }

  const { stats, recentTasks, upcomingDeadlines } = data;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening with your projects.</p>
      </div>

      <div className="stats-grid">
        <Card className="stat-card stat-primary">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalProjects}</div>
            <div className="stat-label">Total Projects</div>
            <div className="stat-detail">{stats.activeProjects} active</div>
          </div>
        </Card>

        <Card className="stat-card stat-success">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedTasks}/{stats.totalTasks}</div>
            <div className="stat-label">Tasks Completed</div>
            <div className="stat-detail">
              {Math.round((stats.completedTasks / stats.totalTasks) * 100)}% completion rate
            </div>
          </div>
        </Card>

        <Card className="stat-card stat-info">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.teamMembers}</div>
            <div className="stat-label">Team Members</div>
            <div className="stat-detail">All active</div>
          </div>
        </Card>

        <Card className="stat-card stat-warning">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.tasksThisWeek}</div>
            <div className="stat-label">Tasks This Week</div>
            <div className="stat-detail">Across all projects</div>
          </div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card className="dashboard-section">
          <h2 className="section-title">Recent Tasks</h2>
          <div className="tasks-list">
            {recentTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <span className={`badge badge-${task.status}`}>{task.status}</span>
                  </div>
                </div>
                <div className="task-date">{task.dueDate}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="dashboard-section">
          <h2 className="section-title">Upcoming Deadlines</h2>
          <div className="deadlines-list">
            {upcomingDeadlines.map(task => (
              <div key={task.id} className="deadline-item">
                <div className="deadline-dot"></div>
                <div className="deadline-info">
                  <div className="deadline-title">{task.title}</div>
                  <div className="deadline-date">Due: {task.dueDate}</div>
                </div>
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn action-primary">
            <span className="action-icon">➕</span>
            <div>
              <div className="action-title">Create Task</div>
              <div className="action-desc">Add a new task to your workflow</div>
            </div>
          </button>
          <button className="action-btn action-secondary">
            <span className="action-icon">📁</span>
            <div>
              <div className="action-title">New Project</div>
              <div className="action-desc">Start a new project</div>
            </div>
          </button>
          <button className="action-btn action-tertiary">
            <span className="action-icon">👥</span>
            <div>
              <div className="action-title">Invite Team</div>
              <div className="action-desc">Add team members</div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}
