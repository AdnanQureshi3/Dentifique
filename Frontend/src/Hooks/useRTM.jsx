import React, { useEffect } from 'react'
import { setChatmessages } from '@/redux/chatSlice'
import { useDispatch, useSelector } from 'react-redux'

function useRTM() {
    const { ChatMessages } = useSelector(store => store.chat);
    const { socket } = useSelector(store => store.socketio);
    const { user , selecteduser } = useSelector(store => store.auth);

    const dispatch = useDispatch();

    useEffect(()=>{
        socket?.on('newMessage' , (newMessage)=>{
            if(selecteduser && newMessage.senderId === selecteduser._id)  // Ignore messages sent by the current user
               
            dispatch(setChatmessages([...ChatMessages , newMessage]));
        })

        return ()=>{
            socket?.off('newMessage');
        }
    } , [setChatmessages , ChatMessages])
   
}

export default useRTM