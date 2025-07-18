
import React, { useRef, useState } from 'react'
import { DialogContent , Dialog, DialogHeader  } from './ui/dialog'
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataUri } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import EmojiSelector from './EmojiSelector';

function CreatePost({Open , setOpen}) {
    const ImageRef = useRef();
    const [File , setFile] = useState("");
    const [Caption , setCaption] = useState("");
    const [ImagePreview , setImagePreview] = useState("");
    const [loading , setloading] = useState(false); 
    const dispatch = useDispatch();
    const {posts} = useSelector(store=>store.post)

    const createPostHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("caption", Caption);

        if (ImagePreview) formData.append("image", File);
        // console.log(formData.get("image"));
        try {
          setloading(true);

          const res = await axios.post(
            'http://localhost:8000/api/post/addpost',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              withCredentials: true
            }
          );
          
          console.log(res)
          if (res.data.success) {
            dispatch(setPosts([res.data.post ,...posts]));
            toast.success(res.data.msg);
          }
          setCaption("");
          setImagePreview("");
          setOpen(false);
        } catch (error) {
          toast.error(error.response?.data?.msg || "Something went wrong");
        } finally {
          setloading(false);
        }
      }
      
    const fileChangeHandler = async(e)=>{

        const file = e.target.files?.[0];
        if(file){
            setFile(file);
            const dataURI = await readFileAsDataUri(file);
            setImagePreview(dataURI)
        }

    }
  return (
    <Dialog open={Open} >

        <DialogContent className={'bg-white'} onInteractOutside={()=>setOpen(false)} >
            <DialogHeader className=' items-center font-semibold '>Create new post</DialogHeader>

            <Textarea value={Caption} onChange={(e)=>setCaption(e.target.value)} className={'focus-visible:ring-transparent border-none '} placeholder="Write a caption..." />

              <EmojiSelector onSelect={(emoji) => setCaption(prev => prev + emoji)} />

            {
                ImagePreview && (
                    <div className='w-full h-64 flex items-center justify-center'>
                      <img
                        src={ImagePreview}
                        alt="preview"
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>)
            }
            <input ref={ImageRef} type="file" onChange={fileChangeHandler} className='hidden' />

            <Button onClick={()=>ImageRef.current.click()} className={'w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] text-white '}   >
                Select from Computer
            </Button>
            {
                ImagePreview && (
                    loading ? (
                        <Button className={'bg-blue-950 text-white font-bold'}>
                            <Loader2 className='mr-2 h-2 animate-spin w-4 font-bold ' />
                            Please wait
                        </Button>
                    ):(
                        <Button type='submit' onClick={createPostHandler} className={'bg-blue-950 text-white font-bold'}>
                            Post
                        </Button>
                    )
                )
            }


        </DialogContent>
    </Dialog>
  )
}

export default CreatePost