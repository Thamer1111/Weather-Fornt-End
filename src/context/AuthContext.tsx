import React, { useState, useEffect, createContext, useContext } from 'react';
type CustomNavigateFunction = (to: string, options?: { replace?: boolean; state?: any }) => void;

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  jwt: string | null;
  login: (token: string, email: string, navigate: CustomNavigateFunction) => void;
  logout: (navigate: CustomNavigateFunction) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    const storedJwt = localStorage.getItem('jwt_token');
    const storedEmail = localStorage.getItem('user_email');
    if (storedJwt && storedEmail) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail);
      setJwt(storedJwt);
    } else {
      setIsAuthenticated(false);
      setUserEmail(null);
      setJwt(null);
    }
  }, []);

  const login = (token: string, email: string, navigate: CustomNavigateFunction) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_email', email);
    setIsAuthenticated(true);
    setUserEmail(email);
    setJwt(token);
    navigate('/weather');
  };

  const logout = (navigate: CustomNavigateFunction) => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setUserEmail(null);
    setJwt(null);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, jwt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
