import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getMe,
  login as loginApi,
  requestRegistrationOTP,
  verifyRegistrationOTP,
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  logoutApi,
} from '../../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('catalyst_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getMe();
      setUser(data);
    } catch {
      localStorage.removeItem('catalyst_token');
      localStorage.removeItem('catalyst_refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const { data } = await loginApi(email, password);
    localStorage.setItem('catalyst_token', data.access_token);
    localStorage.setItem('catalyst_refresh_token', data.refresh_token);
    const { data: userData } = await getMe();
    setUser(userData);
    toast.success('Welcome back!');
    return userData;
  };

  // Step 1: Request OTP for registration
  const signupRequestOTP = async (email, password) => {
    await requestRegistrationOTP(email, password);
    toast.success('OTP sent to your email!');
  };

  // Step 2: Verify OTP and complete registration
  const signupVerifyOTP = async (email, otp) => {
    const { data } = await verifyRegistrationOTP(email, otp);
    localStorage.setItem('catalyst_token', data.access_token);
    localStorage.setItem('catalyst_refresh_token', data.refresh_token);
    const { data: userData } = await getMe();
    setUser(userData);
    toast.success('Account created successfully!');
    return userData;
  };

  const forgotPassword = async (email) => {
    await forgotPasswordApi(email);
    toast.success('Password reset OTP sent to your email!');
  };

  const resetPassword = async (email, otp, newPassword) => {
    await resetPasswordApi(email, otp, newPassword);
    toast.success('Password reset successfully! Please log in.');
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('catalyst_refresh_token');
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // Ignore logout API errors — still clear local state
    }
    localStorage.removeItem('catalyst_token');
    localStorage.removeItem('catalyst_refresh_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Re-fetch user data (for credit balance updates etc.)
  const refreshUser = async () => {
    try {
      const { data } = await getMe();
      setUser(data);
    } catch {
      // silently fail
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signupRequestOTP,
        signupVerifyOTP,
        forgotPassword,
        resetPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
