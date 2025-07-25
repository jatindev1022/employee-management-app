
'use client';

import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useState } from 'react';

function CalendarGrid({ currentDate, events, onDateClick, selectedDate }) {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };
  
  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };
  
  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };
  
  const isCurrentMonth = (date) => {
    return date.getMonth() === month;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-700">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((date, index) => (
          <div
            key={index}
            className={`bg-white min-h-28 p-2 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
              !isCurrentMonth(date) ? 'text-gray-400 bg-gray-50' : ''
            } ${isSelected(date) ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
            onClick={() => onDateClick(date)}
          >
            <div className={`text-sm font-medium mb-1 ${
              isToday(date) 
                ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' 
                : isSelected(date) 
                ? 'text-blue-600 font-semibold' 
                : ''
            }`}>
              {date.getDate()}
            </div>
            <div className="space-y-1">
              {getEventsForDate(date).slice(0, 3).map((event, i) => (
                <div
                  key={i}
                  className={`text-xs px-2 py-1 rounded-md truncate transition-colors ${
                    event.type === 'task' 
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {getEventsForDate(date).length > 3 && (
                <div className="text-xs text-gray-500 text-center py-1">
                  +{getEventsForDate(date).length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsList({ events, selectedDate }) {
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayEvents = events.filter(event => event.date === selectedDateStr);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <i className="ri-calendar-event-line mr-2 text-blue-600"></i>
        {selectedDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </h3>
      {dayEvents.length === 0 ? (
        <div className="text-center py-8">
          <i className="ri-calendar-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No events scheduled for this day</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                  event.type === 'task' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <i className="ri-time-line mr-1"></i>
                      {event.time}
                    </span>
                    {event.assignee && (
                      <span className="flex items-center">
                        <i className="ri-user-line mr-1"></i>
                        {event.assignee}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={event.type === 'task' ? 'primary' : 'success'}>
                  {event.type}
                </Badge>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <i className="ri-more-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddEventModal({ isOpen, onClose, selectedDate, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'task',
    time: '09:00',
    assignee: '',
    description: '',
    priority: 'medium'
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...formData,
      date: selectedDate.toISOString().split('T')[0]
    };
    onSave(newEvent);
    onClose();
    setFormData({
      title: '',
      type: 'task',
      time: '09:00',
      assignee: '',
      description: '',
      priority: 'medium'
    });
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Event" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="task">Task</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
          <select
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            <option value="">Select assignee</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
            <option value="Mike Johnson">Mike Johnson</option>
            <option value="Sarah Wilson">Sarah Wilson</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Add event description..."
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Standup', date: '2024-01-15', time: '09:00 AM', type: 'meeting', assignee: 'John Doe' },
    { id: 2, title: 'Design Review', date: '2024-01-15', time: '02:00 PM', type: 'meeting', assignee: 'Sarah Wilson' },
    { id: 3, title: 'Complete Dashboard', date: '2024-01-16', time: '11:00 AM', type: 'task', assignee: 'Mike Johnson' },
    { id: 4, title: 'Client Meeting', date: '2024-01-17', time: '03:00 PM', type: 'meeting', assignee: 'Jane Smith' },
    { id: 5, title: 'Code Review', date: '2024-01-18', time: '10:00 AM', type: 'task', assignee: 'John Doe' },
    { id: 6, title: 'Sprint Planning', date: '2024-01-19', time: '09:00 AM', type: 'meeting', assignee: 'Sarah Wilson' },
    { id: 7, title: 'Bug Fixes', date: '2024-01-20', time: '01:00 PM', type: 'task', assignee: 'Mike Johnson' }
  ]);
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  
  const handleAddEvent = () => {
    setShowAddModal(true);
  };
  
  const handleSaveEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-1">Manage your tasks and events</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={goToToday}>
              <i className="ri-calendar-check-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              Today
            </Button>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
            </div>
            <Button onClick={handleAddEvent}>
              <i className="ri-add-line mr-2 w-4 h-4 flex items-center justify-center"></i>
              Add Event
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="ri-arrow-left-line text-gray-600 w-5 h-5 flex items-center justify-center"></i>
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="ri-arrow-right-line text-gray-600 w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
            <CalendarGrid
              currentDate={currentDate}
              events={events}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
          </div>
        </div>
        
        <div>
          <EventsList events={events} selectedDate={selectedDate} />
        </div>
      </div>
      
      <AddEventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
      />
    </Layout>
  );
}
