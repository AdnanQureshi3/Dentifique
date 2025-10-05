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
    gender: user?.gender,
    
  });
  const [links , setLinks] = useState(user?.links ? user?.links.split(',') : []);
  const [newLink , setNewLink] = useState('');
  const navigate = useNavigate();

  const [ImagePreview, setImagePreview] = useState("");
  const dispatch = useDispatch();

  const fileChangeHandler = async(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataURI = await readFileAsDataUri(file);
      setImagePreview(dataURI);
      setInput({ ...input, profilePhoto: file });
    }
  }

  const genderChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  }

  const editProfile = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("bio", input.bio);
      formdata.append("gender", input.gender);
      formdata.append("links", links);
      console.log(formdata);
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
        setInput({ ...input, bio: "" });
        dispatch(setAuthuser(res.data.user));
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);

      setTimeout(() => {
        navigate(`/profile/${user._id}`);
      }, 1000);
    }
  }

  return (
    <div className="flex justify-center p-6 bg-gray-50 min-h-screen">
      <section className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Edit Profile</h1>

        <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={user?.profilePicture === 'defaultPhoto.png' ? '/defaultPhoto.png' : user?.profilePicture}
              alt="user"
              className="object-cover w-full h-full rounded-full border-2 border-blue-500"
            />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{user?.username}</h2>
            <p className="text-sm text-gray-500">{user?.bio || "I am a dev"}</p>
          </div>
          <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" />
          <Button onClick={() => imageRef.current.click()} className="ml-auto bg-blue-600 hover:bg-blue-700 text-white h-10">
            Change Photo
          </Button>
        </div>

        {ImagePreview && (
          <div className="flex justify-center">
            <img src={ImagePreview} alt="preview" className="w-32 h-32 object-cover rounded-full border-4 border-blue-500" />
          </div>
        )}

        <div>
          <label className="block text-lg font-medium mb-2">Bio</label>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Write something about yourself..."
          />
        </div>
       <div className="space-y-4">
  <label className="block text-lg font-semibold text-gray-700">
    Links (max 3)
  </label>

  {links.length > 0 && (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg shadow-sm"
        >
          <a
            href={link.startsWith("http") ? link : `https://${link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all text-sm"
          >
            {link}
          </a>
          <button
            onClick={() => {
              setLinks(links.filter((l, i) => i !== index));
            }}
            className="ml-3 text-red-500 hover:text-red-700 font-bold px-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}

  <div className="flex gap-2">
    <input
      type="text"
      value={newLink}
      onChange={(e) => setNewLink(e.target.value)}
      placeholder="Enter a link..."
      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      
    />
    <button
      onClick={() => {
        if (newLink.trim() && links.length < 3) {
          setLinks([...links, newLink.trim()]);
          setNewLink("");
        }
      }}
      disabled={links.length >= 3}
      className={`px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm ${
        links.length >= 3
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Add
    </button>
  </div>

  {links.length >= 3 && (
    <p className="text-red-500 text-sm font-medium">
      You can only add up to 3 links.
    </p>
  )}
</div>


        <div>
          <label className="block text-lg font-medium mb-2">Gender</label>
          <select
            name="gender"
            value={input.gender}
            onChange={(e) => genderChangeHandler(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
           
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={editProfile}
            className={`bg-blue-600 cursor-pointer hover:bg-blue-700 text-white h-10 ${Loading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={Loading}
          >
            {Loading ? "Please wait..." : "Submit"}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
