import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Home, Search, TrendingUp, MessageCircle,
  Heart, PlusSquare, LogOut
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setAuthuser } from "@/redux/authSlice";
import { clearNotification } from "@/redux/notificationSlice";
import { Button } from "./ui/button";
import CreatePost from "./CreatePost.jsx";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@radix-ui/react-popover";

function LeftSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const { notifications } = useSelector(store => store.notification);
  const [Open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/user/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthuser(null));
        navigate('/login');
        toast.success(res.data.msg);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  const handleSidebarClick = (type) => {
    if (type === "Logout") logoutHandler();
    else if (type === "Create") setOpen(true);
    else if (type === "Profile") navigate(`/profile/${user?._id}`);
    else if (type === "Messages") navigate("/chat");
    else navigate("/home");
  };

  const sidebarItems = [
    { icon: <Home size={24} />, text: "Home", show: true },
    { icon: <Search size={24} />, text: "Search", show: true },
    { icon: <MessageCircle size={24} />, text: "Messages", show: !!user },
    { icon: <Heart size={24} />, text: "Notifications", show: !!user },
    { icon: <PlusSquare size={24} />, text: "Create", show: !!user },
    {
      icon: (
        <Avatar className="w-7 h-7">
          <AvatarImage
            className="rounded-full bg-gray-300"
            src={user?.profilePicture === "defaultPhoto.png"
              ? "/defaultPhoto.png"
              : user?.profilePicture}
          />
        </Avatar>
      ),
      text: "Profile",
      show: !!user
    },
    { icon: <LogOut size={24} />, text: "Logout", show: !!user }
  ];

  const clearNotificationHandler = async () => {
    dispatch(clearNotification([]));
    try {
      await axios.delete("http://localhost:8000/api/user/delete/noti", {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
<aside className="fixed top-0 left-0 w-[250px] h-screen bg-white border-r shadow-md z-50 px-4 py-6">
      {/* Top Logo */}
      <div>
        <div className="flex justify-center mb-6">
          <img src="src/assets/logo.png" className="w-24" alt="Logo" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {sidebarItems.map((item, index) => {
            if (!item.show) return null;
            const isNotification = item.text === "Notifications";

            const navItem = (
              <div
                onClick={() => !isNotification && handleSidebarClick(item.text)}
                className="flex items-center gap-4 px-4 py-3 text-sm rounded-lg text-gray-800 font-medium hover:bg-white hover:shadow transition cursor-pointer relative"
              >
                {item.icon}
                <span>{item.text}</span>

                {isNotification && notifications.length > 0 && (
                  <span className="absolute left-6 -top-2 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
            );

            return isNotification ? (
              <Popover key={index}>
                <PopoverTrigger asChild>{navItem}</PopoverTrigger>
                <PopoverContent
                  side="right"
                  align="start"
                  className="w-72 max-h-96 overflow-y-auto p-4 bg-white border rounded-xl shadow-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h1 className="text-sm font-semibold text-gray-800">Notifications</h1>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 py-1 text-xs"
                      onClick={clearNotificationHandler}
                    >
                      Clear
                    </Button>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm mt-2">No new notifications</p>
                  ) : (
                    [...notifications].reverse().map(noti => (
                      <div
                        key={noti.user._id}
                        className="flex items-center gap-3 py-2 border-b last:border-none"
                      >
                        <Avatar>
                          <AvatarImage
                            className="w-9 h-9 border-2 border-green-500 rounded-full"
                            src={noti.user?.profilePicture}
                          />
                        </Avatar>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">{noti.user?.username}</span>{" "}
                          {noti.type === "Liked"
                            ? "liked your post"
                            : noti.type === "commented"
                            ? "commented on your post"
                            : "started following you"}
                        </p>
                      </div>
                    ))
                  )}
                </PopoverContent>
              </Popover>
            ) : (
              <div key={index}>{navItem}</div>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Summary (optional) */}
      {user && (
        <div className="border-t pt-4 flex items-center gap-3">
          <Avatar>
            <AvatarImage
              className="w-10 h-10 rounded-full border border-gray-400"
              src={user?.profilePicture || "/defaultPhoto.png"}
            />
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user.username}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
        </div>
      )}

      <CreatePost Open={Open} setOpen={setOpen} />
    </aside>
  );
}

export default LeftSidebar;
