import { createContext, useState, useEffect } from 'react';
import { loginAdmin as loginApi } from '../services/authService';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminInfo');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem('adminInfo', JSON.stringify(data));
    setAdmin(data);
    return data;
  };

  // Used after a successful password reset (or account change) — the backend
  // already returns a valid token + admin data, so we just store it directly
  // instead of hitting the login API again.
  const setAdminSession = (data) => {
    localStorage.setItem('adminInfo', JSON.stringify(data));
    setAdmin(data);
  };

  const logout = () => {
    localStorage.removeItem('adminInfo');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, setAdminSession, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;