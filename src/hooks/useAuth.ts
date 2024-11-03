import { useState, useEffect } from 'react';
import { User, UserCredentials } from '../types';
import { v4 as uuidv4 } from 'uuid';

const USERS_KEY = 'discord_users';
const CURRENT_USER_KEY = 'discord_current_user';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const getStoredUsers = (): Record<string, UserCredentials & User> => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const login = (credentials: UserCredentials) => {
    const users = getStoredUsers();
    const user = Object.values(users).find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (credentials: UserCredentials) => {
    const users = getStoredUsers();
    
    if (Object.values(users).some(u => u.username === credentials.username)) {
      return false;
    }

    const newUser = {
      ...credentials,
      id: uuidv4(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop`,
    };

    users[newUser.id] = newUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return true;
  };

  const updateUsername = async (newUsername: string): Promise<boolean> => {
    if (!currentUser) return false;

    const users = getStoredUsers();
    if (Object.values(users).some(u => u.username === newUsername && u.id !== currentUser.id)) {
      return false;
    }

    const user = users[currentUser.id];
    if (user) {
      user.username = newUsername;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      const updatedUser = { ...currentUser, username: newUsername };
      setCurrentUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const updatePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!currentUser) return false;

    const users = getStoredUsers();
    const user = users[currentUser.id];
    
    if (user && user.password === oldPassword) {
      user.password = newPassword;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  };

  const updateAvatar = (newAvatar: string) => {
    if (!currentUser) return;

    const users = getStoredUsers();
    const user = users[currentUser.id];
    
    if (user) {
      user.avatar = newAvatar;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      const updatedUser = { ...currentUser, avatar: newAvatar };
      setCurrentUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const deleteAccount = async (password: string): Promise<boolean> => {
    if (!currentUser) return false;

    const users = getStoredUsers();
    const user = users[currentUser.id];
    
    if (user && user.password === password) {
      delete users[currentUser.id];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setCurrentUser(null);
      localStorage.removeItem(CURRENT_USER_KEY);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return {
    currentUser,
    login,
    register,
    logout,
    updateUsername,
    updatePassword,
    updateAvatar,
    deleteAccount,
  };
}