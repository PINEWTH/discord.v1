import React, { useState } from 'react';
import { User, KeyRound } from 'lucide-react';
import { UserCredentials } from '../types';

interface AuthProps {
  onLogin: (credentials: UserCredentials) => boolean;
  onRegister: (credentials: UserCredentials) => boolean;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = isLogin
      ? onLogin(credentials)
      : onRegister(credentials);

    if (!success) {
      setError(isLogin
        ? 'Invalid username or password'
        : 'Username already exists'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-600 rounded-full">
            {isLogin ? <KeyRound size={32} className="text-white" /> : <User size={32} className="text-white" />}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          {isLogin ? 'Login' : 'Register'} p1ne app
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors mb-4"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
          <p className="text-center text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};