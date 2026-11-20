import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('technova_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('technova_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch {
          console.error('[Auth Error] Session expired or invalid');
          localStorage.removeItem('technova_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('technova_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(message);
      return { success: false, message, isUnverified: err.response?.data?.isUnverified };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        toast.success(res.data.message || 'Verification link sent to your email!');
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('technova_token');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile updated successfully');
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
