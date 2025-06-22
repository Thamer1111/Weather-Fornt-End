import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ErrorMessage } from '../components/ErrorMessage';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/weather', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://weather-project-fuwi.onrender.com/api/auth/signup', { email, password });
      
      if (response.data && response.data.token) {
        login(response.data.token, email, navigate);
      } else {
        setError('Authentication failed: No token received.');
      }
    } catch (err: any) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Sign Up failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg w-full max-w-sm mx-auto space-y-4">
        <div className="text-center text-3xl font-extrabold text-gray-900">
          Sign Up
        </div>
        {error && <ErrorMessage message={error} />}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>
        <div className="mt-4 text-center">
          <Link to="/signin" className="text-blue-600 hover:underline">Already have an account? Sign In</Link>
        </div>
      </form>
    </div>
  );
};
