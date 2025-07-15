import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Heading1, Heading2, Link2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const emojis = ['😀', '😂', '😍', '🔥', '👍', '🤔', '🎉', '😢', '👏', '💡'];

function CreateArticle({ Open, setOpen }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const { user } = useSelector(store => store.auth);
  const maxContentLength = 1000;
  const maxTitleLength = 50;

  const handleSubmit = async () => {
    if (!content.trim() || !title.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/api/post/addarticle',
        { content, title, userId: user._id },
        { withCredentials: true }
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
    const tags = {
      bold: '<b></b>',
      italic: '<i></i>',
      h1: '<h1></h1>',
      h2: '<h2></h2>',
      link: '<a href="add a link here">LINK</a>',
    };
    setContent(prev => prev + ' ' + tags[tag]);
  };

  const insertEmoji = (emoji) => setContent(prev => prev + emoji);

  return (
    <Dialog open={Open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[600px] bg-white rounded-lg shadow-lg'>

        <h2 className='text-xl font-semibold'>Write an Article</h2>

        <div className='relative'>
          <Input
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <span className={`absolute bottom-2 right-2 text-xs ${title.length > maxTitleLength ? 'text-red-500' : 'text-gray-500'}`}>
            {title.length}/{maxTitleLength}
          </span>
        </div>

        <div className='flex flex-wrap gap-2 mt-2'>
          <Button size='sm' variant='ghost' onClick={() => applyFormat('bold')}><Bold size={16} /></Button>
          <Button size='sm' variant='ghost' onClick={() => applyFormat('italic')}><Italic size={16} /></Button>
          <Button size='sm' variant='ghost' onClick={() => applyFormat('h1')}><Heading1 size={16} /></Button>
          <Button size='sm' variant='ghost' onClick={() => applyFormat('h2')}><Heading2 size={16} /></Button>
          <Button size='sm' variant='ghost' onClick={() => applyFormat('link')}><Link2 size={16} /></Button>
          {emojis.map((e, i) => (
            <Button key={i} size='sm' variant='ghost' onClick={() => insertEmoji(e)}>{e}</Button>
          ))}
        </div>

        <div className='relative mt-2'>
         
 
          <Textarea
            rows={10}
            placeholder='Start writing...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='resize-y max-h-60 overflow-y-auto'
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          />
          <span className={`absolute bottom-1 right-2 text-xs ${content.length > maxContentLength ? 'text-red-500' : 'text-gray-500'}`}>
            {content.length}/{maxContentLength}
          </span>
        </div>

        <div className='flex justify-end mt-3'>
          <Button
            onClick={handleSubmit}
            disabled={content.length > maxContentLength || title.length > maxTitleLength}
            className='bg-blue-600 cursor-pointer text-white'
          >
            Publish
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

export default CreateArticle;
