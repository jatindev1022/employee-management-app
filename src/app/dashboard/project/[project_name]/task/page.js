'use client';

import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import {  useEffect,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksByProject ,updateTaskStatus ,addTask,deleteTask,updateTaskDetails,deleteTaskAsync} from "@/store/slices/taskSlice";
import { useSearchParams } from "next/navigation";
import { fetchUsers } from '@/store/slices/userSlice';
import toast from 'react-hot-toast';
import { fetchProjects, setProjects } from '@/store/slices/projectSlice';

function TaskCard({ task, onDragStart, onDragEnd, isDragging ,onEdit}) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteTaskAsync(task._id)).unwrap();
      toast.success("Task deleted!");
      setMenuOpen(false);
    } catch (err) {
      toast.error(err?.message || "Failed to delete task");
    }
  };
  
  
  

  const menuRef = useRef(null);
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
      <div className="flex items-start justify-between mb-3 relative" ref={menuRef}>
        <h4 className="font-semibold text-gray-900 text-base">{task.title}</h4>
        <div className="flex items-center space-x-2">
          <Badge variant={getPriorityColor(task.priority)} size="sm">
            {task.priority}
          </Badge>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-more-line text-sm"></i>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 w-32 bg-white border rounded-lg shadow-lg z-50">
              <button
              onClick={() => {
                setMenuOpen(false);
                onEdit(task); // ✅ calls parent
              }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
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

  

function TaskColumn({ title, tasks, status, onDrop, onDragOver, onDragEnter, onDragLeave, icon, color, isDraggedOver, onDragStart, onDragEnd, draggedTask,onEdit }) {
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
            onEdit={onEdit} // ✅ pass down
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

function QuickAddModal({ isOpen, onClose ,taskToEdit ,currentProjectId}) {
  const initialState = {
    project: currentProjectId || '', 
    title: '',
    description: '',
    assignee: [],
    priority: 'medium',
    dueDate: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [pendingAssignees, setPendingAssignees] = useState([]);
  // const [projectList, setProjectList] = useState([]);

  const dispatch = useDispatch();
  const projectList = useSelector(state => state.project.projects);

  const [projectMembers, setProjectMembers] = useState([]);

  // 🧼 Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) return;
  
    if (taskToEdit) {
      // set basic form data except assignees
      // console.log(taskToEdit);
      setFormData({
        project: taskToEdit.project || '',
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        assignee: (taskToEdit.assignee || []).map(a =>
          typeof a === "string" ? a : a._id
        ),
        priority: taskToEdit.priority || 'medium',
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.slice(0, 10) : ''
      });
  
      if (taskToEdit.project) {
        // fetch members and then set assignees
        handleProjectChange({ target: { value: taskToEdit.project } }, true);
      }
  
    } else if (currentProjectId) {
      // new task on project page
      setFormData(prev => ({ ...initialState, project: currentProjectId }));
      handleProjectChange({ target: { value: currentProjectId } });
    } else {
      setFormData(initialState);
    }
  
    setErrors({});
  }, [isOpen, taskToEdit, currentProjectId]);
  
  
  

  // 🧠 Fetch all projects
  useEffect(()=>{
    dispatch(fetchProjects());
  },[dispatch]);

  // 🧠 Handle project change and fetch members
  const handleProjectChange = async (e, keepAssignee = false) => {
    const selectedProjectId = e.target.value;
    const selectedProject = projectList.find(p => String(p._id) === String(selectedProjectId));
  
    if (!selectedProject) {
      setProjectMembers([]);
      return;
    }
  
    try {
      const query = selectedProject.members.map(id => `_id=${id}`).join("&");
      const res = await fetch(`/api/users?${query}`);
      const users = await res.json();
  
      setProjectMembers(Array.isArray(users) ? users : []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
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
      const payload = taskToEdit
        ? { _id: taskToEdit._id, ...formData, status: taskToEdit.status } // edit
        : formData; // create
  
      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        toast.error(data.error || (taskToEdit ? "Update failed" : "Failed to add task"));
        return;
      }
  
      if (taskToEdit) {
        // Update the task in Redux state
        dispatch(updateTaskDetails(data.task));
        
      } else {
        // Add new task to Redux state
        dispatch(addTask(data.task));
      }
  
      toast.success(taskToEdit ? "Task updated!" : "Task created!");
      onClose();
      setFormData(initialState);
  
    } catch (error) {
      toast.error(error.message || "Error submitting task");
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
            disabled={!!currentProjectId} // ❌ disable if project is pre-selected
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
              errors.project ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            {!currentProjectId && <option value="">Select a project</option>}
            {projectList
              .filter(p => !currentProjectId || p._id === currentProjectId) // show only current project
              .map(p => (
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
          <Button type="submit">
          {taskToEdit ? "Update Task" : "Create Task"}
        </Button>

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
    const [taskToEdit, setTaskToEdit] = useState(null); // ✅ new state


    const handleEditTask = (task) => {
      setTaskToEdit(task);    // store selected task
      setShowAddModal(true);  // open modal
    };

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
          onEdit={handleEditTask}
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
          onEdit={handleEditTask}
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
          onEdit={handleEditTask}
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
          onEdit={handleEditTask}
        />
      </div>
      
      <QuickAddModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setTaskToEdit(null); // reset after close
        }}
        taskToEdit={taskToEdit} 
        currentProjectId={projectId} 
        onSave={handleAddTask}

      />
    </Layout>
  );
}