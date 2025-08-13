'use client';

import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import {  useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksByProject ,updateTaskStatus} from "@/store/slices/taskSlice";
import { useSearchParams } from "next/navigation";
import { fetchUsers } from '@/store/slices/userSlice';
import toast from 'react-hot-toast';

function TaskCard({ task, onDragStart, onDragEnd, isDragging }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  useEffect(() => {
    if (!users.length) dispatch(fetchUsers());
  }, [users.length, dispatch]);

  const getUserNameById = (id) => {
    const user = users.find((u) => u._id === id);
    return user ? `${user.firstName} ${user.lastName}`.trim() : "Unknown";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo": return "bg-gray-100 border-gray-200";
      case "inprogress": return "bg-blue-50 border-blue-200";
      case "onhold": return "bg-orange-50 border-orange-200";
      case "completed": return "bg-green-50 border-green-200";
      default: return "bg-gray-100 border-gray-200";
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className={`${getStatusColor(task.status)} border-2 rounded-xl p-4 mb-4 cursor-move hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${isDragging ? "opacity-50 scale-95" : ""}`}
    >
      {/* Title and priority */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-base">{task.title}</h4>
        <Badge variant={getPriorityColor(task.priority)} size="sm">
          {task.priority}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 break-words">{task.description}</p>

      {/* Assignees + Date */}
      <div className="flex items-center justify-between flex-wrap gap-[10px]">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {task.assignee.slice(0, 2).map((assignee) => {
              // Ensure assignee is a string ID
              const id = typeof assignee === "string" ? assignee : assignee._id;
              const user = users.find((u) => u._id === id);
              const initials = user
                ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
                : "??";

              return (
                <div key={`${task._id}-${id}`} className="flex items-center space-x-2">
                  {/* Initials Circle */}
                  <div
                    className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold ring-2 ring-white"
                    title={user ? `${user.firstName} ${user.lastName}` : "Unknown"}
                  >
                    {initials}
                  </div>

                  {/* Name */}
                  <span className="text-sm text-gray-700 font-medium truncate max-w-[120px]">
                    {user ? `${user.firstName} ${user.lastName}` : "Unknown"}
                  </span>
                </div>
              );
            })}

            {task.assignee.length > 2 && (
              <div key={`more-${task._id}`} className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold ring-2 ring-white"
                  title={`+${task.assignee.length - 2} more`}
                >
                  +{task.assignee.length - 2}
                </div>
                <span className="text-xs text-gray-500">
                  +{task.assignee.length - 2} more
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Due date */}
        <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
          <i className="ri-calendar-line text-xs mr-1"></i>
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>
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
      case 'onhold': return 'border-orange-300 bg-orange-50/50';
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
            key={task._id} 
            task={task} 
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedTask && draggedTask._id === task._id}

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
    const dispatch = useDispatch();
    const project = useSelector((state) => state.project.currentProject);
    const { items: tasksFromRedux, loading, error } = useSelector((state) => state.tasks);

    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");



    // Local state for drag/drop or temporary changes
  const [tasks, setTasks] = useState([]);




    useEffect(() => {
      if (projectId) {
        dispatch(fetchTasksByProject(projectId));
      }
    }, [dispatch, projectId]);

    // Sync Redux tasks → local state whenever Redux updates
    useEffect(() => {
      setTasks(tasksFromRedux || []);
    }, [tasksFromRedux]);
  
    console.log(tasks);



  const [showAddModal, setShowAddModal] = useState(false);

//   const [tasks, setTasks] = useState([
//     {
//       id: 1,
//       title: 'Design new homepage',
//       description: 'Create wireframes and mockups for the new homepage layout with improved user experience and modern design elements',
//       assignee: 'Sarah Wilson',
//       assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=40&height=40&seq=avatar-sarah&orientation=squarish',
//       priority: 'high',
//       status: 'todo',
//       dueDate: '2024-01-20'
//     },
//     {
//       id: 2,
//       title: 'Fix authentication bug',
//       description: 'Resolve the issue with login redirects not working properly in production environment',
//       assignee: 'Mike Johnson',
//       assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=40&height=40&seq=avatar-mike&orientation=squarish',
//       priority: 'high',
//       status: 'inprogress',
//       dueDate: '2024-01-16'
//     },
//     {
//       id: 3,
//       title: 'Update documentation',
//       description: 'Add new API endpoints to the developer documentation and update existing examples',
//       assignee: 'John Doe',
//       assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20developer&width=40&height=40&seq=avatar-john&orientation=squarish',
//       priority: 'medium',
//       status: 'completed',
//       dueDate: '2024-01-15'
//     },
//     {
//       id: 4,
//       title: 'Implement dark mode',
//       description: 'Add dark mode support across all pages and components with proper theme switching',
//       assignee: 'Jane Smith',
//       assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20jane&width=40&height=40&seq=avatar-jane&orientation=squarish',
//       priority: 'low',
//       status: 'todo',
//       dueDate: '2024-01-30'
//     },
//     {
//       id: 5,
//       title: 'Setup CI/CD pipeline',
//       description: 'Configure automated testing and deployment pipeline for the project',
//       assignee: 'Mike Johnson',
//       assigneeAvatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=40&height=40&seq=avatar-mike&orientation=squarish',
//       priority: 'medium',
//       status: 'onhold',
//       dueDate: '2024-01-25'
//     }
//   ]);
  
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


const handleDrop = async (e, newStatus) => {
  e.preventDefault();
  if (!draggedTask || !draggedTask._id) return;

  if (draggedTask.status !== newStatus) {
    try {
      // Optimistically update local state
      setTasks(prevTasks => prevTasks.map(task =>
        task._id === draggedTask._id ? { ...task, status: newStatus } : task
      ));

      // Update backend
      await dispatch(updateTaskStatus({
        taskId: draggedTask._id,
        status: newStatus
      })).unwrap();


      // Show success toast
      toast.success(`Task status updated successfully!`);

    } catch (err) {
      console.error('Failed to update task status', err);

      // Revert local state
      setTasks(prevTasks => prevTasks.map(task =>
        task._id === draggedTask._id ? { ...task, status: draggedTask.status } : task
      ));

      // Show error toast
      toast.error('Failed to update task status. Please try again.');
    }
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
  const onHoldTasks = tasks.filter(task => task.status === 'onhold');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600 mt-1">Organize and track your project tasks</p>
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
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-600">On Hold: {onHoldTasks.length}</span>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
          title="On Hold"
          tasks={onHoldTasks}
          status="onhold"
          icon="ri-pause-line"
          color="bg-orange-500"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, 'onhold')}
          onDragLeave={handleDragLeave}
          isDraggedOver={draggedOverColumn === 'onhold'}
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