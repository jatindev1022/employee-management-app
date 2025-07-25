'use client';

import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Toaster, toast } from 'react-hot-toast';

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null); // New state for image preview

  const [formData, setFormData] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joinDate: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    profileImage: '', // Make sure this is included
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('No userId found in localStorage');
        setLoading(false);
        return;
      }
  
      try {
        const res = await fetch(`/api/profile?userId=${userId}`);
        const data = await res.json();
  
        if (res.ok) {
          setFormData(data);
          // Set initial image preview to existing profile image
          setImagePreview(data.profileImage || null);
        } else {
          console.error('Failed to fetch user data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
         toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
         toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Update preview immediately
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = async () => {
    setLoading(true);

    const form = new FormData();
    form.append('userId', formData._id);
    form.append('email', formData.email);
    form.append('firstName', formData.firstName);
    form.append('lastName', formData.lastName);
    form.append('bio', formData.bio);
    form.append('phone', formData.phone);
    form.append('department', formData.department);
    form.append('position', formData.position);
    form.append('location', formData.location);

    if (selectedFile) {
      form.append('profileImage', selectedFile);
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        body: form,
      });

      const result = await res.json();
      
      if (result.success && result.user) {
        console.log('Profile updated:', result.user);
        
        // Update form data with the response
        setFormData(result.user);
        
        // Update image preview with the new image URL from server
        if (result.user.profileImage) {
          setImagePreview(result.user.profileImage);
        }
        
        // Clear selected file and exit edit mode
        setSelectedFile(null);
        setIsEditing(false);
        
        toast.success('Profile updated successfully!');
      } else {
        console.error('Update failed:', result.error || result.message);
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get the current image source
  const getCurrentImageSrc = () => {
    // Priority: imagePreview -> formData.profileImage -> default image
    if (imagePreview) {
      return imagePreview;
    }
    if (formData.profileImage) {
      return formData.profileImage;
    }
    return "https://readdy.ai/api/search-image?query=professional%20business%20person%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20male%20developer%20john&width=120&height=120&seq=profile-main&orientation=squarish";
  };

  const stats = [
    { label: 'Tasks Completed', value: '47', icon: 'ri-check-line', color: 'text-green-600' },
    { label: 'Projects', value: '12', icon: 'ri-folder-line', color: 'text-blue-600' },
    { label: 'Team Members', value: '8', icon: 'ri-team-line', color: 'text-purple-600' },
    { label: 'Years Experience', value: '5', icon: 'ri-star-line', color: 'text-orange-600' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
        <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto">
      
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? 'outline' : 'primary'}
              disabled={loading}
            >
              <i className={`${isEditing ? 'ri-close-line' : 'ri-edit-line'} mr-2 w-4 h-4 flex items-center justify-center`}></i>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          </div>
          
          {/* Profile Info */}
          <div className="px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                {/* Profile Picture */}
                <div className="relative -mt-16">
                  <img
                    src={getCurrentImageSrc()}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                    onError={(e) => {
                      // Fallback to default image if current image fails to load
                      e.target.src = "https://readdy.ai/api/search-image?query=professional%20business%20person%20avatar%20headshot%20with%20friendly%20smile%2C%20clean%20background%2C%20corporate%20style%2C%20high%20quality%20portrait%20male%20developer%20john&width=120&height=120&seq=profile-main&orientation=squarish";
                    }}
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <i className="ri-camera-line text-white text-sm"></i>
                    </label>
                  )}
                  {/* Show upload indicator */}
                  {selectedFile && (
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="ri-check-line text-white text-xs"></i>
                    </div>
                  )}
                </div>
                
                {/* Basic Info */}
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {formData?.firstName || 'First'} {formData?.lastName || 'Last'}
                    </h2>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Online</span>
                  </div>
                  <p className="text-gray-600 text-lg mb-2">{formData.position || 'Position'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <i className="ri-building-line mr-1"></i>
                      {formData.department}
                    </div>
                    <div className="flex items-center">
                      <i className="ri-map-pin-line mr-1"></i>
                      {formData.location}
                    </div>
                    <div className="flex items-center">
                      <i className="ri-calendar-line mr-1"></i>
                      {formData.joinDate && `Joined ${new Date(formData.joinDate).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center space-x-3">
                <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <i className="ri-linkedin-fill"></i>
                </a>
                <a href={formData.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <i className="ri-github-fill"></i>
                </a>
                <a href={formData.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors">
                  <i className="ri-global-line"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${stat.color}`}>
                  <i className={`${stat.icon} text-xl`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{formData.bio}</p>
              )}
              {isEditing && (
                <p className="text-sm text-gray-500 mt-2">
                  {(formData.bio?.length || 0)}/500 characters
                </p>
              )}
            </div>
            
            {/* Personal Details */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.lastName }</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  {isEditing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-2">{formData.department}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="position"
                      value={formData.position || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.position}</p>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location || '' }
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="ri-mail-line text-gray-400"></i>
                  <span className="text-gray-900">{formData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-phone-line text-gray-400"></i>
                  <span className="text-gray-900">{formData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-map-pin-line text-gray-400"></i>
                  <span className="text-gray-900">{formData.location}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <i className="ri-download-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  Download Resume
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <i className="ri-calendar-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <i className="ri-message-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        {isEditing && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button onClick={handleSave} className="shadow-lg" disabled={loading}>
              {loading ? (
                <>
                  <i className="ri-loader-line mr-2 w-4 h-4 flex items-center justify-center animate-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}