import Signup from './components/Signup'
import Login from './components/Login'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Mainlayout from './components/Mainlayout'
import Home  from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Chatpage from './components/Chatpage'
import { useDispatch, useSelector } from 'react-redux'
import { io } from "socket.io-client";
import { useEffect } from 'react'
import { setSocket } from './redux/socketSLice'
import { setOnlineUsers } from './redux/chatSlice'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/profile/:id',
        element: <Profile />
      },{
        path:'/account/edit',
        element: <EditProfile/>
      },{
        path:'/chat',
        element: <Chatpage/>
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
  }
])


function App() {
  const {user} = useSelector(store => store.auth);
  const dispatch = useDispatch();
  let socketio;

  useEffect(()=>{
    if(user){
      socketio = io('http://localhost:8000' , {
        query:{
          userId:user?._id
        },
        transports:['websocket']
      });
      
    
      
      dispatch(setSocket(socketio));
  
      
      // on means “Listen for an event.”
      socketio.on('getOnlineUsers' , (Onlineusers) =>{
        console.log(Onlineusers)
        dispatch(setOnlineUsers(Onlineusers));
      })
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
