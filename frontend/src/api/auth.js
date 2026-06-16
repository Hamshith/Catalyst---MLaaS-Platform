import { userClient } from './client';

export const login = (email, password) =>
  userClient.post('/auth/login', { email, password });

export const requestRegistrationOTP = (email, password) =>
  userClient.post('/auth/register/request-otp', { email, password });

export const verifyRegistrationOTP = (email, otp) =>
  userClient.post('/auth/register/verify', { email, otp });

export const forgotPassword = (email) =>
  userClient.post('/auth/forgot-password', { email });

export const resetPassword = (email, otp, newPassword) =>
  userClient.post('/auth/reset-password', { email, otp, new_password: newPassword });

export const logoutApi = (refreshToken) =>
  userClient.post('/auth/logout', { refresh_token: refreshToken });

export const refreshToken = (refreshToken) =>
  userClient.post('/auth/refresh', { refresh_token: refreshToken });

export const getMe = () => userClient.get('/users/me');

export const changePassword = (currentPassword, newPassword) =>
  userClient.post('/users/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
