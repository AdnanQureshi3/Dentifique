import { getAllMessages } from '@/Hooks/getAllMessages'
import useRTM from '@/Hooks/useRTM'
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { setChatmessages } from '@/redux/chatSlice';

function Messages({ isOnline, selectedUser }) {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const { ChatMessages } = useSelector(store => store.chat);
  const messagesEndRef = useRef(null);
  

  useRTM();

  useEffect(() => {
    if (selectedUser?._id) {
      getAllMessages(selectedUser._id, dispatch);
    }
  }, [selectedUser?._id, dispatch]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ChatMessages]);

    const sendMessageHandler = async () => {
    if (!text.trim()) return;
    console.log(text , "kaam kar raha hai");
  

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chats/send/${selectedUser._id}`,
        { message: text.trim() },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setChatmessages([...ChatMessages, JSON.parse(JSON.stringify(res.data.newMessage))]));
        setText('');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };
const SendButtonPressHandler = (e) => {
  
    if (e.key === 'Enter') sendMessageHandler();
  };

  const deleteChatHandler = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/chats/delete/${selectedUser._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setChatmessages([]));
        console.log('Chat deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-5 py-3 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={selectedUser?.profilePicture} />
            <AvatarFallback className="bg-indigo-200 text-indigo-800 font-semibold flex items-center justify-center rounded-full w-12 h-12">
              {selectedUser?.username?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-gray-900">{selectedUser?.username || 'User'}</p>
            <p className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
          <span className={`w-3 h-3 rounded-full border-2 border-white absolute bottom-2 left-16 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        </div>
        <button
          title="Delete conversation"
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"
        >
          <Trash2 size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {ChatMessages?.length > 0 ? (
          ChatMessages.map((msg, idx) => {
            const isSender = msg?.senderId !== selectedUser?._id;
            return (
              <div
                key={idx}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-5 py-3 rounded-lg text-sm ${
                    isSender
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg?.message}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-6xl mb-4">💬</p>
            <p className="text-xl font-semibold">No messages yet</p>
            <p className="text-gray-600">Start the conversation</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="sticky bottom-0 bg-white p-4 border-t flex items-center gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={SendButtonPressHandler}
          className="flex-grow px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {text.trim() && (
          <button
            onClick={() => {
              sendMessageHandler();
              setText('');
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            Send
          </button>
        )}
      </footer>
    </div>
  );
}

export default Messages;
