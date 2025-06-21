import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { setAuthuser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { clearNotification, setNotification } from "@/redux/notificationSlice.js";
// import second from 'first'

function LeftSidebar() {
  const { notifications } = useSelector(store => store.notification);

  const [Open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      // withCredentials: true tells the browser to include cookies and authentication headers with the request.
      const res = await axios.get('http://localhost:8000/api/user/logout', { withCredentials: true });
      if (res.data.success) {
        navigate('/login')
        dispatch(setAuthuser(null));
        toast.success(res.data.msg);
      }
    } catch (err) {
      // console.log(err);
      toast.error(err.response?.data?.msg || "Something went wrong", {
        className: "bg-red-500 text-white p-4 rounded-lg shadow-md", // Tailwind classes
      });
    }
  };
  const sidebarHandler = (type) => {
    console.log(type);
    if (type == "Logout") logoutHandler();
    else if (type == 'Create') setOpen(true);
    else if (type == 'Profile') {
      navigate(`/profile/${user?._id}`);
    }
    else if (type == 'Home') {
      navigate(`Home`);
    }
    else if (type == 'Messages') {
      navigate(`Chat`);
    }

  }
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8 ">


          <AvatarImage
            className="rounded-full bg-gray-500 "
            src={
              user?.profilePicture === 'defaultPhoto.png'
                ? '/defaultPhoto.png'
                : user?.profilePicture
            }
          // alt={user?.username}
          />
          {/* <AvatarFallback>{user?.username}</AvatarFallback> */}
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  const clearNotificationHandler = async () => {
    // console.log("noti cleared");
    dispatch(clearNotification([]));
    try {
      const res = await axios.delete('http://localhost:8000/api/user/noti/delete', {
        withCredentials: true,
      });

      console.log("deleting")
    }
    catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="z-10 left-0 px-4 border-r border-gray-300 w-[20%] h-screen overflow-y-auto">
      <div className="flex flex-col">
        <div className="w-full flex justify-center my-5">
          <img src="src/assets/logo.png" className="w-[70%]" alt="Logo" />
        </div>

        <div>
          {sidebarItems.map((item, index) => {
            const isNotification = item.text === "Notifications";
            const content = (
              <div
                onClick={() => !isNotification && sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-4 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-2"
              >
                {item.icon}
                <span>{item.text}</span>
                {isNotification && notifications.length > 0 && (
                  <Button
                    size={"icon"}
                    className="rounded-full absolute left-5 bottom-6  p-0 w-5 h-5 bg-red-600 font-bold text-white text-xs flex items-center justify-center"
                  >
                    {notifications.length}
                  </Button>
                )}
              </div>
            );

            return isNotification ? (
              <Popover key={index}>
                <PopoverTrigger asChild>{content}</PopoverTrigger>
                <PopoverContent
                  side="right"
                  align="center"
                  className="w-72 max-h-96 overflow-y-auto p-4 z-30 shadow-xl rounded-xl bg-white border border-gray-200">
                  <div className="flex items-center justify-between mb-3 sticky top-0 bg-white z-10">
                    <h1 className="text-lg font-semibold text-gray-800">
                      Notifications
                    </h1>
                    <Button
                      variant="outline"
                      className="h-8 px-3 py-1 text-sm"
                      onClick={clearNotificationHandler}
                    >
                      Clear
                    </Button>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm mt-4">
                      No new Notifications
                    </p>
                  ) : (
                    [...notifications]
                      .reverse()
                      .map((noti) => (
                        <div
                          key={noti.user._id}
                          className="flex items-center gap-3 py-2 border-b last:border-none"
                        >
                          <Avatar>
                            <AvatarImage
                              className="w-10 h-10 border-2 border-green-600 rounded-full"
                              src={noti.user?.profilePicture}
                            />
                          </Avatar>
                          <p className="text-sm text-gray-700 leading-snug">
                            <span className="font-medium">
                              {noti.user?.username}
                            </span>{" "}
                            {noti.type === 'Liked' ? 'Liked your post' :
                              noti.type === 'commented' ? 'commented on your post' : 'started following you'
                            }
                          </p>
                        </div>
                      ))
                  )}
                </PopoverContent>
              </Popover>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
          <CreatePost Open={Open} setOpen={setOpen} />
        </div>
      </div>
    </div>
  );

}

export default LeftSidebar;
