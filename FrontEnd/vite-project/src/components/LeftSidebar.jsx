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
                <Avatar className="w-6 h-6 ">
                    <AvatarImage
                        className="rounded-full bg-gray-500"
                        src={user?.profilePicture}
                        alt={user?.username}
                    />
                    <AvatarFallback>{user?.username}</AvatarFallback>
                </Avatar>
            ),
            text: "Profile",
        },
        { icon: <LogOut />, text: "Logout" },
    ];


    return (
        <div className=" z-10 left-0 px-4 border-r border-gray-300 w-[20%] h-screen ">
            <div className="flex flex-col">
                <div className="w-full flex justify-center my-5">
                    <img src="src\assets\logo.png" className="w-[70%]" alt="Logo" />
                </div>

                <div>
                    {sidebarItems.map((item, index) => {
                        return (
                            <div onClick={() => sidebarHandler(item.text)}
                                key={index}
                                className="flex items-center gap-4 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 my-3 "
                            >
                                {item.icon} <span>{item.text}</span>
                                {
                                    (item.text === "Notifications" &&
                                        notifications && notifications.length > 0) &&

                                    (

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    size={'icon'}
                                                    className="rounded-full absolute left-3 bottom-4 p-0 w-10 h-10 bg-black text-white flex items-center justify-center"
                                                >
                                                    {notifications.length}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 p-4 absolute left-10 bottom-0 transform translate-x-1/2 translate-y-1/2 z-30 shadow-lg rounded-xl bg-white">
                                                {notifications.length === 0 ? (
                                                    <p className="text-center text-gray-500">No new Notifications</p>
                                                ) : (
                                                    [...notifications].reverse().map((noti) => (
                                                        <div key={noti.user._id} className="flex items-center gap-3 mb-3">
                                                            <Avatar>
                                                                <AvatarImage
                                                                    className="w-10 h-10 border-2 border-green-600 rounded-full"
                                                                    src={noti.user?.profilePicture}
                                                                />
                                                            </Avatar>
                                                            <p className="text-sm text-gray-800">
                                                                <span className="font-semibold">{noti.user?.username}</span> {noti.type} your post
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </PopoverContent>
                                        </Popover>

                                    )

                                }
                            </div>
                        );
                    })}
                    <CreatePost Open={Open} setOpen={setOpen} />
                </div>
            </div>

        </div>
    );
}

export default LeftSidebar;
