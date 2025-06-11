import Signup from './components/Signup'
import Login from './components/Login'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Mainlayout from './components/Mainlayout'
import Home  from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Chatpage from './components/Chatpage'

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

  return (
   <>
   
    <RouterProvider router= {browserRouter}/>
   
   </>
  )
}

export default App
