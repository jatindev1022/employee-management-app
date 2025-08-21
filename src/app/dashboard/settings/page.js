'use client';

import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useState } from 'react';

function AccountSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    taskReminders: true,
    teamUpdates: true
  });
  
  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <button
            onClick={() => handleToggle('emailNotifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-500">Receive push notifications in browser</p>
          </div>
          <button
            onClick={() => handleToggle('pushNotifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
            <p className="text-sm text-gray-500">Get weekly summary of your activities</p>
          </div>
          <button
            onClick={() => handleToggle('weeklyReports')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.weeklyReports ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Task Reminders</h4>
            <p className="text-sm text-gray-500">Get reminders for upcoming deadlines</p>
          </div>
          <button
            onClick={() => handleToggle('taskReminders')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.taskReminders ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.taskReminders ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex items-center justify-between py-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Team Updates</h4>
            <p className="text-sm text-gray-500">Receive updates about team activities</p>
          </div>
          <button
            onClick={() => handleToggle('teamUpdates')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.teamUpdates ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.teamUpdates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Handle password change logic
    console.log('Password changed');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Security & Configuration</h3>
      
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <Button type="submit" className="mt-6">
          Update Password
        </Button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <Button variant="outline">
            <i className="ri-shield-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            Enable 2FA
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light'
  });
  
  const handlePreferenceChange = (key, value) => {
    setPreferences({ ...preferences, [key]: value });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={preferences.language}
            onChange={(e) => handlePreferenceChange('language', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={preferences.timezone}
            onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select
            value={preferences.theme}
            onChange={(e) => handlePreferenceChange('theme', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>
      
      <Button className="mt-6">Save Preferences</Button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  
  const tabs = [
    { id: 'account', label: 'Account', icon: 'ri-user-settings-line' },
    { id: 'security', label: 'Security', icon: 'ri-shield-line' },
    { id: 'preferences', label: 'Preferences', icon: 'ri-settings-3-line' }
  ];
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`${tab.icon} text-lg`}></i>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'preferences' && <PreferencesSettings />}
          </div>
        </div>
      </div>
    </Layout>
  );
}