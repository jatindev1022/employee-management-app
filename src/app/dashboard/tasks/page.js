
'use client';

import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useState } from 'react';

function TaskCard({ task, onDragStart, onDragEnd, isDragging }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 border-gray-200';
      case 'inprogress': return 'bg-blue-50 border-blue-200';
      case 'completed': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className={`${getStatusColor(task.status)} border-2 rounded-xl p-4 mb-4 cursor-move hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{task.title}</h4>
        <div className="flex items-center space-x-2">
          <Badge variant={getPriorityColor(task.priority)} size="sm">{task.priority}</Badge>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <i className="ri-more-line text-sm"></i>
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src={task.assigneeAvatar}
            alt={task.assignee}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
          />
          <span className="text-sm text-gray-700 font-medium">{task.assignee}</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <i className="ri-calendar-line text-xs"></i>
          <span>{task.dueDate}</span>
        </div>
      </div>
    </div>
  );
}

function TaskColumn({ title, tasks, status, onDrop, onDragOver, onDragEnter, onDragLeave, icon, color, isDraggedOver, onDragStart, onDragEnd, draggedTask }) {
  const getColumnStyle = (status) => {
    switch (status) {
      case 'todo': return 'border-gray-300 bg-gray-50/50';
      case 'inprogress': return 'border-blue-300 bg-blue-50/50';
      case 'completed': return 'border-green-300 bg-green-50/50';
      default: return 'border-gray-300 bg-gray-50/50';
    }
  };
  
  return (
    <div
      className={`flex-1 min-h-screen rounded-xl border-2 border-dashed ${getColumnStyle(status)} p-4 transition-all duration-200 ${
        isDraggedOver ? 'bg-blue-100 border-blue-400' : ''
      }`}
      onDrop={(e) => onDrop(e, status)}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
            <i className={`${icon} text-white text-lg`}></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{tasks.length} tasks</p>
          </div>
        </div>
        <div className="bg-white rounded-lg px-3 py-1 shadow-sm border border-gray-200">
          <span className="text-lg font-bold text-gray-900">{tasks.length}</span>
        </div>
      </div>
      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedTask && draggedTask.id === task.id}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-inbox-line text-4xl mb-2"></i>
            <p>No tasks yet</p>
            <p className="text-xs mt-1">Drag tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddTaskModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.assignee) return;
    
    const newTask = {
      id: Date.now(),
      ...formData,
      status: 'todo',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20person%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=40&height=40&seq=new-task-avatar&orientation=squarish'
    };
    onSave(newTask);
    onClose();
    setFormData({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: ''
    });
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            maxLength={500}
            placeholder="Describe the task..."
          />
          <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
            <select
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
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

export default function TasksPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design new homepage',
      description: 'Create wireframes and mockups for the new homepage layout with improved user experience and modern design elements',
      assignee: 'Sarah Wilson',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=40&height=40&seq=avatar-sarah&orientation=squarish',
      priority: 'high',
      status: 'todo',
      dueDate: '2024-01-20'
    },
    {
      id: 2,
      title: 'Fix authentication bug',
      description: 'Resolve the issue with login redirects not working properly in production environment',
      assignee: 'Mike Johnson',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=40&height=40&seq=avatar-mike&orientation=squarish',
      priority: 'high',
      status: 'inprogress',
      dueDate: '2024-01-16'
    },
    {
      id: 3,
      title: 'Update documentation',
      description: 'Add new API endpoints to the developer documentation and update existing examples',
      assignee: 'John Doe',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20developer&width=40&height=40&seq=avatar-john&orientation=squarish',
      priority: 'medium',
      status: 'completed',
      dueDate: '2024-01-15'
    },
    {
      id: 4,
      title: 'Implement dark mode',
      description: 'Add dark mode support across all pages and components with proper theme switching',
      assignee: 'Jane Smith',
      assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20jane&width=40&height=40&seq=avatar-jane&orientation=squarish',
      priority: 'low',
      status: 'todo',
      dueDate: '2024-01-30'
    }
  ]);
  
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };
  
  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };
  
  const handleDragEnter = (e, status) => {
    e.preventDefault();
    setDraggedOverColumn(status);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOverColumn(null);
    }
  };
  
  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus }
          : task
      ));
    }
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleAddTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inprogress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600 mt-1">Organize and track your Here&apos;s </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-6 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm text-gray-600">To Do: {todoTasks.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">In Progress: {inProgressTasks.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Completed: {completedTasks.length}</span>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <i className="ri-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              Add Task
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          status="todo"
          icon="ri-inbox-line"
          color="bg-gray-500"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, 'todo')}
          onDragLeave={handleDragLeave}
          isDraggedOver={draggedOverColumn === 'todo'}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggedTask={draggedTask}
        />
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          status="inprogress"
          icon="ri-play-line"
          color="bg-blue-500"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, 'inprogress')}
          onDragLeave={handleDragLeave}
          isDraggedOver={draggedOverColumn === 'inprogress'}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggedTask={draggedTask}
        />
        <TaskColumn
          title="Completed"
          tasks={completedTasks}
          status="completed"
          icon="ri-check-line"
          color="bg-green-500"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, 'completed')}
          onDragLeave={handleDragLeave}
          isDraggedOver={draggedOverColumn === 'completed'}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggedTask={draggedTask}
        />
      </div>
      
      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTask}
      />
    </Layout>
  );
}
