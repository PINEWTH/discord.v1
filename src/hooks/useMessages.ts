import { useState, useEffect } from 'react';
import { Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'discord_messages';

const defaultMessages: Message[] = [
  {
    id: '1',
    content: 'Welcome to p1ne app! Feel free to start chatting.',
    username: 'System',
    timestamp: new Date(),
    avatar: 'https://images.unsplash.com/photo-1635236066449-5b45769c6160?w=100&h=100&fit=crop',
  }
];

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }));
    }
    return defaultMessages;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const addMessage = (content: string, user: { username: string; avatar: string }) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      username: user.username,
      timestamp: new Date(),
      avatar: user.avatar,
    };
    setMessages([...messages, newMessage]);
  };

  return { messages, addMessage };
}