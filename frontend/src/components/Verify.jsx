import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
console.log(API_URL);

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        alert('Login successful!');
        console.log(res);
      
        console.log('Full response:', res);
        console.log('Response data:', res.data);
        console.log('Role:', res.data.role); // Debug role specifically
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', res.data.role);

        if (res.data.role === 'admin') {
          navigate('/add-question'); // Admin page
        } else {
          navigate('/'); // User page
        }
      } else {
        alert('Registration successful!');
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || `Error ${isLogin ? 'logging in' : 'registering'} now`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="relative h-12 mb-8 overflow-hidden">
          <div className={`absolute w-full transition-transform duration-500 ${isLogin ? 'translate-x-0' : '-translate-x-full'}`}>
            <h2 className="text-2xl font-bold text-center">Login</h2>
          </div>
          <div className={`absolute w-full transition-transform duration-500 ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}>
            <h2 className="text-2xl font-bold text-center">Register</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
