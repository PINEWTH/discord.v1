import { useState, useEffect } from 'react';
import { User } from '../types';

const USERS_KEY = 'discord_users';

export function useFriends(currentUserId: string) {
  const [friends, setFriends] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<User[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<User[]>([]);

  const getStoredUsers = (): Record<string, User> => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const updateUsers = (users: Record<string, User>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    loadFriendData();
  };

  const loadFriendData = () => {
    const users = getStoredUsers();
    const currentUser = users[currentUserId];

    if (!currentUser) return;

    setFriends(
      currentUser.friends
        .map((id) => users[id])
        .filter(Boolean)
    );

    setIncomingRequests(
      currentUser.friendRequests.incoming
        .map((id) => users[id])
        .filter(Boolean)
    );

    setOutgoingRequests(
      currentUser.friendRequests.outgoing
        .map((id) => users[id])
        .filter(Boolean)
    );
  };

  useEffect(() => {
    loadFriendData();
  }, [currentUserId]);

  const sendFriendRequest = (username: string) => {
    const users = getStoredUsers();
    const targetUser = Object.values(users).find(u => u.username === username);

    if (!targetUser || targetUser.id === currentUserId) return false;
    if (users[currentUserId].friends.includes(targetUser.id)) return false;

    users[currentUserId].friendRequests.outgoing.push(targetUser.id);
    users[targetUser.id].friendRequests.incoming.push(currentUserId);

    updateUsers(users);
    return true;
  };

  const acceptFriendRequest = (userId: string) => {
    const users = getStoredUsers();
    
    users[currentUserId].friendRequests.incoming = users[currentUserId].friendRequests.incoming
      .filter(id => id !== userId);
    users[userId].friendRequests.outgoing = users[userId].friendRequests.outgoing
      .filter(id => id !== currentUserId);

    users[currentUserId].friends.push(userId);
    users[userId].friends.push(currentUserId);

    updateUsers(users);
  };

  const rejectFriendRequest = (userId: string) => {
    const users = getStoredUsers();
    
    users[currentUserId].friendRequests.incoming = users[currentUserId].friendRequests.incoming
      .filter(id => id !== userId);
    users[userId].friendRequests.outgoing = users[userId].friendRequests.outgoing
      .filter(id => id !== currentUserId);

    updateUsers(users);
  };

  const removeFriend = (userId: string) => {
    const users = getStoredUsers();
    
    users[currentUserId].friends = users[currentUserId].friends
      .filter(id => id !== userId);
    users[userId].friends = users[userId].friends
      .filter(id => id !== currentUserId);

    updateUsers(users);
  };

  return {
    friends,
    incomingRequests,
    outgoingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  };
}