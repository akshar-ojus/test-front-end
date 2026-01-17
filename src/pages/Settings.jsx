// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import './Settings.css';

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Project Manager',
    company: 'Tech Solutions Inc.'
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    notifications: 'all'
  });

  const [themeOptions, setThemeOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [timezoneOptions, setTimezoneOptions] = useState([]);
  const [notificationOptions, setNotificationOptions] = useState([]);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadDropdownOptions();
  }, []);

  const loadDropdownOptions = async () => {
    const [themes, languages, timezones, notifications] = await Promise.all([
      api.getThemes(),
      api.getLanguages(),
      api.getTimezones(),
      api.getNotificationOptions()
    ]);
    setThemeOptions(themes);
    setLanguageOptions(languages);
    setTimezoneOptions(timezones);
    setNotificationOptions(notifications);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Manage your account settings and preferences</p>
      </div>

      {saved && (
        <div className="success-banner">
          <span className="success-icon">✓</span>
          Settings saved successfully!
        </div>
      )}

      <div className="settings-grid">
        <Card className="settings-card">
          <h2 className="settings-section-title">Profile Information</h2>
          <form onSubmit={handleProfileSubmit}>
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Role"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              placeholder="Enter your role"
              required
            />

            <Input
              label="Company"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              placeholder="Enter company name"
              required
            />

            <Button type="submit" fullWidth>Save Profile</Button>
          </form>
        </Card>

        <Card className="settings-card">
          <h2 className="settings-section-title">Preferences</h2>
          <form onSubmit={handlePreferencesSubmit}>
            <Select
              label="Theme"
              value={preferences.theme}
              onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
              options={themeOptions}
              required
            />

            <Select
              label="Language"
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              options={languageOptions}
              required
            />

            <Select
              label="Timezone"
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              options={timezoneOptions}
              required
            />

            <Select
              label="Notifications"
              value={preferences.notifications}
              onChange={(e) => setPreferences({ ...preferences, notifications: e.target.value })}
              options={notificationOptions}
              required
            />

            <Button type="submit" fullWidth>Save Preferences</Button>
          </form>
        </Card>
      </div>

      <Card className="settings-card">
        <h2 className="settings-section-title">Security</h2>
        <div className="security-options">
          <div className="security-item">
            <div>
              <h4>Change Password</h4>
              <p>Update your password to keep your account secure</p>
            </div>
            <Button variant="secondary">Change</Button>
          </div>
          
          <div className="security-item">
            <div>
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to your account</p>
            </div>
            <Button variant="secondary">Enable</Button>
          </div>
          
          <div className="security-item">
            <div>
              <h4>Active Sessions</h4>
              <p>Manage devices where you're signed in</p>
            </div>
            <Button variant="secondary">View</Button>
          </div>
        </div>
      </Card>

      <Card className="settings-card">
        <h2 className="settings-section-title">Data & Privacy</h2>
        <div className="privacy-options">
          <div className="privacy-item">
            <div>
              <h4>Export Data</h4>
              <p>Download a copy of your data</p>
            </div>
            <Button variant="outline">Export</Button>
          </div>
          
          <div className="privacy-item">
            <div>
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all data</p>
            </div>
            <Button variant="danger">Delete</Button>
          </div>
        </div>
      </Card>

      <Card className="settings-card info-card">
        <div className="info-content">
          <div className="info-icon">ℹ️</div>
          <div>
            <h4>Need Help?</h4>
            <p>Check out our documentation or contact support for assistance with any settings.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
