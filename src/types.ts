export interface Message {
  id: string;
  content: string;
  username: string;
  timestamp: Date;
  avatar: string;
  channelId: string;
  serverId?: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  friends: string[];
  friendRequests: {
    incoming: string[];
    outgoing: string[];
  };
  servers: string[];
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface Server {
  id: string;
  name: string;
  avatar: string;
  ownerId: string;
  members: string[];
  channels: Channel[];
  bots: Bot[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
}

export interface Bot {
  id: string;
  name: string;
  avatar: string;
  enabled: boolean;
}