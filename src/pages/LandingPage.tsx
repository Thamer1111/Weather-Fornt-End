import React from 'react';
import { Link } from 'react-router';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6 tracking-tight">
          Weather
        </h1>
        <p className="text-xl text-gray-700 mb-10 max-w-lg mx-auto">
          Your personal portal to current weather information. Sign in or sign up to get started!
        </p>
        <div className="flex space-x-4 justify-center">
          <Link
            to="/signin"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
