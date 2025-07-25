'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TaskChart() {
  const data = [
    { name: 'Mon', completed: 12, assigned: 18 },
    { name: 'Tue', completed: 15, assigned: 22 },
    { name: 'Wed', completed: 8, assigned: 16 },
    { name: 'Thu', completed: 20, assigned: 25 },
    { name: 'Fri', completed: 18, assigned: 24 },
    { name: 'Sat', completed: 5, assigned: 8 },
    { name: 'Sun', completed: 3, assigned: 6 }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Task Overview</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="completed" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
            <Area type="monotone" dataKey="assigned" stackId="1" stroke="#10B981" fill="#10B981" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}