import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const Navbar: React.FC = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await axios.post('/auth/signout');
    } catch (err: any) {
      console.error('Signout failed:', err.response?.data?.message || err.message);
    } finally {
      logout(navigate);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/weather" className="text-2xl font-bold">Weather</Link>
        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <Link to="/weather" className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200">Weather</Link>
            <Link to="/history" className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200">History</Link>
            <span className="text-sm hidden sm:block">Welcome, {userEmail}</span>
            <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition duration-200">Sign Out</button>
          </div>
        )}
        {!isAuthenticated && (
          <div className="space-x-4">
            <Link to="/signin" className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200">Sign In</Link>
            <Link to="/signup" className="px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};
