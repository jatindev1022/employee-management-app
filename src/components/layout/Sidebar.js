
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, setProjects } from '@/store/slices/projectSlice';
import { fetchTasksByProject ,updateTaskStatus ,addTask} from "@/store/slices/taskSlice";

function QuickAddModal({ isOpen, onClose }) {
  const initialState = {
    project: '',
    title: '',
    description: '',
    assignee: [],
    priority: 'medium',
    dueDate: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  // const [projectList, setProjectList] = useState([]);

  const dispatch = useDispatch();
  const projectList = useSelector(state => state.project.projects);

  const [projectMembers, setProjectMembers] = useState([]);

  // 🧼 Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialState);
      setErrors({});
      setProjectMembers([]);
    }
  }, [isOpen]);

  // 🧠 Fetch all projects
  useEffect(()=>{
    dispatch(fetchProjects());
  },[dispatch]);

  // 🧠 Handle project change and fetch members
  const handleProjectChange = async (e) => {
    const selectedProjectId = e.target.value;
    setFormData(prev => ({ ...prev, project: selectedProjectId, assignee: [] }));
    
    // Clear project error when user selects a project
    if (errors.project) {
      setErrors(prev => ({ ...prev, project: '' }));
    }

    const selectedProject = projectList.find(p => String(p._id) === String(selectedProjectId));

    if (!selectedProject) {
      setProjectMembers([]);
      return;
    }

    try {
      const query = selectedProject.members.map(id => `_id=${id}`).join('&');
      const res = await fetch(`/api/users?${query}`);
      const users = await res.json();
      setProjectMembers(Array.isArray(users) ? users : []);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setProjectMembers([]);
    }
  };

  // 📥 Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ Validate form before submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.project) newErrors.project = 'Project is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description || formData.description.length < 10)
      newErrors.description = 'Description must be at least 10 characters';
    if (formData.assignee.length === 0) newErrors.assignee = 'Select at least one assignee';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Submit task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Task created:', data.task);
        dispatch(addTask(data.task)); 
        setFormData(initialState); // ✅ Reset on success
        setErrors({});
        onClose(); // ✅ Close modal
        toast.success('Task added successfully!');

      } else {
        toast.error(data.message || 'Failed to add task');
        console.error('Create failed:', data.error);
      }
    } catch (error) {
      toast.error(data.message || 'Error submitting task');
      console.error('Error submitting task:', error);
    }
  };

  // Handle assignee selection change
  const handleAssigneeChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
    setFormData(prev => ({ ...prev, assignee: selected }));
    
    // Clear assignee error when user selects someone
    if (errors.assignee && selected.length > 0) {
      setErrors(prev => ({ ...prev, assignee: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 🟦 Project */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
          <select
            value={formData.project}
            onChange={handleProjectChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
              errors.project ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
        <option value="">Select a project</option>
          {projectList.length > 0 &&
            projectList.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}

          </select>
          {errors.project && <p className="text-red-500 text-sm mt-1">{errors.project}</p>}
        </div>

        {/* 🟦 Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
              errors.title ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter task title..."
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* 🟦 Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-sm resize-none ${
              errors.description ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
            rows={3}
            placeholder="Minimum 10 characters"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* 🟦 Assignee + Priority */}
        <div className="grid grid-cols-2 gap-4">
          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
            <select
              multiple
              value={formData.assignee}
              onChange={handleAssigneeChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                errors.assignee ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              {projectMembers.map(m => (
                <option key={m._id} value={m._id}>
                  {m.firstName ? `${m.firstName} ${m.lastName}` : m.email}
                </option>
              ))}
            </select>
            {errors.assignee && <p className="text-red-500 text-sm mt-1">{errors.assignee}</p>}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* 🟦 Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
              errors.dueDate ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
        </div>

        {/* 🟦 Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setFormData(initialState);
              setErrors({});
            }}
          >
            Cancel
          </Button>
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
    { href: '/project', icon: 'ri-folder-chart-fill', label: 'Project', color: 'text-orange-600' },
    // { href: '/tasks', icon: 'ri-task-fill', label: 'Tasks', color: 'text-orange-600' },
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
          
          <div className="w-10 h-10 bg-white bg-opacity-30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-20 overflow-hidden">
            <img
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=130,h=130,fit=crop/A1awWRzoxRUeVrW4/header_logo-icon-A85E1R09Z8F8OJ4p.png"
              alt="Team"
              className="w-full h-full object-contain"
            />
          </div>

            <div>
              <span className="text-xl font-bold tracking-wide">Breep Sofbiz</span>
              {/* <p className="text-xs text-blue-100 -mt-1">Employee Management</p> */}
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
