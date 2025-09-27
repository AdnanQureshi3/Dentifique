import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  LayoutDashboard, Search, FolderKanban, FilePlus2,
  Mail, Bell, LogOut, ChevronLeft, ChevronRight, User
} from "lucide-react";
import { useState } from "react";
import { useNavigate  , useLocation} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setAuthuser, setSelectedUser } from "@/redux/authSlice";
import { clearNotification } from "@/redux/notificationSlice";
import { Button } from "./ui/button";
import CreatePost from "./CreatePost.jsx";
import SearchDialog from "./SearchPage";

import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@radix-ui/react-popover";

function LeftSidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const { notifications } = useSelector(store => store.notification);
  const [Open, setOpen] = useState(false);
  const [OpenSearch , setOpenSearch] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/logout`, { withCredentials: true });
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
    else if (type === "Messages"){
      if(location.pathname  === '/chat' ) return;
      dispatch(setSelectedUser(null));
      navigate("/chat");
    } 
    else if (type === "Projects") {
      if(location.pathname  === '/projects' ) return;
      navigate("/project");
    } 
    else if (type === "Search") {
      setOpenSearch(!OpenSearch);
      
    } else navigate("/home");

  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={22} />, text: "Dashboard", show: true },
    { icon: <Search size={22} />, text: "Search", show: true },
    { icon: <FolderKanban size={22} />, text: "Projects", show: !!user },
    { icon: <Mail size={22} />, text: "Messages", show: !!user },
    { icon: <Bell size={22} />, text: "Notifications", show: !!user },
    { icon: <FilePlus2 size={22} />, text: "Create", show: !!user },
    {
      icon: (
        <Avatar className="w-6 h-6">
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
    { icon: <LogOut size={22} />, text: "Logout", show: !!user }
  ];

  const clearNotificationHandler = async () => {
    dispatch(clearNotification([]));
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/noti/delete/`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 ${collapsed ? "w-[80px]" : "w-[240px]"} 
      h-screen bg-gradient-to-b from-gray-50 to-white border-r shadow-sm z-50 px-4 py-6 transition-all duration-300`}
    >
      {/* Collapse Button */}
      <div
        className="absolute top-4 right-[-12px] bg-white border rounded-full shadow p-1 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </div>

      <div className="flex justify-center mb-2">
        {!collapsed && <h1 className="text-lg font-bold text-blue-600">Task Bar</h1>}
      </div>

  
      <nav className="flex flex-col space-y-2">
        {sidebarItems.map((item, index) => {
          if (!item.show) return null;
          const isNotification = item.text === "Notifications";

          const navItem = (
            <div
              onClick={() => !isNotification && handleSidebarClick(item.text)}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer relative"
            >
              {item.icon}
              {!collapsed && <span>{item.text}</span>}

              {isNotification && notifications.length > 0 && (
                <span className="absolute left-5 -top-2 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
          );

          return isNotification ? (
            <Popover key={index}>
              <PopoverTrigger asChild>{navItem}</PopoverTrigger>
              {!collapsed && (
                <PopoverContent
                  side="right"
                  align="start"
                  className="w-72 max-h-96 overflow-y-auto p-4 bg-white border rounded-xl shadow-lg"
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
                            className="w-8 h-8 border-2 border-blue-400 rounded-full"
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
              )}
            </Popover>
          ) : (
            <div key={index}>{navItem}</div>
          );
        })}
      </nav>


      {user && !collapsed && (
        <div className="border-t pt-4 mt-6 flex items-center gap-3">
          <Avatar>
            <AvatarImage
              className="w-8 h-8 rounded-full border border-gray-300"
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
      <SearchDialog open={OpenSearch} onOpenChange={setOpenSearch} />

    </aside>
  );
}

export default LeftSidebar;
