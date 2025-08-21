
'use client';

import Layout from '../../../components/layout/Layout';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import { useState } from 'react';

function EmployeeTable({ employees, onEdit, onDelete, onView }) {
  const [actionDropdown, setActionDropdown] = useState(null);
  
  const toggleDropdown = (employeeId) => {
    setActionDropdown(actionDropdown === employeeId ? null : employeeId);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Employee Directory</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <i className="ri-team-line"></i>
            <span>{employees.length} employees</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
                        src={employee.avatar}
                        alt={employee.name}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        employee.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <i className="ri-building-line text-blue-600 text-sm"></i>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{employee.department}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={employee.status === 'active' ? 'success' : 'default'}>
                    {employee.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.joinDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {/* Quick Actions */}
                    <button
                      onClick={() => onView(employee)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                    <button
                      onClick={() => onEdit(employee)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Employee"
                    >
                      <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                    
                    {/* More Actions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(employee.id)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More Actions"
                      >
                        <i className="ri-more-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                      
                      {actionDropdown === employee.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 border">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onView(employee);
                                setActionDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <i className="ri-user-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                              View Profile
                            </button>
                            <button
                              onClick={() => {
                                onEdit(employee);
                                setActionDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <i className="ri-edit-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                              Edit Details
                            </button>
                            <button
                              onClick={() => {
                                // Send message action
                                setActionDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <i className="ri-message-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                              Send Message
                            </button>
                            <button
                              onClick={() => {
                                // Assign task action
                                setActionDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <i className="ri-task-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                              Assign Task
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                              onClick={() => {
                                onDelete(employee);
                                setActionDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <i className="ri-delete-bin-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                              Delete Employee
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmployeeModal({ isOpen, onClose, employee, onSave }) {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    department: employee?.department || '',
    role: employee?.role || '',
    status: employee?.status || 'active',
    phone: employee?.phone || '',
    joinDate: employee?.joinDate || ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? 'Edit Employee' : 'Add New Employee'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
          <input
            type="date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{employee ? 'Update' : 'Add'} Employee</Button>
        </div>
      </form>
    </Modal>
  );
}

function ViewEmployeeModal({ isOpen, onClose, employee }) {
  if (!employee) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Details" size="lg">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-200"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{employee.name}</h3>
            <p className="text-gray-600">{employee.role}</p>
            <Badge variant={employee.status === 'active' ? 'success' : 'default'}>
              {employee.status}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{employee.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900">{employee.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <p className="text-gray-900">{employee.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
            <p className="text-gray-900">{employee.joinDate}</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function EmployeesPage() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      role: 'Senior Developer',
      status: 'active',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-01-15',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20john&width=48&height=48&seq=emp-john&orientation=squarish'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      department: 'Design',
      role: 'UI/UX Designer',
      status: 'active',
      phone: '+1 (555) 234-5678',
      joinDate: '2023-02-20',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20sarah&width=48&height=48&seq=emp-sarah&orientation=squarish'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      department: 'Engineering',
      role: 'Frontend Developer',
      status: 'active',
      phone: '+1 (555) 345-6789',
      joinDate: '2023-03-10',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20mike&width=48&height=48&seq=emp-mike&orientation=squarish'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@company.com',
      department: 'Marketing',
      role: 'Marketing Manager',
      status: 'active',
      phone: '+1 (555) 456-7890',
      joinDate: '2023-04-05',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20emily&width=48&height=48&seq=emp-emily&orientation=squarish'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@company.com',
      department: 'Sales',
      role: 'Sales Representative',
      status: 'inactive',
      phone: '+1 (555) 567-8901',
      joinDate: '2023-05-12',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20david&width=48&height=48&seq=emp-david&orientation=squarish'
    }
  ]);
  
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });
  
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };
  
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };
  
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };
  
  const handleSaveEmployee = (formData) => {
    if (selectedEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id ? { ...emp, ...formData } : emp
      ));
    } else {
      const newEmployee = {
        id: Date.now(),
        ...formData,
        avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20person%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=48&height=48&seq=new-emp&orientation=squarish'
      };
      setEmployees([...employees, newEmployee]);
    }
  };
  
  const handleDeleteEmployee = (employee) => {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      setEmployees(employees.filter(emp => emp.id !== employee.id));
    }
  };
  
  const departments = [...new Set(employees.map(emp => emp.department))];
  
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their information</p>
          </div>
          <Button onClick={handleAddEmployee}>
            <i className="ri-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
            Add Employee
          </Button>
        </div>
        
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
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
      
      <EmployeeTable
        employees={filteredEmployees}
        onEdit={handleEditEmployee}
        onView={handleViewEmployee}
        onDelete={handleDeleteEmployee}
      />
      
      <EmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />
      
      <ViewEmployeeModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        employee={selectedEmployee}
      />
    </Layout>
  );
}
