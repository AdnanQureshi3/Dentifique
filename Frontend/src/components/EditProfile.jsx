import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthuser } from '@/redux/authSlice';
import { readFileAsDataUri } from '@/lib/utils';

function EditProfile() {
  const [Loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const imageRef = useRef();
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender
  });
  const navigate = useNavigate();

  const [ImagePreview, setImagePreview] = useState("");
  const dispatch = useDispatch();
  const fileChangeHandler = async(e) => {

    const file = e.target.files?.[0];
    if (file) {
      // console.log("file updted" , file)
      
      const dataURI = await readFileAsDataUri(file);
      setImagePreview(dataURI)
      setInput({ ...input, profilePhoto: file });
    }
  }
  const genderChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  }

  const editProfile = async () => {
    console.log(input);
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("bio", input.bio);
      formdata.append("gender", input.gender);

      if (input.profilePhoto) {
        formdata.append("profilePhoto", input.profilePhoto);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/profile/edit`,
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );
      if (res.data.success) {
        toast.success(res.data.msg);
        setInput({ ...input, bio: "" })
        dispatch(setAuthuser(res.data.user));
      }

    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
      setTimeout(() =>{
           navigate(`/profile/${user._id}`)
         },1000);
    }
  }
  return (
    <div className='flex w-full pl-10 mx-auto justify-center'>
      <section className='flex flex-col  gap-6 w-[70%] '>
        <h1 className='text-xl font-bold'>Edit Profile</h1>
        <div className='flex items-center justify-between bg-gray-100 w-f rounded-xl p-5 '>

          <div className='flex items-center gap-3 '>

            <Avatar className='w-[15%] aspect-square '>
              <AvatarImage className='object-cover w-full border-2 border-green-700 h-full rounded-full' 
             src={
    user?.profilePicture === 'defaultPhoto.png'
      ? '/defaultPhoto.png'
      : user?.profilePicture
  }
              alt='user' />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>

            <div className='flex flex-col'>
              <h1 className='font-semibold text-lg'>{user?.username}</h1>
              <span className='font-light text-xs text-gray-500'>{user?.bio || 'I am a dev'}</span>
            </div>
          </div>
          <input ref={imageRef} onChange={(e) => fileChangeHandler(e)} type="file" className='hidden' />
          <Button onClick={() => { imageRef?.current.click() }} className={"bg-[#0095f6] h-8 hover:bg-[#0062f6] cursor-pointer "}>Change Photo</Button>
        </div>
        <div className='w-full flex justify-center  items-center'>
          {
          ImagePreview && (
          <div className='w-[30%] aspect-square  flex items-center justify-center'>
            <img
              src={ImagePreview}
              alt="preview"
              className="object-cover w-full border-4 border-green-700 h-full rounded-full"
            />
          </div>)
}
        </div>
          
        <div>
          <h1 className='text-xl font-bold'>Bio</h1>
          <Textarea value={input.bio}

            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className={"focus-visible:ring-transparent  "} name="bio" />
        </div>

        <div>
          <h1 className='text-xl font-bold'>Gender</h1>


          <select
            name="gender"
            onChange={(e) => genderChangeHandler(e.target.value)}
            className="p-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>


        </div>

        <div className='flex justify-end'>
          {
            Loading ? (
              <Button onClick={editProfile} className={"bg-[#0095f6] h-8 hover:bg-[#0062f6] cursor-pointer "}>Please wait</Button>

            ) : (
              <Button onClick={editProfile} className={"bg-[#0095f6] h-8 hover:bg-[#0062f6] cursor-pointer "}>Submit</Button>
            )
          }

        </div>


      </section>
    </div>
  )
}

export default EditProfile