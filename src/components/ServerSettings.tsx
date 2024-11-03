import React, { useState } from 'react';
import { X, Trash2, Plus, Bot } from 'lucide-react';
import { Server, Channel, Bot as BotType } from '../types';

interface ServerSettingsProps {
  server: Server;
  onClose: () => void;
  onUpdateServer: (updates: Partial<Pick<Server, 'name' | 'avatar'>>) => void;
  onDeleteServer: () => void;
  onAddChannel: (name: string, type: Channel['type']) => void;
  onRemoveChannel: (channelId: string) => void;
  onAddBot: (bot: Omit<BotType, 'id'>) => void;
  onRemoveBot: (botId: string) => void;
  onToggleBot: (botId: string) => void;
}

export function ServerSettings({
  server,
  onClose,
  onUpdateServer,
  onDeleteServer,
  onAddChannel,
  onRemoveChannel,
  onAddBot,
  onRemoveBot,
  onToggleBot,
}: ServerSettingsProps) {
  const [name, setName] = useState(server.name);
  const [avatar, setAvatar] = useState(server.avatar);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<Channel['type']>('text');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateServer({ name, avatar });
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChannelName) {
      onAddChannel(newChannelName, newChannelType);
      setNewChannelName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Server Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Server Overview */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <label className="block text-gray-300 mb-2">Server Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Server Avatar URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </form>

          {/* Channels */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Channels</h3>
            <div className="space-y-2 mb-4">
              {server.channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">#{channel.name}</span>
                    <span className="text-xs text-gray-400">({channel.type})</span>
                  </div>
                  <button
                    onClick={() => onRemoveChannel(channel.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddChannel} className="flex gap-2">
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="New channel name"
                className="flex-1 bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newChannelType}
                onChange={(e) => setNewChannelType(e.target.value as Channel['type'])}
                className="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="text">Text</option>
                <option value="voice">Voice</option>
              </select>
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </form>
          </div>

          {/* Bots */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Bots</h3>
            <div className="space-y-2 mb-4">
              {server.bots.map((bot) => (
                <div
                  key={bot.id}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={bot.avatar}
                      alt={bot.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-300">{bot.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        bot.enabled
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-600 text-gray-400'
                      }`}
                    >
                      {bot.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleBot(bot.id)}
                      className="text-gray-400 hover:text-blue-400"
                    >
                      <Bot size={16} />
                    </button>
                    <button
                      onClick={() => onRemoveBot(bot.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                onAddBot({
                  name: 'New Bot',
                  avatar: 'https://images.unsplash.com/photo-1635236066449-5b45769c6160?w=100&h=100&fit=crop',
                  enabled: false,
                })
              }
              className="w-full py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              <span>Add Bot</span>
            </button>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
            {showDeleteConfirm ? (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-md">
                <p className="text-gray-300 mb-4">
                  Are you sure you want to delete this server? This action cannot be
                  undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={onDeleteServer}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Yes, delete server
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Server
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}