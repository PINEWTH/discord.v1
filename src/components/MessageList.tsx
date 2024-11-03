import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {messages.map((message) => (
        <div key={message.id} className="mb-4 hover:bg-gray-800/30 rounded p-2 transition-colors">
          <div className="flex items-start gap-4">
            <img
              src={message.avatar}
              alt={message.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-white">
                  {message.username}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-100 mt-1">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}