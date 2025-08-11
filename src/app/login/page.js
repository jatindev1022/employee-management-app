'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NextResponse } from 'next/server';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/userSlice'; 


export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    // Validate email
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    // Validate password
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.user.userId);
        dispatch(setUser(data.user));
        toast.success('Login successfully!');
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch {
      toast.error('Something went wrong.');
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
                Welcome Back
              </h1>
             
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter your email"
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
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                 
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                    }`}
                    placeholder="Enter your password"
                  />

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

              {/* Remember Me Checkbox */}
              <div className="flex items-end">
    
                <Link 
                    href="#" 
                    className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline"
                  >
                    Forgot password?
                  </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed scale-95' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

       
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <span className="text-gray-600">
            <p>Don&apos;t have an account?</p>
              <Link 
                href="/register" 
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:underline"
              >
                Create one now
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}