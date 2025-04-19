import Signup from './components/Signup'
import Login from './components/Login'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Mainlayout from './components/Mainlayout'
import Home  from './components/Home'
import Profile from './components/Profile'

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
        path: '/profile',
        element: <Profile />
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
