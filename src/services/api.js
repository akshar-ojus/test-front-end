// API Service - Makes real HTTP calls to backend endpoints.
// No simulated data, no fallbacks - just API calls.

const API_BASE_URL = 'https://api.taskhub-backend.com/v1';

// Helper to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// API Methods - Direct backend calls, no data manipulation
export const api = {
  // Tasks
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/tasks?${params}`);
    return handleResponse(response);
  },

  getTaskById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return handleResponse(response);
  },

  createTask: async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  updateTask: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Projects
  getProjects: async (status = null) => {
    const params = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/projects${params}`);
    return handleResponse(response);
  },

  getProjectById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    return handleResponse(response);
  },

  createProject: async (projectData) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    return handleResponse(response);
  },

  updateProject: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  deleteProject: async (id) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Team Members
  getTeamMembers: async (status = null) => {
    const params = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/team${params}`);
    return handleResponse(response);
  },

  getTeamMemberById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/team/${id}`);
    return handleResponse(response);
  },

  createTeamMember: async (memberData) => {
    const response = await fetch(`${API_BASE_URL}/team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    return handleResponse(response);
  },

  updateTeamMember: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  deleteTeamMember: async (id) => {
    const response = await fetch(`${API_BASE_URL}/team/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Analytics
  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    return handleResponse(response);
  },

  // Dashboard Summary
  getDashboardSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    return handleResponse(response);
  },

  // Metadata endpoints for dropdown options
  getTaskStatuses: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/task-statuses`);
    return handleResponse(response);
  },

  getPriorities: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/priorities`);
    return handleResponse(response);
  },

  getProjectStatuses: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/project-statuses`);
    return handleResponse(response);
  },

  getTeamStatuses: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/team-statuses`);
    return handleResponse(response);
  },

  getAvatars: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/avatars`);
    return handleResponse(response);
  },

  getRoles: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/roles`);
    return handleResponse(response);
  },

  getThemes: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/themes`);
    return handleResponse(response);
  },

  getLanguages: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/languages`);
    return handleResponse(response);
  },

  getTimezones: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/timezones`);
    return handleResponse(response);
  },

  getNotificationOptions: async () => {
    const response = await fetch(`${API_BASE_URL}/metadata/notification-options`);
    return handleResponse(response);
  },

  // User Profile
  getUserProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`);
    return handleResponse(response);
  },

  getUserTasks: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/tasks`);
    return handleResponse(response);
  },

  getUserProjects: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/projects`);
    return handleResponse(response);
  },

  getUserActivity: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/activity`);
    return handleResponse(response);
  },

  getUserStats: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`);
    return handleResponse(response);
  },

  updateUserProfile: async (userId, profileData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },
};
