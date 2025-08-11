'use client';

import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from "react-redux";
import { deleteProject, fetchProjects } from "@/store/slices/projectSlice";
import { fetchUsers } from '@/store/slices/userSlice';


function ProjectTable({ projects, onEdit, onDelete, onView ,onManageMembers}) {
  const [actionDropdown, setActionDropdown] = useState(null);
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);

  // Helper to find user by _id and return full name
    const getUserNameById = (id) => {
      const user = users.find(u => u._id === id);
      if (!user) return id; // fallback to showing id if no user found
      return `${user.firstName} ${user.lastName}`.trim();
    };



  useEffect(() => {
    if (users.length === 0) dispatch(fetchUsers());
  }, [dispatch, users.length]);

  console.log(users);
  
  const toggleDropdown = (projectId) => {
    setActionDropdown(prev => (prev === projectId ? null : projectId));
  };
  

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusFromDates = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'default';
      case 'upcoming': return 'warning';
      default: return 'default';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Project Directory</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <i className="ri-folder-line"></i>
            <span>{projects.length} projects</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => {

            // if (project._id) console.warn(' project id:', project);


              const status = getStatusFromDates(project.startDate, project.endDate);
              return (
                <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold ${
                          project.priority === 'high' ? 'bg-red-500' :
                          project.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.description || 'No description'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <i className="ri-team-line text-blue-600 text-sm"></i>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{project.team}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(project.endDate).toLocaleDateString('en-GB')}

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                  

                      {project.members.slice(0, 3).map((memberId, index) => {
                          const name = getUserNameById(memberId);
                          return (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                              title={name}
                            >
                              {name.charAt(0).toUpperCase()}
                            </div>
                          );
                        })}
                      </div>
                      {project.members.length > 3 && (
                        <span className="text-xs text-gray-500">+{project.members.length - 3}</span>
                      )}
                      <span className="ml-2 text-xs text-gray-500">({project.members.length})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {/* Quick Actions */}
                      <button
                        onClick={() => onView(project)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Project"
                      >
                        <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                      <button
                        onClick={() => onEdit(project)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                      
                      {/* More Actions Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(project._id)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          title="More Actions"
                        >
                          <i className="ri-more-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                        
                        {actionDropdown === project._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 border">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  onView(project);
                                  setActionDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <i className="ri-eye-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  onEdit(project);
                                  setActionDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <i className="ri-edit-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                                Edit Project
                              </button>
                              <button
                                onClick={() => {
                                  // View tasks action
                                  setActionDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <i className="ri-task-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                                View Tasks
                              </button>
                              <button
                                onClick={() => {
                                onManageMembers(project);
                                  setActionDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <i className="ri-user-add-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                                Manage Members
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => {
                                  onDelete(project);
                                  setActionDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <i className="ri-delete-bin-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                                Delete Project
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectModal({ isOpen, onClose, project, onSave }) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    priority: project?.priority || 'medium',
    startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
    endDate: project?.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
    team: project?.team || '',
    members: project?.members || []
  });
  
  const [memberInput, setMemberInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addMember = () => {
    if (memberInput.trim() && !formData.members.includes(memberInput.trim())) {
      setFormData({
        ...formData,
        members: [...formData.members, memberInput.trim()]
      });
      setMemberInput('');
    }
  };

  const removeMember = (memberToRemove) => {
    setFormData({
      ...formData,
      members: formData.members.filter(member => member !== memberToRemove)
    });
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Add New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
            <input
              type="text"
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              placeholder="Enter member name"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addMember}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.members.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.members.map((member, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <span>{member}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(member)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{project ? 'Update' : 'Add'} Project</Button>
        </div>
      </form>
    </Modal>
  );
}

function ManageMembersModal({ isOpen, onClose, project, onSave }) {
  const [members, setMembers] = useState([]);
  const [memberInput, setMemberInput] = useState('');
  
//   Update members when project changes or modal opens
useEffect(() => {
    if (project && isOpen) {
      setMembers(project.members || []);
    }
  }, [project, isOpen]);
  
  const addMember = () => {
    if (memberInput.trim() && !members.includes(memberInput.trim())) {
      setMembers([...members, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const removeMember = (memberToRemove) => {
    setMembers(members.filter(member => member !== memberToRemove));
  };

  const handleSave = () => {
    if (project) {
      onSave({ ...project, members });
    }
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMember();
    }
  };

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Members - ${project.name}`} size="md">
      <div className="space-y-6">
        {/* Project Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold ${
              project.priority === 'high' ? 'bg-red-500' :
              project.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}>
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-600">{project.team}</p>
            </div>
          </div>
        </div>

        {/* Add New Member */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Add New Member</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter member name"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addMember}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <i className="ri-add-line mr-1"></i>
              Add
            </button>
          </div>
        </div>

        {/* Current Members */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Current Members</label>
            <span className="text-sm text-gray-500">{members.length} members</span>
          </div>
          
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="ri-user-line text-2xl mb-2 block"></i>
              <p className="text-sm">No members assigned yet</p>
              <p className="text-xs text-gray-400">Add members using the form above</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {members.map((member, index) => (
    
                <div key={index} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{member}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(member)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove member"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>
              ))}



                      
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <i className="ri-save-line mr-2"></i>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ViewProjectModal({ isOpen, onClose, project }) {
  if (!project) return null;

  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const status = (() => {
    const now = new Date();
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  })();

  const getUserNameById = (id) => {
    const user = users.find(u => u._id === id);
    if (!user) return id; // fallback to ID if not found
    return `${user.firstName} ${user.lastName}`.trim();
  };


  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Details" size="lg">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl ${
            project.priority === 'high' ? 'bg-red-500' :
            project.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
          }`}>
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
            <p className="text-gray-600">{project.description || 'No description provided'}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={status === 'active' ? 'success' : status === 'completed' ? 'default' : 'warning'}>
                {status}
              </Badge>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.priority === 'high' ? 'bg-red-100 text-red-800' :
                project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {project.priority} priority
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <p className="text-gray-900">{project.team}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <p className="text-gray-900 capitalize">{project.priority}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <p className="text-gray-900">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <p className="text-gray-900">{new Date(project.endDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team Members ({project.members.length})</label>
          <div className="flex flex-wrap gap-2">
             {project.members.map((memberId, index) => {
              const name = getUserNameById(memberId);
              return (
                <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  
  const dispatch = useDispatch();


  // const [projects, setProjects] = useState([
  //   {
  //     id: 1,
  //     name: 'E-commerce Platform',
  //     description: 'Building a modern e-commerce platform with React and Node.js',
  //     priority: 'high',
  //     startDate: '2024-01-15',
  //     endDate: '2024-06-30',
  //     team: 'Frontend Team',
  //     members: ['John Doe', 'Sarah Wilson', 'Mike Johnson']
  //   },
  //   {
  //     id: 2,
  //     name: 'Mobile App Redesign',
  //     description: 'Complete redesign of the mobile application UI/UX',
  //     priority: 'medium',
  //     startDate: '2024-02-01',
  //     endDate: '2024-04-15',
  //     team: 'Design Team',
  //     members: ['Emily Chen', 'David Kim']
  //   },
  //   {
  //     id: 3,
  //     name: 'API Integration',
  //     description: 'Integration with third-party payment APIs',
  //     priority: 'high',
  //     startDate: '2024-01-10',
  //     endDate: '2024-03-20',
  //     team: 'Backend Team',
  //     members: ['John Doe', 'Mike Johnson', 'Alex Brown', 'Lisa Zhang']
  //   },
  //   {
  //     id: 4,
  //     name: 'Marketing Campaign',
  //     description: 'Launch digital marketing campaign for Q2',
  //     priority: 'low',
  //     startDate: '2024-03-01',
  //     endDate: '2024-05-31',
  //     team: 'Marketing Team',
  //     members: ['Emily Chen', 'Robert Taylor']
  //   },
  //   {
  //     id: 5,
  //     name: 'Database Migration',
  //     description: 'Migrate from MySQL to PostgreSQL',
  //     priority: 'medium',
  //     startDate: '2024-02-15',
  //     endDate: '2024-04-01',
  //     team: 'DevOps Team',
  //     members: ['Mike Johnson', 'Alex Brown']
  //   }
  // ]);

  const { projects, loading, error } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // console.log("Projects in Redux:", projects);

  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || project.priority === priorityFilter;
    const matchesTeam = !teamFilter || project.team === teamFilter;
    return matchesSearch && matchesPriority && matchesTeam;
  });
  


  
  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };
  
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleManageMembers = (project) => {
    setSelectedProject(project);
    setShowManageMembersModal(true);
  };
  
  const handleSaveProject = (formData) => {
    if (selectedProject) {
      // setProjects(projects.map(proj => 
      //   proj.id === selectedProject.id ? { ...proj, ...formData } : proj
      // ));

     dispatch(updateProject({
        id: selectedProject.id,
        ...formData
      }));  
      } else {
        dispatch(addProject({
          id: Date.now(),
          ...formData
        }));
    }
  };

  const handleSaveMemberChanges = (updatedProject) => {
    // setProjects(projects.map(proj => 
    //   proj.id === updatedProject.id ? updatedProject : proj
    // ));
    dispatch(updatedProject(updatedProject));
  };
  
  const handleDeleteProject = (project) => {
    if (confirm(`Are you sure you want to delete ${project.name}?`)) {
      // setProjects(projects.filter(proj => proj.id !== project.id));
      dispatch(deleteProject(project.id));
    }
  };
  
  const teams = [...new Set(projects.map(proj => proj.team))];
  
  return (
    <Layout>
      <div className="mb-8">
    
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>
      
      <ProjectTable
        projects={filteredProjects}
        onEdit={handleEditProject}
        onView={handleViewProject}
        onDelete={handleDeleteProject}
        onManageMembers={handleManageMembers} 
      />
      
      <ProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        project={selectedProject}
        onSave={handleSaveProject}
      />
      
      <ViewProjectModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        project={selectedProject}
      />

      <ManageMembersModal
        isOpen={showManageMembersModal}
        onClose={() => setShowManageMembersModal(false)}
        project={selectedProject}
        onSave={handleSaveMemberChanges}
      />
    </Layout>
  );
}