import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Heading1, Heading2, Link2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import Tiptap from './Tiptap';
import EmojiSelector from './EmojiSelector';

function CreateArticle({ Open, setOpen }) {

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const { user } = useSelector(store => store.auth);
  const maxContentLength = 1000; // Maximum content length
    const maxTitleLength = 50; // Maximum title length
    let titlesize = 0, contentSize = 0;

  const handleSubmit = async () => {
    if (!content.trim() || !title.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/api/post/addarticle',
        {
          content,
          title,
          userId: user._id
        },
        {
          withCredentials: true
        }
      );

      if (res.data.success) {
        toast.success("Article posted successfully");
        setOpen(false);
        setContent('');
        setTitle('');
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to post article');
    }
  };


  return (
    <Dialog open={Open} onOpenChange={setOpen}>
   <DialogContent className="sm:max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-4">
  <h2 className="text-xl font-semibold text-gray-800">Create New Article</h2>
  
  <Tiptap setTitle={setTitle} content = {content} title={title} setContent={setContent} handleSubmit={handleSubmit} />

</DialogContent>

    </Dialog>
  );
}

export default CreateArticle;
