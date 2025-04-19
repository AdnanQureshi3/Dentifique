import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';

function CommentDialog({ Open, setOpen }) {

    const [text , setText] = useState("");
    const ChangeEventHandler =(e)=>{
        const text = e.target.value;
        if(text.trim()){
            setText(text);
        }
        else setText("");
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            postCommentHandler();
        }
    };

    const postCommentHandler = async()=>{
        alert(text);
        

    }
    return (
        <Dialog open={Open}>
            <DialogContent
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[70%] md:w-[60%] max-w-4xl p-0 h-[85vh] bg-white rounded-lg shadow-lg z-50 overflow-hidden"
                onInteractOutside={() => setOpen(false)} >
                <div className='flex flex-1 h-full'>

                    {/* Image Section */}
                    <div className='w-[45%]  bg-gray-100'>
                        <img
                            src="https://images.unsplash.com/photo-1733506903133-9d65b66d299a?w=600&auto=format"
                            alt="post"
                            className=' absolute w-[45%] top-1/2 -translate-y-1/2 transform  object-cover rounded-lg '
                        />
                    </div>

                    {/* Content Section */}
                    <div className='w-full sm:w-[55%] p-4 flex flex-col justify-between'>
                        <div className='flex items-center justify-between border-b-[1px] pb-2 border-gray-6 00 '>
                            <div className='flex items-center gap-3'>
                                <Link>
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src="" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-sm text-gray-800 hover:text-blue-500 transition duration-200 ease-in'>
                                        username
                                    </Link>
                                    <p className='text-xs text-gray-500 mt-1'>Just now</p>
                                </div>
                            </div>

                            {/* More Options Dialog */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-800 transition duration-200 relative z-10" />
                                </DialogTrigger>
                                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2 p-0 text-sm text-center bg-white border-0 rounded-lg shadow-lg">
                                    <Button className="w-full py-4 bg-gray-800 text-[#ED4956] rounded-none hover:bg-red-600">
                                        Unfollow
                                    </Button>
                                    <Button className="w-full py-4 bg-gray-800 text-white rounded-none hover:bg-gray-700">
                                        Add to favorites
                                    </Button>
                                    <Button className="w-full py-4 bg-gray-800 text-white rounded-none hover:bg-gray-700">
                                        Cancel
                                    </Button>
                                </DialogContent>
                            </Dialog>
                            
                        
                        </div>

                        {/* Comments Section */}
                        {/* <hr />  */}

                        <div className='mt-4 flex flex-col gap-3'>
                            <div className='flex items-center gap-3'>
                                <p className='text-sm text-gray-800 font-medium'>
                                    Comment goes here...
                                </p>
                            </div>
                            <div className='mt-4 flex items-center gap-2'>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    onChange={ChangeEventHandler}
                                    value={text}
                                    onKeyDown={handleKeyPress}
                                    className="w-full p-2 text-sm text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Button onClick = {postCommentHandler}
                                 disabled = {!text}
                                 onKeyPress={handleKeyPress}
                                 variant={'outline'} 
                                 className={ 'cursor-pointer '} >Post</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CommentDialog;
