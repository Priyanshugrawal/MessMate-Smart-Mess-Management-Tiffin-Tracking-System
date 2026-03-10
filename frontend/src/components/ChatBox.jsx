import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  UserIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline';
import api from '../api/client';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [chatType, setChatType] = useState('general'); // 'general' or 'private'
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  const socket = useMemo(() => {
    const token = localStorage.getItem('token');
    return io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
    });
  }, []);

  useEffect(() => {
    // Get current user ID from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
      } catch (err) {
        console.error('Failed to parse token:', err);
      }
    }

    // Fetch users list for private chat
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/chat/users');
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const params = new URLSearchParams();
        params.append('chat_type', chatType);
        if (chatType === 'private' && selectedUser) {
          params.append('receiver_id', selectedUser.id);
        }
        
        const { data } = await api.get(`/chat/messages?${params.toString()}`);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();

    // Join appropriate room
    if (chatType === 'private' && selectedUser) {
      socket.emit('joinPrivate', { receiverId: selectedUser.id });
    }

    // Listen for new messages
    socket.on('chatMessage', (message) => {
      // Filter messages based on chat type
      if (chatType === 'general' && message.chat_type === 'general') {
        setMessages((prev) => [...prev, message]);
      } else if (
        chatType === 'private' &&
        selectedUser &&
        message.chat_type === 'private' &&
        ((message.sender_id === currentUserId && message.receiver_id === selectedUser.id) ||
         (message.sender_id === selectedUser.id && message.receiver_id === currentUserId))
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [chatType, selectedUser, socket, currentUserId]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = () => {
    if (!text.trim()) return;
    
    const payload = {
      message: text,
      chat_type: chatType,
      receiver_id: chatType === 'private' ? selectedUser?.id : null,
    };
    
    socket.emit('chatMessage', payload);
    setText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[600px] flex-col rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 overflow-hidden">
      {/* Header with Chat Type Selector */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-white">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            <h3 className="font-semibold text-lg">MessMate Chat</h3>
          </div>
        </div>
        
        {/* Chat Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setChatType('general');
              setSelectedUser(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              chatType === 'general'
                ? 'bg-white text-blue-600'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            <UserGroupIcon className="w-5 h-5" />
            General
          </button>
          <button
            onClick={() => setChatType('private')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              chatType === 'private'
                ? 'bg-white text-blue-600'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            Private
          </button>
        </div>
      </div>

      {/* Private Chat User Selector */}
      {chatType === 'private' && (
        <div className="border-b border-slate-200 p-3 bg-slate-50">
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Select User to Chat:
          </label>
          <select
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const user = users.find((u) => u.id === parseInt(e.target.value));
              setSelectedUser(user);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        <AnimatePresence>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isOwnMessage = msg.sender_id === currentUserId;
              return (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {!isOwnMessage && msg.sender_name && (
                      <p className="text-xs font-semibold mb-1 text-blue-600">
                        {msg.sender_name}
                      </p>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="flex gap-2 border-t border-slate-200 p-4 bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={chatType === 'private' && !selectedUser}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder={
            chatType === 'private' && !selectedUser
              ? 'Select a user first...'
              : 'Type your message...'
          }
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          disabled={chatType === 'private' && !selectedUser}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          Send
        </motion.button>
      </div>
    </div>
  );
}

export default ChatBox;

