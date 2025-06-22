import React, { useEffect } from 'react';
import { createBrowserRouter, Outlet, Navigate, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { WeatherPage } from '../pages/WeatherPage';
import { HistoryPage } from '../pages/HistoryPage';
import { LandingPage } from '../pages/LandingPage';

function Layout() {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans antialiased">
      <Navbar />
      <div className="container mx-auto px-4 mt-4">
        <Outlet />
      </div>
    </div>
  );
}

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Outlet /> : null;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "weather",
            element: <WeatherPage />,
          },
          {
            path: "history",
            element: <HistoryPage />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

// This file only exports the router object, App.tsx will render RouterProvider
// function Router() {
//   return <RouterProvider router={router} />;
// }
// export default Router; // No default export of component here
