import axios from 'axios'
import { toast } from 'sonner'

export const FollowHandlerFunc = async (id) => {
  try {
    const res = await axios.get(`http://localhost:8000/api/user/followUnfollow/${id}`, { withCredentials: true })
    if (res.data.success) {
      toast.success(res.data.msg)
      return res.data
    }
  } catch (err) {
    toast.error(err.response?.data?.msg || "Something went wrong")
  }
}
