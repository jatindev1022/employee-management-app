
'use client';

import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import TaskChart from '@/components/dashboard/TaskChart';
import RecentTasks from '@/components/dashboard/RecentTasks';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, setProjects } from '@/store/slices/projectSlice';
import api from '@/lib/apiClient';


function QuickAddTaskModal({ isOpen, onClose }) {
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
  const dispatch = useDispatch();
  const projectList = useSelector(state => state.project.projects);
  const [projectMembers, setProjectMembers] = useState([]);

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialState);
      setErrors({});
      setProjectMembers([]);
    }
  }, [isOpen]);

  // Fetch all projects
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Handle project change
  const handleProjectChange = async (e) => {
    const selectedProjectId = e.target.value;
    setFormData(prev => ({ ...prev, project: selectedProjectId, assignee: [] }));
    if (errors.project) setErrors(prev => ({ ...prev, project: '' }));

    const selectedProject = projectList.find(p => String(p._id) === String(selectedProjectId));
    if (!selectedProject) return setProjectMembers([]);

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

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate
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

  // Submit
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
        toast.success('Task added successfully!');
        setFormData(initialState);
        setErrors({});
        onClose();
      } else {
        toast.error(data.message || 'Failed to add task');
      }
    } catch (error) {
      toast.error('Error submitting task');
      console.error(error);
    }
  };

  // Assignee checkbox toggle
  const handleAssigneeToggle = (id) => {
    setErrors(prev => ({ ...prev, assignee: '' }));
    setFormData(prev => {
      const updated = prev.assignee.includes(id)
        ? prev.assignee.filter(a => a !== id)
        : [...prev.assignee, id];
      return { ...prev, assignee: updated };
    });
  };

  // Remove assignee
  const handleRemoveAssignee = (id) => {
    setFormData(prev => ({
      ...prev,
      assignee: prev.assignee.filter(a => a !== id)
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Project */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
          <select
            value={formData.project}
            onChange={handleProjectChange}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
              errors.project ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">-- Choose a project --</option>
            {projectList.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          {errors.project && <p className="text-red-500 text-sm mt-1">{errors.project}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${
              errors.title ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter task title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
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

        {/* Assignees + Priority */}
        {/* Assignees + Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Assignees
            </label>

            {/* Checkbox list */}
            {formData.project && projectMembers.length > 0 && (
              <div
                className={`max-h-32 overflow-y-auto border rounded-lg p-2 space-y-2 ${
                  errors.assignee ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {projectMembers.map((m) => (
                  <label
                    key={m._id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignee.includes(m._id)}
                      onChange={() => handleAssigneeToggle(m._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span>
                      {m.firstName ? `${m.firstName} ${m.lastName}` : m.email}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* No members available */}
            {formData.project && projectMembers.length === 0 && (
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span className="text-sm text-yellow-800 font-medium">
                    No members in this project
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-1 ml-7">
                  This project doesn’t have any members yet. Contact your administrator
                  to add members.
                </p>
              </div>
            )}

            {/* Project not selected */}
            {!formData.project && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.196-2.132M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.132M7 20v-2c0-.656.126-1.283.356-1.857M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">
                    Select a project to view members
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  Choose a project from the dropdown above to see available assignees
                </p>
              </div>
            )}

            {errors.assignee && (
              <p className="text-red-500 text-xs mt-1">{errors.assignee}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>



        {/* Selected Assignees */}
        {formData.assignee.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selected Assignees ({formData.assignee.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.assignee.map(id => {
                const user = projectMembers.find(u => u._id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {user ? `${user.firstName} ${user.lastName}` : id}
                    <button
                      type="button"
                      onClick={() => handleRemoveAssignee(id)}
                      className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-sm ${
              errors.dueDate ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
        </div>

        {/* Buttons */}
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





function AddMemberModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    team: '',
    position: '',
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return 'This field is required';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        // simple email regex
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email';
        break;
      case 'team':
        if (!value) return 'Select a team';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // remove error as user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await api.post('/users', formData);

      if (res.data?.success) {
        toast.success('Member added successfully!');

        if (res.data.tempPassword) {
          toast(`Temporary password: ${res.data.tempPassword}`, { icon: 'ℹ️' });
        }

        handleClose(); // reset & close
      } else {
        toast.error(res.data?.message || 'Failed to add member');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      team: '',
      position: '',
    });
    setErrors({});
    onClose();
  };

  const inputClass = (name) =>
    `w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[name] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Team Member" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass('firstName')}
              placeholder="Enter first name..."
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass('lastName')}
              placeholder="Enter last name..."
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass('email')}
              placeholder="Enter email..."
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass('phone')}
              placeholder="Enter phone..."
            />
          </div>

          {/* Team dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <select
              name="team"
              value={formData.team}
              onChange={handleChange}
              className={inputClass('team')}
            >
              <option value="">Select a team</option>
              <option value="frontend">Frontend Team</option>
              <option value="design">Design Team</option>
              <option value="backend">Backend Team</option>
              <option value="sales">Sales</option>
              <option value="hr">HR</option>
            </select>
            {errors.team && <p className="text-red-500 text-sm mt-1">{errors.team}</p>}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={inputClass('position')}
              placeholder="Enter position..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
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
        <Toaster position="top-right" reverseOrder={false} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p>Welcome back!</p>

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