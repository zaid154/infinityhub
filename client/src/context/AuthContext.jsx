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
      const isUnverified = !!err.response?.data?.isUnverified;
      toast.dismiss();
      if (!isUnverified) {
        toast.error(message, { id: 'auth-login-error' });
      }
      return {
        success: false,
        message,
        isUnverified,
        email: err.response?.data?.email || email
      };
    }
  };

  const sendRegisterOtp = async (userData) => {
    try {
      const res = await api.post('/auth/send-register-otp', userData);
      if (res.data.success) {
        toast.dismiss();
        toast.success(res.data.message || 'Verification code sent to your email!', { id: 'send-otp-success' });
        return { success: true, message: res.data.message, email: res.data.email || userData.email };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to send verification code.';
      toast.dismiss();
      toast.error(message, { id: 'send-otp-error' });
      return { success: false, message };
    }
  };

  const verifyRegisterOtp = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-register-otp', { email, otp });
      if (res.data.success) {
        if (res.data.token && res.data.user) {
          localStorage.setItem('technova_token', res.data.token);
          setToken(res.data.token);
          setUser(res.data.user);
        }
        toast.dismiss();
        toast.success(res.data.message || 'Corporate account activated successfully!', { id: 'verify-otp-success' });
        return { success: true, user: res.data.user, token: res.data.token };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Verification failed.';
      toast.dismiss();
      toast.error(message, { id: 'verify-otp-error' });
      return { success: false, message };
    }
  };

  const sendResetOtp = async (email) => {
    try {
      const res = await api.post('/auth/send-reset-otp', { email });
      if (res.data.success) {
        toast.dismiss();
        toast.success(res.data.message || 'Password reset code dispatched.', { id: 'send-reset-success' });
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to send reset code.';
      toast.dismiss();
      toast.error(message, { id: 'send-reset-error' });
      return { success: false, message };
    }
  };

  const verifyResetOtp = async ({ email, otp, magicToken, newPassword }) => {
    try {
      const res = await api.post('/auth/verify-reset-otp', { email, otp, magicToken, newPassword });
      if (res.data.success) {
        toast.dismiss();
        toast.success(res.data.message || 'Password reset successfully! Please sign in.', { id: 'verify-reset-success' });
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to update password.';
      toast.dismiss();
      toast.error(message, { id: 'verify-reset-error' });
      return { success: false, message };
    }
  };

  const magicVerify = async (email, token) => {
    try {
      const res = await api.post('/auth/magic-verify', { email, token });
      if (res.data.success) {
        if (res.data.token && res.data.user) {
          localStorage.setItem('technova_token', res.data.token);
          setToken(res.data.token);
          setUser(res.data.user);
        }
        return { success: true, ...res.data };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Magic link verification failed.';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    return sendRegisterOtp(userData);
  };

  const resendVerification = async (email) => {
    return sendRegisterOtp({ email, name: 'Valued Customer', password: 'TemporaryPassword123!' });
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
        sendRegisterOtp,
        verifyRegisterOtp,
        sendResetOtp,
        verifyResetOtp,
        magicVerify,
        resendVerification,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
