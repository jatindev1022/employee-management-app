'use client';

import Badge from '../ui/Badge';

export default function RecentTasks() {
  const tasks = [
    { id: 1, title: 'Update user dashboard', assignee: 'John Doe', status: 'In Progress', priority: 'high', dueDate: '2024-01-15' },
    { id: 2, title: 'Fix login authentication', assignee: 'Jane Smith', status: 'Completed', priority: 'medium', dueDate: '2024-01-14' },
    { id: 3, title: 'Design new landing page', assignee: 'Mike Johnson', status: 'To Do', priority: 'low', dueDate: '2024-01-20' },
    { id: 4, title: 'Optimize database queries', assignee: 'Sarah Wilson', status: 'In Progress', priority: 'high', dueDate: '2024-01-16' },
    { id: 5, title: 'Write API documentation', assignee: 'Tom Brown', status: 'To Do', priority: 'medium', dueDate: '2024-01-18' }
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'To Do': return 'default';
      default: return 'default';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-500 mt-1">Assigned to {task.assignee}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={task.priority}>{task.priority}</Badge>
                <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
                <span className="text-sm text-gray-500">{task.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}