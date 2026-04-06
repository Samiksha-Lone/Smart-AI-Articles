import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// ── Set auth header immediately from persisted token ──────────────────────────
// This runs synchronously at module load — before any useEffect — so the
// Authorization header is present for the very first API call.
const persistedToken = localStorage.getItem('token');
if (persistedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${persistedToken}`;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://beyondchats-assignment-backend.onrender.com/api';

  // Keep axios header in sync with token state changes (login / logout)
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if token is valid on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // You could add a /me endpoint to verify token
          // For now, just set user from localStorage
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          // eslint-disable-next-line react-hooks/immutability
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;

      // ── Set header IMMEDIATELY before any state change triggers re-renders ──
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
      const { token: newToken, user: userData } = response.data;

      // ── Set header IMMEDIATELY before any state change triggers re-renders ──
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};