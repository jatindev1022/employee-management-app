
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

function QuickAddModal({ isOpen, onClose }) {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Add Task" size="lg">
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

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  
  const menuItems = [
    { href: '/dashboard', icon: 'ri-dashboard-fill', label: 'Dashboard', color: 'text-blue-600' },
    { href: '/profile', icon: 'ri-user-fill', label: 'Profile', color: 'text-green-600' },
    { href: '/calendar', icon: 'ri-calendar-fill', label: 'Calendar', color: 'text-purple-600' },
    { href: '/tasks', icon: 'ri-task-fill', label: 'Tasks', color: 'text-orange-600' },
    { href: '/inbox', icon: 'ri-message-3-fill', label: 'Inbox', color: 'text-pink-600' },
    { href: '/search', icon: 'ri-search-fill', label: 'Search', color: 'text-indigo-600' },
    { href: '/employees', icon: 'ri-team-fill', label: 'Employees', color: 'text-cyan-600' },
    { href: '/settings', icon: 'ri-settings-fill', label: 'Settings', color: 'text-gray-600' }
  ];
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden z-40 backdrop-blur-sm" 
          onClick={onClose}
        ></div>
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
            <i className="ri-building-fill text-lg text-white w-5 h-5 flex items-center justify-center"></i>

            </div>
            <div>
              <span className="text-xl font-bold tracking-wide">EMS</span>
              <p className="text-xs text-blue-100 -mt-1">Employee Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
          >
            <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* User Profile Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20business%20person%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=40&height=40&seq=sidebar-avatar&orientation=squarish"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Senior Developer</p>
              </div>
            </div>
          </div>
          
          {/* Navigation - Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={onClose}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    pathname === item.href 
                      ? 'bg-blue-100' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <i className={`${item.icon} text-lg w-5 h-5 flex items-center justify-center ${
                      pathname === item.href ? item.color : 'text-gray-600'
                    }`}></i>
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {pathname === item.href && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Quick Actions - Fixed at bottom */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowQuickAddModal(true)}
              className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-add-line text-blue-600 w-5 h-5 flex items-center justify-center"></i>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Quick Add</p>
                  <p className="text-xs text-gray-500">Create new task</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <QuickAddModal 
        isOpen={showQuickAddModal} 
        onClose={() => setShowQuickAddModal(false)} 
      />
    </>
  );
}
