// Team.jsx --- Page for managing team members, including listing, adding, editing, and removing members
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import Loading from '../components/Loading';
import './Team.css';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [avatarOptions, setAvatarOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    avatar: '👤',
    status: 'active'
  });

  useEffect(() => {
    loadTeamMembers();
    loadDropdownOptions();
  }, []);

  const loadDropdownOptions = async () => {
    const [statuses, avatars] = await Promise.all([
      api.getTeamStatuses(),
      api.getAvatars()
    ]);
    setStatusOptions(statuses);
    setAvatarOptions(avatars);
  };

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await api.getTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar,
        status: member.status
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        avatar: '👤',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await api.updateTeamMember(editingMember.id, formData);
      } else {
        await api.createTeamMember(formData);
      }
      closeModal();
      loadTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        await api.deleteTeamMember(id);
        loadTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  if (loading) {
    return <Loading fullPage />;
  }

  return (
    <div className="team">
      <div className="page-header">
        <div>
          <h1>Team Members</h1>
          <p className="page-subtitle">Manage your team and their assignments</p>
        </div>
        <Button onClick={() => openModal()}>+ Add Member</Button>
      </div>

      <div className="team-grid">
        {teamMembers.map(member => (
          <Card key={member.id} className="member-card" hover>
            <div className="member-avatar-large">{member.avatar}</div>
            
            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-email">{member.email}</p>
              
              <div className="member-status">
                <span className={`badge badge-${member.status}`}>{member.status}</span>
              </div>
            </div>

            <div className="member-stats">
              <div className="stat-box">
                <div className="stat-number">{member.tasksCount}</div>
                <div className="stat-text">Tasks</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">{member.projectsCount}</div>
                <div className="stat-text">Projects</div>
              </div>
            </div>

            <div className="member-footer">
              <span className="join-date">Joined: {member.joinDate}</span>
            </div>

            <div className="member-actions">
              <Button variant="secondary" size="small" fullWidth onClick={() => openModal(member)}>
                Edit
              </Button>
              <Button variant="danger" size="small" fullWidth onClick={() => handleDelete(member.id)}>
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter member name"
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email address"
            required
          />

          <Input
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., Frontend Developer"
            required
          />

          <Select
            label="Avatar"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            options={avatarOptions}
            required
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={statusOptions}
            required
          />

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingMember ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
