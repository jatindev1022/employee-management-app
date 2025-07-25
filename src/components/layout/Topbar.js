
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Topbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  
  const notifications = [
    { id: 1, title: 'New task assigned', message: 'UI Design for Dashboard', time: '2 mins ago', unread: true },
    { id: 2, title: 'Task completed', message: 'Backend API Integration', time: '1 hour ago', unread: true },
    { id: 3, title: 'Meeting reminder', message: 'Team standup in 15 minutes', time: '2 hours ago', unread: false }
  ];
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
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
  
  return (
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
              <img
                src="https://readdy.ai/api/search-image?query=professional%20business%20person%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait&width=40&height=40&seq=user-avatar&orientation=squarish"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
              />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
              <i className="ri-arrow-down-s-line text-gray-400 w-4 h-4 flex items-center justify-center"></i>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 border">
                <div className="py-1">
                  <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <i className="ri-user-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                    Profile
                  </Link>
                  <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <i className="ri-settings-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                    Configuration
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <i className="ri-logout-box-line mr-3 w-4 h-4 flex items-center justify-center"></i>
                    Sign out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
