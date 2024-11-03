import React from 'react';
import { Hash, Users, Plus, Settings, ChevronDown } from 'lucide-react';
import { Server, User } from '../types';
import { ServerList } from './ServerList';
import { FriendList } from './FriendList';

interface SidebarProps {
  currentUser: User;
  servers: Server[];
  onCreateServer: () => void;
  onServerSelect: (serverId: string) => void;
  onFriendSelect: (friendId: string) => void;
  selectedServerId?: string;
  selectedFriendId?: string;
  onShowSettings: () => void;
}

export function Sidebar({
  currentUser,
  servers,
  onCreateServer,
  onServerSelect,
  onFriendSelect,
  selectedServerId,
  selectedFriendId,
  onShowSettings,
}: SidebarProps) {
  const [showFriends, setShowFriends] = React.useState(true);

  return (
    <div className="w-64 bg-gray-800 flex flex-col h-full">
      {/* Server List */}
      <div className="p-3 border-b border-gray-700">
        <ServerList
          servers={servers}
          selectedServerId={selectedServerId}
          onServerSelect={onServerSelect}
        />
        <button
          onClick={onCreateServer}
          className="w-full mt-2 p-2 flex items-center gap-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
        >
          <Plus size={20} />
          <span>Create Server</span>
        </button>
      </div>

      {/* Friends Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <button
            onClick={() => setShowFriends(!showFriends)}
            className="w-full flex items-center justify-between text-gray-300 hover:text-white mb-2"
          >
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>Friends</span>
            </div>
            <ChevronDown
              size={16}
              className={`transform transition-transform ${
                showFriends ? 'rotate-0' : '-rotate-90'
              }`}
            />
          </button>
          {showFriends && (
            <FriendList
              currentUser={currentUser}
              selectedFriendId={selectedFriendId}
              onFriendSelect={onFriendSelect}
            />
          )}
        </div>
      </div>

      {/* User Controls */}
      <div className="p-3 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white font-medium">{currentUser.username}</span>
          </div>
          <button
            onClick={onShowSettings}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}