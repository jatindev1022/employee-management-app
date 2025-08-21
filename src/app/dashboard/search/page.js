
'use client';

import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useState, useEffect } from 'react';

function SearchFilters({ filters, onFilterChange, onClear }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <i className="ri-filter-line mr-2 text-blue-600"></i>
          Filters
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
        >
          <i className={`ri-${isExpanded ? 'subtract' : 'add'}-line`}></i>
        </button>
      </div>
      
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {['todo', 'inprogress', 'completed'].map(status => (
              <label key={status} className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={(e) => {
                    const newStatus = e.target.checked 
                      ? [...filters.status, status]
                      : filters.status.filter(s => s !== status);
                    onFilterChange({ ...filters, status: newStatus });
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm capitalize">{status === 'inprogress' ? 'In Progress' : status}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <div className="grid grid-cols-1 gap-2">
            {['high', 'medium', 'low'].map(priority => (
              <label key={priority} className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(priority)}
                  onChange={(e) => {
                    const newPriority = e.target.checked 
                      ? [...filters.priority, priority]
                      : filters.priority.filter(p => p !== priority);
                    onFilterChange({ ...filters, priority: newPriority });
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm capitalize">{priority}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
          <select
            value={filters.assignee}
            onChange={(e) => onFilterChange({ ...filters, assignee: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="">All Assignees</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
            <option value="Mike Johnson">Mike Johnson</option>
            <option value="Sarah Wilson">Sarah Wilson</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={onClear}
          className="w-full"
        >
          <i className="ri-refresh-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}

function SearchResults({ results, searchTerm, isLoading }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'inprogress': return 'warning';
      case 'todo': return 'default';
      default: return 'default';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };
  
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium rounded px-1">{part}</span>
      ) : (
        part
      )
    );
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Searching...</span>
        </div>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <i className="ri-search-line text-5xl text-gray-300 mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">Try adjusting your search terms or filters</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results
          </h3>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {results.map((task) => (
          <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {highlightText(task.title, searchTerm)}
                  </h4>
                  <Badge variant={getPriorityColor(task.priority)} size="sm">
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3 leading-relaxed">
                  {highlightText(task.description, searchTerm)}
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <img
                      src={task.assigneeAvatar || 'https://readdy.ai/api/search-image?query=professional%20business%20person%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=32&height=32&seq=search-avatar&orientation=squarish'}
                      alt={task.assignee}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="ri-calendar-line"></i>
                    <span>{task.dueDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="ri-time-line"></i>
                    <span>Created {task.createdAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge variant={getStatusColor(task.status)}>
                  {task.status === 'inprogress' ? 'In Progress' : task.status}
                </Badge>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <i className="ri-more-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    assignee: '',
    startDate: '',
    endDate: ''
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const allTasks = [
    {
      id: 1,
      title: 'Design new homepage layout',
      description: 'Create wireframes and mockups for the new homepage with improved user experience and modern design elements',
      assignee: 'Sarah Wilson',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20sarah&width=32&height=32&seq=search-sarah&orientation=squarish',
      priority: 'high',
      status: 'inprogress',
      dueDate: '2024-01-20',
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      title: 'Fix authentication bug',
      description: 'Resolve the issue with login redirects not working properly in production environment',
      assignee: 'Mike Johnson',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20mike&width=32&height=32&seq=search-mike&orientation=squarish',
      priority: 'high',
      status: 'completed',
      dueDate: '2024-01-16',
      createdAt: '2024-01-08'
    },
    {
      id: 3,
      title: 'Update API documentation',
      description: 'Add new endpoints and update existing documentation with comprehensive examples and usage guidelines',
      assignee: 'John Doe',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20john&width=32&height=32&seq=search-john&orientation=squarish',
      priority: 'medium',
      status: 'todo',
      dueDate: '2024-01-25',
      createdAt: '2024-01-12'
    },
    {
      id: 4,
      title: 'Implement dark mode',
      description: 'Add dark mode support across all pages and components with proper theme switching functionality',
      assignee: 'Jane Smith',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20jane&width=32&height=32&seq=search-jane&orientation=squarish',
      priority: 'low',
      status: 'todo',
      dueDate: '2024-01-30',
      createdAt: '2024-01-14'
    },
    {
      id: 5,
      title: 'Optimize database queries',
      description: 'Improve performance of slow database queries in the reporting module and add proper indexing',
      assignee: 'Mike Johnson',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20mike&width=32&height=32&seq=search-mike2&orientation=squarish',
      priority: 'medium',
      status: 'inprogress',
      dueDate: '2024-01-22',
      createdAt: '2024-01-11'
    }
  ];
  
  const handleSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filtered = allTasks;
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }
    
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }
    
    if (filters.assignee) {
      filtered = filtered.filter(task => task.assignee.toLowerCase().includes(filters.assignee.toLowerCase()));
    }
    
    setResults(filtered);
    setIsLoading(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      assignee: '',
      startDate: '',
      endDate: ''
    });
    setSearchTerm('');
    setResults([]);
  };
  
  // Auto-search when filters change
  // useEffect(() => {
  //   if (searchTerm || filters.status.length > 0 || filters.priority.length > 0 || filters.assignee || filters.startDate || filters.endDate) {
  //     const timer = setTimeout(() => {
  //       handleSearch();
  //     }, 500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [searchTerm, filters]);

  useEffect(() => {
    if (searchTerm || filters.status.length > 0 || filters.priority.length > 0 || filters.assignee || filters.startDate || filters.endDate) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, filters, handleSearch]);
  
  
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Search Tasks</h1>
            <p className="text-gray-600 mt-1">Find tasks, projects, and team activities</p>
          </div>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400 text-lg"></i>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search tasks, descriptions, or assignees..."
              className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <i className="ri-search-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SearchFilters 
            filters={filters} 
            onFilterChange={setFilters}
            onClear={clearFilters}
          />
        </div>
        <div className="lg:col-span-3">
          <SearchResults 
            results={results} 
            searchTerm={searchTerm}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
}
