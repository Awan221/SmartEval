import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, isAuthenticated, login, logout, register, updateProfile } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = async () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const loginUser = async (email, password) => {
    try {
      const userData = await login(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };
  
  const registerUser = async (userData) => {
    try {
      const newUser = await register(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  };
  
  const logoutUser = () => {
    logout();
    setUser(null);
  };
  
  const updateUser = async (userData) => {
    try {
      const updatedUser = await updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        updateProfile: updateUser,
        isAuthenticated: !!user,
        isProfessor: user?.role === 'professor',
        isStudent: user?.role === 'student',
        isAdmin: user?.role === 'admin',
      }}
    >
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