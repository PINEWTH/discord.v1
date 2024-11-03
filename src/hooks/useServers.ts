import { useState, useEffect } from 'react';
import { Server, Channel, Bot, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const SERVERS_KEY = 'discord_servers';
const USERS_KEY = 'discord_users';

export function useServers(currentUserId: string) {
  const [servers, setServers] = useState<Server[]>([]);

  const getStoredServers = (): Record<string, Server> => {
    const stored = localStorage.getItem(SERVERS_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const updateServers = (newServers: Record<string, Server>) => {
    localStorage.setItem(SERVERS_KEY, JSON.stringify(newServers));
    loadServers();
  };

  const loadServers = () => {
    const storedServers = getStoredServers();
    setServers(
      Object.values(storedServers).filter((server) =>
        server.members.includes(currentUserId)
      )
    );
  };

  useEffect(() => {
    loadServers();
  }, [currentUserId]);

  const createServer = (name: string, avatar: string): Server => {
    const servers = getStoredServers();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');

    const newServer: Server = {
      id: uuidv4(),
      name,
      avatar,
      ownerId: currentUserId,
      members: [currentUserId],
      channels: [
        { id: uuidv4(), name: 'general', type: 'text' },
        { id: uuidv4(), name: 'voice', type: 'voice' },
      ],
      bots: [],
    };

    servers[newServer.id] = newServer;
    users[currentUserId].servers.push(newServer.id);

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    updateServers(servers);

    return newServer;
  };

  const updateServer = (
    serverId: string,
    updates: Partial<Pick<Server, 'name' | 'avatar'>>
  ) => {
    const servers = getStoredServers();
    const server = servers[serverId];

    if (!server || server.ownerId !== currentUserId) return false;

    servers[serverId] = { ...server, ...updates };
    updateServers(servers);
    return true;
  };

  const deleteServer = (serverId: string) => {
    const servers = getStoredServers();
    const server = servers[serverId];

    if (!server || server.ownerId !== currentUserId) return false;

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    server.members.forEach((memberId) => {
      users[memberId].servers = users[memberId].servers.filter(
        (id: string) => id !== serverId
      );
    });

    delete servers[serverId];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    updateServers(servers);
    return true;
  };

  const addChannel = (serverId: string, name: string, type: Channel['type']) => {
    const servers = getStoredServers();
    const server = servers[serverId];

    if (!server || server.ownerId !== currentUserId) return false;

    const newChannel: Channel = {
      id: uuidv4(),
      name,
      type,
    };

    server.channels.push(newChannel);
    updateServers(servers);
    return true;
  };

  const removeChannel = (serverId: string, channelId: string) => {
    const servers = getStoredServers();
    const server = servers[serverId];

    if (!server || server.ownerId !== currentUserId) return false;

    server.channels = server.channels.filter((c) => c.id !== channelId);
    updateServers(servers);
    return true;
  };

  const addBot = (serverId: string, bot: Omit<Bot, 'id'>) => {
    const servers = getStoredServers();
    const server = servers[serverId];

    if (!server || server.ownerId !== currentUserId) return false;

    const newBot: Bot = {
      id: uuidv4(),
      ...bot,
    };

    server.bots.push(newBot);
    updateServers(servers);
    return true;
  };

  const removeBot = (serverId: string, botId: string) => {
    const servers = getStoredServers();
    const server = servers[serverId];

    if (!server || server.ownerId !== currentUserId) return false;

    server.bots = server.bots.filter((b) => b.id !== botId);
    updateServers(servers);
    return true;
  };

  const toggleBot = (serverId: string, botId: string) => {
    const servers = getStoredServers();
    const server = servers[serverId];

    if (!server || server.ownerId !== currentUserId) return false;

    const bot = server.bots.find((b) => b.id === botId);
    if (bot) {
      bot.enabled = !bot.enabled;
      updateServers(servers);
      return true;
    }
    return false;
  };

  return {
    servers,
    createServer,
    updateServer,
    deleteServer,
    addChannel,
    removeChannel,
    addBot,
    removeBot,
    toggleBot,
  };
}