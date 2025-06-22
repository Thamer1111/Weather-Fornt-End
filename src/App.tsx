import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes/Router';
import { AuthProvider } from './context/AuthContext'; // استيراد AuthProvider

function App() {
  return (
    // AuthProvider يجب أن يغلف RouterProvider
    // لضمان أن جميع المكونات التي يتم عرضها بواسطة الـ router
    // (مثل Navbar، وجميع الصفحات المحمية) يمكنها استخدام useAuth
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
