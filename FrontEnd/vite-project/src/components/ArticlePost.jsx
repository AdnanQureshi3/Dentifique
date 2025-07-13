import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Heading1, Heading2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

function CreateArticle({ Open, setOpen }) {

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const { user } = useSelector(store => store.auth);
  const maxContentLength = 300; // Maximum content length
    const maxTitleLength = 50; // Maximum title length

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

  const applyFormat = (tag) => {
    if (tag === 'bold') setContent(prev => prev + ' <b></b>');
    else if (tag === 'italic') setContent(prev => prev + ' <i></i>');
    else if (tag === 'h1') setContent(prev => prev + ' <h1></h1>');
    else if (tag === 'h2') setContent(prev => prev + ' <h2></h2>');
  };

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
   <DialogContent className='sm:max-w-[600px] bg-white rounded-lg shadow-lg'>

        <h2 className='text-xl font-semibold mb-4'>Write an Article</h2>

        <Input
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='mb-4'
        />

        <div className='flex gap-2 mb-2'>
          <Button size='sm' variant='ghost' onClick={() => applyFormat('bold')}><Bold size={16} /></Button>
          <Button size='sm' variant='ghost' onClick={() => applyFormat('italic')}><Italic size={16} /></Button>
          <Button size='sm' variant='ghost' onClick={() => applyFormat('h1')}><Heading1 size={16} /></Button>
          <Button size='sm' variant='ghost' onClick={() => applyFormat('h2')}><Heading2 size={16} /></Button>
        </div>

        <Textarea
        
          rows={10}
          placeholder='Start writing...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
         className='resize-y max-h-60 overflow-y-auto'
            style={{ whiteSpace: 'pre-wrap' }}
        />

        <div className='flex justify-end mt-4'>
          <Button onClick={handleSubmit} className='bg-blue-600 text-white'>Publish</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateArticle;
