
'use client';

import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import TaskChart from '@/components/dashboard/TaskChart';
import RecentTasks from '@/components/dashboard/RecentTasks';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useState } from 'react';

function QuickAddTaskModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating task:', formData);
    // Task creation logic here
    onClose();
    setFormData({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: ''
    });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            maxLength={500}
            placeholder="Describe the task..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
            <select
              value={formData.assignee}
              onChange={(e) => setFormData({...formData, assignee: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              required
            >
              <option value="">Select assignee</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Mike Johnson">Mike Johnson</option>
              <option value="Sarah Wilson">Sarah Wilson</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}

function AddMemberModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding member:', formData);
    // Member addition logic here
    onClose();
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      phone: ''
    });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter full name..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address..."
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              required
            >
              <option value="">Select role</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              required
            >
              <option value="">Select department</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number..."
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Member</Button>
        </div>
      </form>
    </Modal>
  );
}

function ScheduleMeetingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '30',
    attendees: '',
    description: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Scheduling meeting:', formData);
    // Meeting scheduling logic here
    onClose();
    setFormData({
      title: '',
      date: '',
      time: '',
      duration: '30',
      attendees: '',
      description: ''
    });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Meeting" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter meeting title..."
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
          <input
            type="text"
            value={formData.attendees}
            onChange={(e) => setFormData({...formData, attendees: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter attendee names (comma separated)..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            maxLength={500}
            placeholder="Meeting agenda or description..."
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Schedule Meeting</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Home() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  
  const stats = [
    { title: 'Total Tasks', value: '156', icon: 'ri-task-line', color: 'blue', trend: { type: 'increase', value: '12%' } },
    { title: 'Completed', value: '89', icon: 'ri-check-line', color: 'green', trend: { type: 'increase', value: '8%' } },
    { title: 'In Progress', value: '42', icon: 'ri-time-line', color: 'yellow', trend: { type: 'decrease', value: '3%' } },
    { title: 'Active Users', value: '24', icon: 'ri-user-line', color: 'purple', trend: { type: 'increase', value: '5%' } }
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p>Welcome back! Here&apos;s what&apos;s happening with your team today.</p>

      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TaskChart />
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setShowTaskModal(true)}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <i className="ri-add-line text-blue-600 mr-3 w-5 h-5 flex items-center justify-center"></i>
                <span className="text-blue-600 font-medium">Create New Task</span>
              </div>
              <i className="ri-arrow-right-line text-blue-600 w-4 h-4 flex items-center justify-center"></i>
            </button>
            <button 
              onClick={() => setShowMemberModal(true)}
              className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <i className="ri-user-add-line text-green-600 mr-3 w-5 h-5 flex items-center justify-center"></i>
                <span className="text-green-600 font-medium">Add Team Member</span>
              </div>
              <i className="ri-arrow-right-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
            </button>
            <button 
              onClick={() => setShowMeetingModal(true)}
              className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <i className="ri-calendar-event-line text-purple-600 mr-3 w-5 h-5 flex items-center justify-center"></i>
                <span className="text-purple-600 font-medium">Schedule Meeting</span>
              </div>
              <i className="ri-arrow-right-line text-purple-600 w-4 h-4 flex items-center justify-center"></i>
            </button>
          </div>
        </div>
      </div>
      
      <RecentTasks />
      
      <QuickAddTaskModal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} />
      <AddMemberModal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} />
      <ScheduleMeetingModal isOpen={showMeetingModal} onClose={() => setShowMeetingModal(false)} />
    </Layout>
  );
}