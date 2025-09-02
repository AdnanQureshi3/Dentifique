import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataUri } from "@/lib/utils";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import EmojiSelector from "./EmojiSelector.jsx";

function CreatePost({ Open, setOpen }) {
  const ImageRef = useRef();
  const [File, setFile] = useState("");
  const [Caption, setCaption] = useState("");
  const [ImagePreview, setImagePreview] = useState("");
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", Caption);

    if (ImagePreview) formData.append("image", File);

    try {
      setloading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/addpost`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
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
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataURI = await readFileAsDataUri(file);
      setImagePreview(dataURI);
    }
  };

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogContent className="bg-white rounded-2xl shadow-2xl overflow-hidden sm:max-w-3xl w-full p-0">
        <DialogHeader className="border-b p-4 text-center">
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Create New Post
          </DialogTitle>
        </DialogHeader>

        {/* Split layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Left Side - Image Upload */}
          <div className="flex items-center justify-center p-4 border-r relative">
            {ImagePreview ? (
              <div className="relative w-full h-72 rounded-xl overflow-hidden">
                <img
                  src={ImagePreview}
                  alt="preview"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");
                    setFile("");
                  }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => ImageRef.current.click()}
                className="w-full h-72 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition"
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload an image</p>
              </div>
            )}
            <input
              ref={ImageRef}
              type="file"
              onChange={fileChangeHandler}
              className="hidden"
            />
          </div>

          {/* Right Side - Caption + Controls */}
          <div className="flex flex-col p-4 space-y-4">
            <Textarea
              value={Caption}
              onChange={(e) => setCaption(e.target.value)}
              className="focus-visible:ring-1 focus-visible:ring-blue-500 resize-none border-gray-300 rounded-lg h-40"
              placeholder="Write your caption..."
            />
            <EmojiSelector
              onSelect={(emoji) => setCaption((prev) => prev + emoji)}
            />

            <div className="mt-auto flex flex-col gap-2">
              { (
                loading ? (
                  <Button
                    disabled
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!ImagePreview}
                    onClick={createPostHandler}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Post
                  </Button>
                )
              )}
              
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
