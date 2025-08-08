'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';

    if (!form.password.trim()) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        toast.success('Registered successfully!');
        setForm({ firstName: '', lastName: '', email: '', password: '' });
        router.push('/profile');
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=130,h=130,fit=crop/A1awWRzoxRUeVrW4/header_logo-icon-A85E1R09Z8F8OJ4p.png"
                  alt="Your Company"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Create Account
              </h1>
              {/* <p className="text-gray-500 mt-2">Join us and start your journey today</p> */}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white ${
                        errors.firstName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="w-5 h-5 text-red-500">⚠</div>
                      </div>
                    )}
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white ${
                        errors.lastName 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="w-5 h-5 text-red-500">⚠</div>
                      </div>
                    )}
                  </div>
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="w-5 h-5 text-red-500">⚠</div>
                    </div>
                  )}
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
      <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          name="password"
          // Toggles the input type between 'password' and 'text'
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white ${
            errors.password
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
          }`}
          placeholder="••••••••"
        />

        {/* Conditional rendering for the error icon or the password toggle */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {errors.password ? (
            <i className="ri-error-warning-fill text-red-500 text-lg" />
          ) : (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={`text-xl ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`} />
            </button>
          )}
        </div>
      </div>
      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
    </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white  ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed scale-95' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              {message && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-center text-sm text-red-600">{message}</p>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}