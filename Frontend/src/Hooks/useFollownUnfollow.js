import { setAuthuser, setSuggestedUser } from '@/redux/authSlice';
import axios from 'axios'
import { toast } from 'sonner'



export const FollowHandlerFunc = async (id , dispatch ) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/followUnfollow/${id}`, { withCredentials: true })
    if (res.data.success) {
      toast.success(res.data.msg)
      dispatch(setAuthuser(res.data.user));
      const sugUsers = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/suggested` ,{withCredentials:true} );
      if(sugUsers.data.success){
        
          dispatch(setSuggestedUser(sugUsers.data.users));
          console.log("user updated and sugg users")
          
        }
      
    }
  } catch (err) {
    toast.error(err.response?.data?.msg || "Something went wrong")
  }
}
