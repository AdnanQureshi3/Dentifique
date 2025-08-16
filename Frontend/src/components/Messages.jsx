import { getAllMessages } from '@/Hooks/getAllMessages'
import useRTM from '@/Hooks/useRTM'
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Trash2, Check, CheckCheck } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { setChatmessages } from '@/redux/chatSlice';
import AiReplyDialog from './AI_Reply_Dialog.jsx';
import { toast } from 'sonner';

function Messages({ isOnline, selectedUser }) {
  const [text, setText] = useState('');
  const [open , setOpen ] = useState(false);
  const dispatch = useDispatch();
  const { ChatMessages } = useSelector(store => store.chat);
  const messagesEndRef = useRef(null);
  const { user } = useSelector(store => store.auth);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, message: null });
  const [selectedMessages, setSelectedMessages] = useState([]);
  
  useRTM();

  useEffect(() => {
    if (selectedUser?._id) {
      setSelectedMessages([]);
      setText('');
      getAllMessages(selectedUser._id, dispatch);
    }
  }, [selectedUser?._id, dispatch  ]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ChatMessages]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu]);

  const sendMessageHandler = async () => {
    if (!text.trim()) return;
  
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
        setSelectedMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const deleteformeHandler= async () => {
    try {
      console.log("deleting for me...");
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/chats/deleteforme/${selectedUser._id}`,
        { data: { messagesArray: selectedMessages },
        withCredentials: true }
      );
      if (res.data.success) {
        console.log("deleted for me.");
         getAllMessages(selectedUser._id, dispatch);
        
      }
    } catch (err) {
      console.error(err);
    }
  };
  const AiReplyHandler= async (tone , description) => {
   
    try {
      console.log("Selected Messages: ", selectedMessages);
      const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/ai/reply`,
      { 
        messagesArray: selectedMessages, 
        tone, 
        description 
      },
      { withCredentials: true } // 👈 move this here
    );

      // console.log("Ai replying" , res);

      const reply = res.data.result.response.candidates[0].content.parts[0].text;
      setText(reply);
      setTimeout(() => {
        setOpen(false);
         }, 1500);
      
    } catch (err) {
      console.error(err);
    }
  };

  // Delete single message
  const deleteMessageHandler = async (messageId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/messages/${messageId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setChatmessages(ChatMessages.filter(msg => msg._id !== messageId)));
        setSelectedMessages(selectedMessages.filter(id => id !== messageId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete selected messages
  const deleteSelectedMessagesHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages/delete-multiple`,
        { messageIds: selectedMessages },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setChatmessages(ChatMessages.filter(msg => !selectedMessages.includes(msg._id))));
        setSelectedMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle message right-click
  const handleMessageRightClick = (e, message) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      message
    });
  };

  const toggleMessageSelection = (messageId) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(selectedMessages.filter(id => id !== messageId));
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
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
        {
  
    <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200">
  {/* AI Reply */}
  <button
    title="AI Reply"
    onClick={() => {
       if(selectedMessages.length === 0){
      toast.error("Please select some messages to reply.", {
                      className:'bg-red-500 text-white p-4 rounded-lg shadow-md',
                  });
      return; 
    }

      setOpen(true)
    }}
 className=" flex items-center justify-center w-24 h-10 bg-gradient-to-tr from-green-300 to-green-700 
             text-white rounded-lg shadow-2xl hover:scale-110 transition-transform duration-300 
             ring-4 ring-green-300 "  >
    🤖 AI Reply
  </button>

  {/* Delete Conversation */}
  <button
    title="Delete Selected Messages"
    onClick={() => {
       if(selectedMessages.length === 0){
      toast.error("Please select some messages to delete.", {
                      className:'bg-red-500 text-white p-4 rounded-lg shadow-md',
                  });
      return; 
    }

      deleteSelectedMessagesHandler();
    }}
    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition font-medium"
  >
    🗑 Delete
  </button>

  
  <button
    title="Delete for me"
    onClick={() => {
      if(selectedMessages.length === 0){
        toast.error("Please select some messages to delete for you.", {
          className:'bg-red-500 text-white p-4 rounded-lg shadow-md',
        });
        return; 
      }

      setSelectedMessages([]);
      deleteformeHandler();
    }}
    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 transition font-medium"
  >
    🛡 Delete for me
  </button>

  {selectedMessages.length > 0 && (
  <button
    title="Cancel selection"
    onClick={() => {
      setSelectedMessages([]);
      setIsSelectMode(false);
    }}
    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900 transition font-medium"
  >
    ✖ Cancel
  </button>
  )}



</div>

  
}

       
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {ChatMessages?.length > 0 ? (
          ChatMessages
          .filter(msg => !msg.NotVisibleTo?.includes(user?._id))
          .map((msg, idx) => {
           
            const isSender = msg?.senderId !== selectedUser?._id;
            return (
              <div
                key={msg._id || idx}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                onContextMenu={(e) => handleMessageRightClick(e, msg)}
              >
                <div
                  className={`relative max-w-xs px-5 py-3 rounded-lg text-sm break-words ${
                    isSender
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                  }`}
                >
                
                  {selectedMessages.length > 0 && (
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(msg._id)}
                      onChange={() => toggleMessageSelection(msg._id)}
                      className="absolute left-2 top-2 "
                    />
                  )}
                  
                  <span className={selectedMessages.length > 0 ? 'ml-5' : ''}>
                    {msg?.message}
                  </span>

              
                  <div className="flex justify-end items-center mt-1 gap-1">
                    <span className="text-[8px] text-gray-300">
                      {msg?.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                    
                    {/* Read receipts */}
                    {isSender && (
                      <span className="text-[10px] ml-1">
                        {msg.isRead ? (
                          <CheckCheck size={12} className="text-indigo-300" />
                        ) : (
                          <Check size={12} className="text-gray-300" />
                        )}
                      </span>
                    )}
                  </div>
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

      {/* Context Menu */}
      {contextMenu.visible && (
        <div 
          className="fixed bg-white shadow-lg rounded-md z-50 py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            onClick={() => {
              setSelectedMessages([contextMenu.message._id]);
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Select
          </button>
          <button 
            onClick={() => {
              deleteMessageHandler(contextMenu.message._id);
              setContextMenu({ ...contextMenu, visible: false });
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
     <AiReplyDialog open={open} setOpen={setOpen} AiReplyHandler={AiReplyHandler} />

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