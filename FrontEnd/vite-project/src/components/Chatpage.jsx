import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Messages from './Messages';

function Chatpage() {
    const { user, suggestedUser, selecteduser } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const { onlineUsers } = useSelector(store => store.chat);
    useEffect(() => {
        dispatch(setSelectedUser(null));

    }, [])
    const [text, settext] = useState("");
    const textHandler = (e) => {
        const msg = e.target.value.trim();
        if (msg) {
            settext(msg);
        }
        else settext("");
    }

    return (
        <div className="bg-gray-100 h-screen pr-4 py-6 flex w-full ">
            <section className="bg-white shadow border-2 rounded-xl border-gray-300 p-4  h-full w-[25%] flex flex-col">
                <h1 className="text-xl font-bold mb-4 px-2">{user?.username}</h1>
                <hr className="border-gray-300 mb-4" />
                <div className="overflow-y-auto space-y-2 pr-2">
                    {suggestedUser.map((u) => {
                        const isOnline = onlineUsers.includes(u._id);
                        return (
                            <div onClick={() => dispatch(setSelectedUser(u))}
                                key={u._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage
                                        className="w-10 h-10 border-2 border-green-600 rounded-full object-cover"
                                        src={u?.profilePicture}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{u?.username}</span>
                                    <span className={`text-xs font-semibold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                        {isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
            {
                selecteduser ? (
                    <div className=' border-gray-300 border-l-0 relative h-full overflow-y-auto rounded-xl border-2 flex flex-col w-[75%]'>
                        <div className='flex flex-row px-4 py-2 border-b-2 border-gray-600 rounded-xl'>
                            <Avatar className="w-10 h-10 mr-4">
                                <AvatarImage
                                    className="w-10 h-10 border-2 border-green-600 rounded-full object-cover"
                                    src={selecteduser?.profilePicture}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{selecteduser?.username}</span>
                                <span className={`text-xs font-semibold ${onlineUsers.includes(selecteduser._id) ? 'text-green-600' : 'text-red-600'}`}>
                                    {onlineUsers.includes(selecteduser._id) ? 'Online' : 'Offline'}
                                </span>
                            </div>

                        </div>

                        <Messages selectedUser={selecteduser} />

                        <div className='m-3 bottom-0 sticky flex justify-between py-2 pl-4 rounded-full w-auto border-2 b-0'>
                            <input type="text" placeholder='Send a message...'
                                className='outline-none w-full '
                                onChange={(e) => { textHandler(e) }} />
                            {text !== "" && (
                                <button className='w-32 text-blue-500 text-md font-semibold h-full'>Send</button>
                            )}

                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto '>
                        <MessageCircle size={80} />
                        <h1 className='font-semibold text-2xl text-gray-800' >Your messages</h1>
                        <span className='font-semibold text-xl text-gray-600'>Send a message to start a chat.</span>
                    </div>
                )
            }

        </div>
    )
}

export default Chatpage