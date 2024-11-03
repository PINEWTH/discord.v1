import React from 'react';
import { User } from '../types';
import { UserPlus, UserCheck, UserX } from 'lucide-react';
import { useFriends } from '../hooks/useFriends';

interface FriendListProps {
  currentUser: User;
  selectedFriendId?: string;
  onFriendSelect: (friendId: string) => void;
}

export function FriendList({
  currentUser,
  selectedFriendId,
  onFriendSelect,
}: FriendListProps) {
  const {
    friends,
    incomingRequests,
    outgoingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  } = useFriends(currentUser.id);

  return (
    <div className="space-y-4">
      {/* Friend Requests */}
      {incomingRequests.length > 0 && (
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase mb-2">
            Pending Requests ({incomingRequests.length})
          </h3>
          <div className="space-y-1">
            {incomingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={request.avatar}
                    alt={request.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-300">{request.username}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => acceptFriendRequest(request.id)}
                    className="p-1 text-green-400 hover:text-green-300"
                    title="Accept"
                  >
                    <UserCheck size={16} />
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(request.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Reject"
                  >
                    <UserX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div>
        <h3 className="text-gray-400 text-xs font-semibold uppercase mb-2">
          Friends ({friends.length})
        </h3>
        <div className="space-y-1">
          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onFriendSelect(friend.id)}
              className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
                selectedFriendId === friend.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={friend.avatar}
                  alt={friend.username}
                  className="w-8 h-8 rounded-full"
                />
                <span>{friend.username}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFriend(friend.id);
                }}
                className="p-1 text-gray-400 hover:text-red-400"
                title="Remove Friend"
              >
                <UserX size={16} />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Add Friend Button */}
      <button
        onClick={() => {/* Show add friend modal */}}
        className="w-full flex items-center gap-2 p-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
      >
        <UserPlus size={20} />
        <span>Add Friend</span>
      </button>
    </div>
  );
}