import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const setupAxiosInterceptors = useCallback((token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  useEffect(() => {
    // Uygulama ilk yüklendiğinde token varsa interceptor'ı ayarla
    if (token) {
      setupAxiosInterceptors(token);
      // Burada /api/auth/me gibi bir endpoint ile kullanıcı bilgileri çekilebilir
      // Şimdilik token'ın varlığını yeterli kabul ediyoruz.
    }
    setLoading(false);
  }, [token, setupAxiosInterceptors]);

  const login = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setupAxiosInterceptors(newToken);
  }, [setupAxiosInterceptors]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setupAxiosInterceptors(null);
  }, [setupAxiosInterceptors]);

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};