import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Loading from '../components/Loading';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        budget: project.budget
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        startDate: '',
        endDate: '',
        budget: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, formData);
      } else {
        await api.createProject(formData);
      }
      closeModal();
      loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      try {
        await api.deleteProject(id);
        loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const statusOptions = [
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' }
  ];

  if (loading) {
    return <Loading fullPage />;
  }

  return (
    <div className="projects">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="page-subtitle">Manage and track all your projects</p>
        </div>
        <Button onClick={() => openModal()}>+ New Project</Button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <Card key={project.id} className="project-card" hover>
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`badge badge-${project.status}`}>{project.status}</span>
            </div>
            <p className="project-description">{project.description}</p>
            
            <div className="project-progress">
              <div className="progress-header">
                <span>Progress</span>
                <span className="progress-value">{project.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="project-meta">
              <div className="meta-item">
                <span className="meta-label">Start Date</span>
                <span className="meta-value">{project.startDate}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">End Date</span>
                <span className="meta-value">{project.endDate}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Budget</span>
                <span className="meta-value">${project.budget.toLocaleString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Team Size</span>
                <span className="meta-value">{project.teamSize} members</span>
              </div>
            </div>

            <div className="project-actions">
              <Button variant="secondary" size="small" onClick={() => openModal(project)}>
                Edit
              </Button>
              <Button variant="danger" size="small" onClick={() => handleDelete(project.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter project name"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter project description"
            required
            rows={4}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={statusOptions}
            required
          />

          <div className="form-row">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />

            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <Input
            label="Budget"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="Enter budget amount"
            required
          />

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingProject ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
