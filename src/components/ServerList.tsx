import React from 'react';
import { Server } from '../types';

interface ServerListProps {
  servers: Server[];
  selectedServerId?: string;
  onServerSelect: (serverId: string) => void;
}

export function ServerList({
  servers,
  selectedServerId,
  onServerSelect,
}: ServerListProps) {
  return (
    <div className="space-y-2">
      {servers.map((server) => (
        <button
          key={server.id}
          onClick={() => onServerSelect(server.id)}
          className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors ${
            selectedServerId === server.id
              ? 'bg-gray-700 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <img
            src={server.avatar}
            alt={server.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="truncate">{server.name}</span>
        </button>
      ))}
    </div>
  );
}