import { useState, useEffect } from 'react';
import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { MessageCircle, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Messages from './Messages.jsx';
import axios from 'axios';
import { setChatmessages } from '@/redux/chatSlice';

function Chatpage() {
    const { user, suggestedUser, selecteduser } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const { onlineUsers, ChatMessages } = useSelector(store => store.chat);
    const isOnline = onlineUsers.includes(selecteduser?._id);

    const [text, settext] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    
    useEffect(() => {
        dispatch(setSelectedUser(null));
    }, []);
    
 
    
 
  
    
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    }

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen p-4 flex">
            {/* Sidebar */}
            <section className={`bg-white shadow-lg rounded-xl border border-gray-200 p-4 h-[calc(100vh-2rem)] flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-80'}`}>
                <div className="flex items-center justify-between mb-4">
                    {!isSidebarCollapsed && (
                        <h1 className="text-xl font-bold text-indigo-800">{user?.username}</h1>
                    )}
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                        {isSidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
                
                <hr className="border-gray-200 mb-4" />
                
                <div className="overflow-y-auto pr-2 flex-grow">
                    {suggestedUser.map((u) => {
                        const isOnline = onlineUsers.includes(u._id);
                        return (
                            <div 
                                onClick={() => {
                                    if (u._id !== selecteduser?._id) {
                                        dispatch(setSelectedUser(u));
                                        dispatch(setChatmessages([]));
                                    }
                                }}
                                key={u._id} 
                                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors ${
                                    selecteduser?._id === u._id ? 'bg-indigo-100 border border-indigo-300' : ''
                                }`}
                            >
                                <div className="relative">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage
                                            className="w-10 h-10 rounded-full object-cover"
                                            src={u?.profilePicture}
                                        />
                                        <AvatarFallback className="bg-indigo-200 text-indigo-800 font-medium flex items-center justify-center w-10 h-10 rounded-full">
                                            {u.username.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                                    }`}></span>
                                </div>
                                
                                {!isSidebarCollapsed && (
                                    <div className="flex flex-col truncate">
                                        <span className="font-medium text-gray-800">{u?.username}</span>
                                        <span className={`text-xs font-semibold ${
                                            isOnline ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                            {isOnline ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                
                {!isSidebarCollapsed && (
                    <div className="mt-auto pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage
                                    className="w-10 h-10 rounded-full object-cover"
                                    src={user?.profilePicture}
                                />
                                <AvatarFallback className="bg-indigo-200 text-indigo-800 font-medium flex items-center justify-center w-10 h-10 rounded-full">
                                    {user?.username.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-gray-800">{user?.username}</p>
                                <p className="text-xs text-gray-500">Active now</p>
                            </div>
                        </div>
                    </div>
                )}
            </section>
            

            {selecteduser ? (
                 <div className={`relative h-[calc(100vh-2rem)] ml-4 rounded-xl border border-gray-200 flex flex-col bg-white shadow-lg flex-grow transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-[calc(100%-6rem)]' : 'w-[calc(100%-18rem)]'
    }`}>
                    {/* Chat Header */}
                  

                    {/* Messages */}
                    <Messages isOnline={isOnline} selectedUser={selecteduser}/>
                    
                    {/* Message Input */}
                    
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center ml-4 flex-grow bg-white rounded-xl border border-gray-200 shadow-lg'>
                    <div className="bg-indigo-100 p-6 rounded-full mb-6">
                        <MessageCircle size={60} className="text-indigo-600" />
                    </div>
                    <h1 className='font-bold text-2xl text-gray-800 mb-2'>Your Messages</h1>
                    <p className='text-gray-600 max-w-md text-center mb-8'>
                        Select a conversation or start a new chat. Your messages will appear here.
                    </p>
                    <button 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        onClick={() => dispatch(setSelectedUser(suggestedUser[0]))}
                    >
                        Start New Chat
                    </button>
                </div>
            )}
        </div>
    )
}

export default Chatpage;