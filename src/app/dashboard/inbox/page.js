'use client';

import Layout from '../../../components/layout/Layout';
import Button from '../../../components/ui/Button';
import { useState } from 'react';

function UserList({ users, activeUser, onUserSelect }) {
  return (
    <div className="bg-white rounded-lg shadow h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Messages</h2>
      </div>
      <div className="overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              activeUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
              </div>
              <div className="text-xs text-gray-400">
                {user.lastMessageTime}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatArea({ activeUser, messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  
  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  if (!activeUser) {
    return (
      <div className="bg-white rounded-lg shadow h-full flex items-center justify-center">
        <div className="text-center">
          <i className="ri-message-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-500">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={activeUser.avatar}
            alt={activeUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-medium text-gray-900">{activeUser.name}</h2>
            <p className="text-sm text-gray-500">{activeUser.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'me'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center"></i>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function InboxPage() {
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const users = [
    {
      id: 1,
      name: 'Sarah Wilson',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20sarah&width=40&height=40&seq=chat-sarah&orientation=squarish',
      lastMessage: 'The design looks great! Can we schedule a review?',
      lastMessageTime: '2m ago',
      online: true
    },
    {
      id: 2,
      name: 'Mike Johnson',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20mike&width=40&height=40&seq=chat-mike&orientation=squarish',
      lastMessage: 'I\'ve fixed the authentication issue',
      lastMessageTime: '1h ago',
      online: false
    },
    {
      id: 3,
      name: 'Emily Chen',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20emily&width=40&height=40&seq=chat-emily&orientation=squarish',
      lastMessage: 'Thanks for the update on the project timeline',
      lastMessageTime: '3h ago',
      online: true
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20david&width=40&height=40&seq=chat-david&orientation=squarish',
      lastMessage: 'Let\'s discuss the new feature requirements',
      lastMessageTime: '1d ago',
      online: false
    }
  ];
  
  const mockMessages = {
    1: [
      { sender: 'other', text: 'Hi John! How\'s the dashboard coming along?', time: '10:30 AM' },
      { sender: 'me', text: 'It\'s going well! I\'ve completed the main components.', time: '10:32 AM' },
      { sender: 'other', text: 'The design looks great! Can we schedule a review?', time: '10:35 AM' },
      { sender: 'me', text: 'Absolutely! How about tomorrow at 2 PM?', time: '10:37 AM' }
    ],
    2: [
      { sender: 'other', text: 'I\'ve fixed the authentication issue', time: '9:15 AM' },
      { sender: 'me', text: 'Great work! Did you test it thoroughly?', time: '9:20 AM' },
      { sender: 'other', text: 'Yes, all test cases are passing now', time: '9:22 AM' }
    ]
  };
  
  const handleUserSelect = (user) => {
    setActiveUser(user);
    setMessages(mockMessages[user.id] || []);
  };
  
  const handleSendMessage = (text) => {
    const newMessage = {
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
        <p className="text-gray-600 mt-1">Communicate with your team members</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-96 lg:max-h-screen">
        <div className="lg:col-span-1">
          <UserList
            users={users}
            activeUser={activeUser}
            onUserSelect={handleUserSelect}
          />
        </div>
        <div className="lg:col-span-2">
          <ChatArea
            activeUser={activeUser}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </Layout>
  );
}