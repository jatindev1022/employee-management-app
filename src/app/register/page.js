'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';



export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear error while typing
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
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
    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name ,email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (res.ok) {
        // setMessage(data.message || 'Registration successful!');
        toast.success('Registered successfully!');
        setForm({ name: '', email: '', password: '' });
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Error submitting form');
    }
    finally{
      setLoading(false)
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
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              Full Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm ${
                  errors.name ? 'border-red-500' : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-600'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
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
            {loading ? 'Submitting...' : 'Sign up'}
          </button>

          </div>

          {message && (
            <p className="text-center text-sm text-red-500 mt-4">
              {message}
            </p>
          )}
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
        </Link>

        </p>
      </div>
    </div>
    </>

  );
}
