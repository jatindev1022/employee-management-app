// app/login/page.js or pages/login.js depending on your structure
'use client';
import Link from 'next/link';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NextResponse } from 'next/server';
import { Toaster, toast } from 'react-hot-toast';

export default function LoginForm() {

  const router = useRouter();
  const [form,setForm]=useState({email:'',password:''});
  const [errors, setErrors] = useState({});

  const [loading,setLoading]=useState(false);

  const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value})
    setErrors({ ...errors, [e.target.name]: '' });
  }
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
        toast.success('Login successfully!');
        router.push('/');
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
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
  
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
         
                  className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
  
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
          
                  className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-600'
                  }`}
                />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>
  
            <div>
            <button
            type="submit"
            disabled={loading}
            className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500'
            }`}
          >
            {loading ? 'Submitting...' : 'Sign in'}
          </button>
            </div>
          </form>
  
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign Up
        </Link>
          </p>
        </div>
      </div>
      </>

    );
}
  