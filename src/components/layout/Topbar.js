
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '../ui/Modal';
import Button from '@/components/ui/Button';
import { Toaster, toast } from 'react-hot-toast';
import { addProject } from '@/store/slices/projectSlice';
import { useDispatch, useSelector } from "react-redux";
import api from '@/lib/apiClient';

import { fetchTeamMembers } from "@/store/slices/teamMemberSlice";
import Image from 'next/image';
import { fetchUserById } from "@/store/slices/userSlice";


export default function Topbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProjectModel,setshowAddProjectModel]= useState(false);
  const router = useRouter();
  
  const notifications = [
    { id: 1, title: 'New task assigned', message: 'UI Design for Dashboard', time: '2 mins ago', unread: true },
    { id: 2, title: 'Task completed', message: 'Backend API Integration', time: '1 hour ago', unread: true },
    { id: 3, title: 'Meeting reminder', message: 'Team standup in 15 minutes', time: '2 hours ago', unread: false }
  ];
  
  const unreadCount = notifications.filter(n => n.unread).length;
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { 
        method: "POST",
        credentials: 'include' // ✅ FIXED: Include cookies
      });
      
      if (res.ok) {
        // console.log('here');
        localStorage.removeItem('userId');
        toast.success('Logged out successfully');
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push("/login"); // Still redirect on error
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    
    if (showNotifications || showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showNotifications, showUserMenu]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch]);
  
  const defaultAvatar =
  "https://readdy.ai/api/search-image?query=professional%20business%20person%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=40&height=40&seq=sidebar-avatar&orientation=squarish";

if (!user) return null; // optional: loading state
  
  
function AddProjectModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team: '',
    members: [],
    startDate: '',
    endDate: '',
    priority: 'medium',
  });

  const [availableMembers, setAvailableMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState({});
  const dispatch = useDispatch();

  const { membersByTeam, loading: membersLoading, error: membersError } =
    useSelector((state) => state.team);

  useEffect(() => {
    if (isOpen && Object.keys(membersByTeam).length === 0) {
      dispatch(fetchTeamMembers());
    }
  }, [isOpen, dispatch, membersByTeam]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Must be at least 10 characters';
    }
    if (!formData.team) newErrors.team = 'Team selection is required';
    if (formData.members.length === 0) newErrors.members = 'Select at least one member';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: '' }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamChange = (e) => {
    const team = e.target.value;
    setErrors((prev) => ({ ...prev, team: '', members: '' }));
    setFormData((prev) => ({ ...prev, team, members: [] }));
    setAvailableMembers(membersByTeam[team] || []);
  };

  // Updated member selection handler for checkboxes
  const handleMemberToggle = (memberId) => {
    setErrors((prev) => ({ ...prev, members: '' }));
    setFormData((prev) => {
      const updatedMembers = prev.members.includes(memberId)
        ? prev.members.filter(id => id !== memberId)
        : [...prev.members, memberId];
      
      return { ...prev, members: updatedMembers };
    });
  };

  // Remove member from selected list
  const handleRemoveMember = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter(id => id !== memberId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      console.log('📥 data received:', resData);
      
      if (res.ok && resData.success) {
        const newProject = {
          ...resData.data,
          id: resData.data._id,
        };
      
        dispatch(addProject(newProject));
        
        toast.success('New project added successfully!');
        setFormData({
          name: '',
          description: '',
          team: '',
          members: [],
          startDate: '',
          endDate: '',
          priority: 'medium',
        });
        setAvailableMembers([]);
        onClose();
      } else {
        toast.error(resData.message || 'Failed to add new project');
      }
    } catch (err) {
      toast.error('Server error');
      console.error('❌ Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add new Project" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
              errors.name ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter project name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-none ${
              errors.description ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
            rows={3}
            placeholder="Minimum 10 characters"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Team and Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <select
              name="team"
              value={formData.team}
              onChange={handleTeamChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-sm ${
                errors.team ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">-- Choose a team --</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="design">Design</option>
            </select>
            {errors.team && <p className="text-red-500 text-sm mt-1">{errors.team}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Team Members
            </label>

            {/* Loading state */}
            {membersLoading && formData.team && (
              <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading members...
              </div>
            )}

            {/* Checkbox list for team members */}
            {!membersLoading && availableMembers.length > 0 && (
              <div className={`max-h-32 overflow-y-auto border rounded-lg p-2 space-y-2 ${
                errors.members ? 'border-red-500' : 'border-gray-300'
              }`}>
                {availableMembers.map((member) => (
                  <label
                    key={member._id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.members.includes(member._id)}
                      onChange={() => handleMemberToggle(member._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">{member.name}</span>
                  </label>
                ))}
              </div>
            )}

            {/* No members available */}
            {!membersLoading && formData.team && availableMembers.length === 0 && (
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-yellow-800 font-medium">No members in this team</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1 ml-7">This team doesn't have any members yet. Contact your administrator to add members.</p>
              </div>
            )}

            {/* Team not selected */}
            {!formData.team && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.132M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.132M7 20v-2c0-.656.126-1.283.356-1.857M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">Select a team to view members</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-7">Choose a team from the dropdown above to see available team members</p>
              </div>
            )}

            {errors.members && (
              <p className="text-red-500 text-xs mt-1">{errors.members}</p>
            )}
          </div>
        </div>

        {/* Selected Members Display */}
        {formData.members.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Members ({formData.members.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.members.map((memberId) => {
                const member = availableMembers.find((mem) => mem._id === memberId);
                return (
                  <span
                    key={memberId}
                    className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {member?.name || memberId}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(memberId)}
                      className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-sm ${
                errors.startDate ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-sm ${
                errors.endDate ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
  
  
  return (
    <>
      
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          >
            <i className="ri-menu-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">Employee Management</h1>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md ml-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400 text-sm w-4 h-4 flex items-center justify-center"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks, employees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
              />
              {searchTerm && (
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i className="ri-arrow-right-line text-gray-400 hover:text-blue-500 text-sm w-4 h-4 flex items-center justify-center"></i>
                </button>
              )}
            </form>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Mobile Search */}
          <Link href="/search" className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 md:hidden">
            <i className="ri-search-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </Link>

          {/* Add New Project */}
          

          <Button onClick={()=>setshowAddProjectModel(true)}>Create New Project</Button>

              
          
          {/* Notifications */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative transition-colors"
            >
              <i className="ri-notification-line text-xl w-6 h-6 flex items-center justify-center"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 border">
                <div className="py-1">
                  <div className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span>Notifications</span>
                      <button className="text-blue-600 hover:text-blue-800 text-xs">Mark all read</button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${notification.unread ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative dropdown-container">
          <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Image
                key={user.profileImage || "default-avatar"}
                src={user.profileImage || defaultAvatar}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover ring-2 ring-gray-200"
              />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user.firstName || "John"} {user.lastName || "Doe"}
              </span>
              <i className="ri-arrow-down-s-line text-gray-400 w-4 h-4 flex items-center justify-center"></i>
            </button>

            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 border">
                <div className="py-1">
                  <Link href="/dashboard/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <i className="ri-user-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                    Profile
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <i className="ri-settings-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                    Configuration
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <i className="ri-logout-box-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

      
        </div>
      </div>
    </header>
    <Toaster position="top-right" reverseOrder={false} />

    <AddProjectModal 
    isOpen={showAddProjectModel} 
    onClose={() => setshowAddProjectModel(false)} 
    />

</>
  );
}
