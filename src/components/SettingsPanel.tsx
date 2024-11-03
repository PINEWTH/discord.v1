import React, { useState } from 'react';
import { X, User, Shield, AlertTriangle, ChevronRight, Camera } from 'lucide-react';
import { AvatarChange } from './AvatarChange';

interface SettingsPanelProps {
  currentUser: {
    id: string;
    username: string;
    avatar: string;
  };
  onClose: () => void;
  onUpdateUsername: (username: string) => Promise<boolean>;
  onUpdatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  onUpdateAvatar: (avatar: string) => void;
  onDeleteAccount: (password: string) => Promise<boolean>;
  onLogout: () => void;
}

type SettingsTab = 'My Account' | 'Password and Security' | 'Delete Account';

export function SettingsPanel({
  currentUser,
  onClose,
  onUpdateUsername,
  onUpdatePassword,
  onUpdateAvatar,
  onDeleteAccount,
  onLogout,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('My Account');
  const [showAvatarChange, setShowAvatarChange] = useState(false);
  const [username, setUsername] = useState(currentUser.username);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === currentUser.username) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await onUpdateUsername(username);
      if (success) {
        setSuccess('Username updated successfully');
      } else {
        setError('Username already taken');
      }
    } catch (err) {
      setError('Failed to update username');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await onUpdatePassword(oldPassword, newPassword);
      if (success) {
        setSuccess('Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError('Current password is incorrect');
      }
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError('');

    try {
      const success = await onDeleteAccount(deletePassword);
      if (!success) {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'My Account':
        return (
          <div className="space-y-6">
            <div className="relative">
              <div className="aspect-square w-20 rounded-full overflow-hidden bg-gray-700">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setShowAvatarChange(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Camera className="text-white" size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minLength={3}
                  maxLength={32}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || username === currentUser.username}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </form>

            <button
              onClick={onLogout}
              className="w-full py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        );

      case 'Password and Security':
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                minLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Password
            </button>
          </form>
        );

      case 'Delete Account':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-md">
              <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle size={20} />
                Delete Account
              </h4>
              <p className="text-gray-300 text-sm">
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </p>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !deletePassword}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl h-[600px] flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 p-4 rounded-l-lg">
          <div className="text-gray-400 uppercase text-xs font-semibold mb-2">
            User Settings
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('My Account')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                activeTab === 'My Account'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <User size={20} />
              <span>My Account</span>
              <ChevronRight size={16} className="ml-auto" />
            </button>
            <button
              onClick={() => setActiveTab('Password and Security')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                activeTab === 'Password and Security'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Shield size={20} />
              <span>Password and Security</span>
              <ChevronRight size={16} className="ml-auto" />
            </button>
            <button
              onClick={() => setActiveTab('Delete Account')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                activeTab === 'Delete Account'
                  ? 'bg-red-600 text-white'
                  : 'text-red-400 hover:bg-gray-800'
              }`}
            >
              <AlertTriangle size={20} />
              <span>Delete Account</span>
              <ChevronRight size={16} className="ml-auto" />
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{activeTab}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-400 text-sm">
              {success}
            </div>
          )}

          {renderTab()}
        </div>
      </div>

      {showAvatarChange && (
        <AvatarChange
          currentAvatar={currentUser.avatar}
          onAvatarChange={onUpdateAvatar}
          onClose={() => setShowAvatarChange(false)}
        />
      )}
    </div>
  );
}