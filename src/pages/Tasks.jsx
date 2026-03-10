//tasks.jsx --- Main page for managing tasks, including listing, filtering, creating, editing, and deleting tasks
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Loading from '../components/Loading';
import './Tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    projectId: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    projectId: '',
    assignedTo: '',
    dueDate: ''
  });

  useEffect(() => {
    loadData();
    loadDropdownOptions();
  }, []);

  const loadDropdownOptions = async () => {
    const [statuses, priorities] = await Promise.all([
      api.getTaskStatuses(),
      api.getPriorities()
    ]);
    setStatusOptions(statuses);
    setPriorityOptions(priorities);
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, teamData] = await Promise.all([
        api.getProjects(),
        api.getTeamMembers()
      ]);
      setProjects(projectsData);
      setTeamMembers(teamData);
      await loadTasks();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await api.getTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        projectId: '',
        assignedTo: '',
        dueDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        projectId: parseInt(formData.projectId),
        assignedTo: parseInt(formData.assignedTo)
      };

      if (editingTask) {
        await api.updateTask(editingTask.id, taskData);
      } else {
        await api.createTask(taskData);
      }
      closeModal();
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(id);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown';
  };

  const getAssigneeName = (assignedTo) => {
    const member = teamMembers.find(m => m.id === assignedTo);
    return member ? member.name : 'Unassigned';
  };

  if (loading) {
    return <Loading fullPage />;
  }

  return (
    <div className="tasks">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p className="page-subtitle">Manage and track all your tasks</p>
        </div>
        <Button onClick={() => openModal()}>+ New Task</Button>
      </div>

      <Card className="filters-card">
        <div className="filters">
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={statusOptions}
            placeholder="All Statuses"
          />
          <Select
            label="Priority"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            options={priorityOptions}
            placeholder="All Priorities"
          />
          <Select
            label="Project"
            value={filters.projectId}
            onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
            options={projects.map(p => ({ value: p.id.toString(), label: p.name }))}
            placeholder="All Projects"
          />
        </div>
      </Card>

      <div className="tasks-list">
        {tasks.map(task => (
          <Card key={task.id} className="task-card" hover>
            <div className="task-card-header">
              <div className="task-badges">
                <span className={`badge badge-${task.status}`}>{task.status}</span>
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
              </div>
              <div className="task-card-actions">
                <Button variant="secondary" size="small" onClick={() => openModal(task)}>
                  Edit
                </Button>
                <Button variant="danger" size="small" onClick={() => handleDelete(task.id)}>
                  Delete
                </Button>
              </div>
            </div>

            <h3 className="task-card-title">{task.title}</h3>
            <p className="task-card-description">{task.description}</p>

            <div className="task-card-footer">
              <div className="task-info-items">
                <div className="task-info-item">
                  <span className="info-icon">📁</span>
                  <span>{getProjectName(task.projectId)}</span>
                </div>
                <div className="task-info-item">
                  <span className="info-icon">👤</span>
                  <span>{getAssigneeName(task.assignedTo)}</span>
                </div>
                <div className="task-info-item">
                  <span className="info-icon">📅</span>
                  <span>{task.dueDate}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <Card className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>Create a new task or adjust your filters</p>
        </Card>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter task title"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter task description"
            required
            rows={4}
          />

          <div className="form-row">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={statusOptions}
              required
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={priorityOptions}
              required
            />
          </div>

          <div className="form-row">
            <Select
              label="Project"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              options={projects.map(p => ({ value: p.id.toString(), label: p.name }))}
              placeholder="Select a project"
              required
            />

            <Select
              label="Assigned To"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              options={teamMembers.map(m => ({ value: m.id.toString(), label: m.name }))}
              placeholder="Select team member"
              required
            />
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
