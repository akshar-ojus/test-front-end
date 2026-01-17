import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import './Profile.css';

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [profileData, tasksData, projectsData, activityData, statsData] = await Promise.all([
        api.getUserProfile(userId),
        api.getUserTasks(userId),
        api.getUserProjects(userId),
        api.getUserActivity(userId),
        api.getUserStats(userId)
      ]);
      
      setProfile(profileData);
      setTasks(tasksData);
      setProjects(projectsData);
      setActivity(activityData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullPage />;
  }

  return (
    <div className="profile">
      <Card className="profile-header-card">
        <div className="profile-header">
          <div className="profile-avatar-large">{profile.avatar}</div>
          <div className="profile-info">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-role">{profile.role}</p>
            <p className="profile-email">{profile.email}</p>
            <div className="profile-meta">
              <span className="profile-meta-item">
                <span className="meta-icon">📅</span>
                Joined {profile.joinDate}
              </span>
              <span className="profile-meta-item">
                <span className="meta-icon">📍</span>
                {profile.location}
              </span>
              <span className={`badge badge-${profile.status}`}>{profile.status}</span>
            </div>
          </div>
          <Button variant="secondary">Edit Profile</Button>
        </div>
      </Card>

      <div className="profile-stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedTasks}</div>
            <div className="stat-label">Tasks Completed</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeProjects}</div>
            <div className="stat-label">Active Projects</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.hoursLogged}h</div>
            <div className="stat-label">Hours Logged</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </Card>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks ({tasks.length})
        </button>
        <button 
          className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects ({projects.length})
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="profile-content">
          <Card className="profile-section">
            <h2>About</h2>
            <p className="about-text">{profile.bio}</p>
            
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{profile.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Manager</span>
                <span className="detail-value">{profile.manager}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{profile.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Timezone</span>
                <span className="detail-value">{profile.timezone}</span>
              </div>
            </div>
          </Card>

          <Card className="profile-section">
            <h2>Skills</h2>
            <div className="skills-container">
              {profile.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'tasks' && (
        <Card className="profile-section">
          <h2>Assigned Tasks</h2>
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <h4 className="task-title">{task.title}</h4>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className={`badge badge-${task.status}`}>{task.status}</span>
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <span className="task-date">Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'projects' && (
        <Card className="profile-section">
          <h2>Projects</h2>
          <div className="projects-list">
            {projects.map(project => (
              <div key={project.id} className="project-item">
                <div className="project-header">
                  <h4 className="project-title">{project.name}</h4>
                  <span className={`badge badge-${project.status}`}>{project.status}</span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card className="profile-section">
          <h2>Recent Activity</h2>
          <div className="activity-timeline">
            {activity.map((item, index) => (
              <div key={index} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-action">{item.action}</span>
                    <span className="activity-time">{item.timestamp}</span>
                  </div>
                  <p className="activity-description">{item.description}</p>
                  {item.target && (
                    <span className="activity-target">{item.target}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
