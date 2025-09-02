import Signup from './components/Signup'
import Login from './components/Login'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Mainlayout from './components/Mainlayout'
import Home  from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Chatpage from './components/Chatpage'
import Projects from './components/Projects'
import { useDispatch, useSelector } from 'react-redux'
import { io } from "socket.io-client";
import { useEffect } from 'react'
import { setSocket } from './redux/socketSLice'
import { setOnlineUsers } from './redux/chatSlice'
import { setNotification } from './redux/notificationSlice.js'
import { setChatmessages } from './redux/chatSlice'
import { getAllNoti } from './Hooks/getAllNoti'
import Protected_routes from './components/ui/protected_routes'
import Verification from './components/Verification'


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Protected_routes><Mainlayout /></Protected_routes> ,
    children: [
      {
        path: '/home',
        element: <Protected_routes> <Home /></Protected_routes> 
      },
      {
        path: '/profile/:id',
        element:<Protected_routes><Profile/></Protected_routes> 
      },{
        path:'/account/edit',
        element: <Protected_routes><EditProfile/></Protected_routes> 
      },{
        path:'/chat',
        element:<Protected_routes><Chatpage/></Protected_routes> 
      }
      ,{
        path:'/projects',
        element:<Protected_routes><Projects/></Protected_routes> 
      }
     
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/verify',
    element: <Verification />
  }
])


function App() {
  const {user} = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const {notification }= useSelector(state => state.notification);
  const { ChatMessages } = useSelector(store => store.chat);
  let socketio;
  
  
  useEffect(()=>{
    
    
    getAllNoti(dispatch);
    
    if(user){
      socketio = io('https://upchain-tvvm.onrender.com' , {
        query:{
          userId:user?._id
        },
        transports:['websocket']
      });
      
      dispatch(setSocket(socketio))
      // on means “Listen for an event.”
      
      socketio.on('getOnlineUsers' , (Onlineusers) =>{
      
        dispatch(setOnlineUsers(Onlineusers));
      })

      socketio.on('notification', (data) => {
        // dispatch(setNotification([...noti , notification]))
        dispatch(setNotification(data))
      });


      return ()=>{
        // works when u leavce this page 
        socketio.close();
        dispatch(setSocket(null))
        dispatch(setOnlineUsers([]));
      }
    }
    else{
      if(socketio)
        socketio.close();
      dispatch(setOnlineUsers([]));
        dispatch(setSocket(null))
    }
  }, [user , dispatch])

  return (
   <>
   
    <RouterProvider router= {browserRouter}/>
   
   </>
  )
}

export default App