import api from './api';
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login/', { email, password });
    const { access, refresh, user } = response.data;
    
    // Store tokens and user data
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    throw error.response?.data || { detail: 'Login failed' };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register/', userData);
    const { access, refresh, user } = response.data;
    
    // Store tokens and user data
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    throw error.response?.data || { detail: 'Registration failed' };
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token is expired
      logout();
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/update_profile/', userData);
    
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Profile update failed' };
  }
};