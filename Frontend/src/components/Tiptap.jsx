import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Undo2, Redo2, Loader2 } from 'lucide-react';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import parse from 'html-react-parser';
import EmojiSelector from './EmojiSelector.jsx';
import axios from 'axios';

const extensions = [
    StarterKit,
    Underline,
    Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
    }),
    CharacterCount.configure({
        limit: 3000,
    }),
    Placeholder.configure({
        placeholder: 'Write your content here...',
    }),
];


function Tiptap({ setTitle, title, setContent, handleSubmit, content }) {
    const [loadingforPublish, setloadingforPublish] = useState(false);
    const [loaderforAI, setloaderforAI] = useState(false);

    const contentEditor = useEditor({
        extensions,
        content: '',
    });

    const maxTitleLength = 60;
    const maxContentLength = 2000;


    useEffect(() => {
        if (!contentEditor) return;
        const updateHandler = () => setContent(contentEditor.getHTML());
        contentEditor.on('update', updateHandler);
        return () => contentEditor.off('update', updateHandler);
    }, [contentEditor]);


    if (!contentEditor) return null;

    const baseBtn =
        'w-8 h-8 flex items-center justify-center rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed';

    const EnhancedText = async () => {
        setloaderforAI(true);
       
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/enhancedText`, { text: content },
                { withCredentials: true });
            const enhancedText = res.data.result.response.candidates[0].content.parts[0].text;
            console.log(enhancedText);

            if (contentEditor && contentEditor.commands) {
                contentEditor.chain().clearContent().insertContent(enhancedText).run();
            }

        }
        catch (error) {
            console.log(error);

        }
        finally {
            setloaderforAI(false);
        }

    }

    return (
        <div>
            {/* Title Editor */}



            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => contentEditor.chain().focus().toggleBold().run()}
                    disabled={!contentEditor.can().chain().focus().toggleBold().run()}
                    className={`${baseBtn} ${contentEditor.isActive('bold') ? 'bg-gray-400' : 'bg-gray-200'}`}
                >
                    <strong>B</strong>
                </button>

                <button
                    onClick={() => contentEditor.chain().focus().toggleItalic().run()}
                    disabled={!contentEditor.can().chain().focus().toggleItalic().run()}
                    className={`${baseBtn} italic ${contentEditor.isActive('italic') ? 'bg-gray-400' : 'bg-gray-200'}`}
                >
                    I
                </button>

                <button
                    onClick={() => contentEditor.chain().focus().toggleStrike().run()}
                    disabled={!contentEditor.can().chain().focus().toggleStrike().run()}
                    className={`${baseBtn} line-through ${contentEditor.isActive('strike') ? 'bg-gray-400' : 'bg-gray-200'}`}
                >
                    S
                </button>
                <button onClick={() => contentEditor?.chain().focus().toggleUnderline().run()}
                    disabled={!contentEditor.can().chain().focus().toggleUnderline().run()}
                    className={`${baseBtn} underline ${contentEditor.isActive('underline') ? 'bg-gray-400' : 'bg-gray-200'}`}
                >
                    U
                </button>

                <button
                    onClick={() => {
                        const url = prompt('Enter URL');
                        if (url) contentEditor?.chain().focus().setLink({ href: url }).run();
                    }}
                >
                    Link
                </button>


                <button
                    onClick={() => contentEditor.chain().focus().toggleCode().run()}
                    disabled={!contentEditor.can().chain().focus().toggleCode().run()}
                    className={`${baseBtn} font-mono ${contentEditor.isActive('code') ? 'bg-gray-300' : 'bg-gray-100'}`}
                >
                    {'</>'}
                </button>

                <button
                    onClick={() => contentEditor.chain().focus().setParagraph().run()}
                    className={`${baseBtn} ${contentEditor.isActive('paragraph') ? 'bg-gray-400' : 'bg-gray-200'}`}
                >
                    P
                </button>

                {[1, 2, 3].map(level => (
                    <button
                        key={level}
                        onClick={() => contentEditor.chain().focus().toggleHeading({ level }).run()}
                        className={`${baseBtn} ${contentEditor.isActive('heading', { level }) ? 'bg-gray-400' : 'bg-gray-200'}`}
                    >
                        H{level}
                    </button>
                ))}

                <button
                    onClick={() => contentEditor.chain().focus().toggleBulletList().run()}
                    className={`${baseBtn} ${contentEditor.isActive('bulletList') ? 'bg-gray-400' : 'bg-gray-200'}`}
                >
                    •
                </button>

                <button
                    onClick={() => contentEditor.chain().focus().toggleCodeBlock().run()}
                    className={`${baseBtn} ${contentEditor.isActive('codeBlock') ? 'bg-gray-400' : 'bg-gray-200'}`}
                >
                    {'{ }'}
                </button>

                <button
                    onClick={() => contentEditor.chain().focus().undo().run()}
                    disabled={!contentEditor.can().chain().focus().undo().run()}
                    className={`${baseBtn} bg-gray-200`}
                >
                    <Undo2 size={16} />
                </button>

                <button
                    onClick={() => contentEditor.chain().focus().redo().run()}
                    disabled={!contentEditor.can().chain().focus().redo().run()}
                    className={`${baseBtn} bg-gray-200`}
                >
                    <Redo2 size={16} />
                </button>
            </div>


            <div className='flex justify-start'>

                <input type="text"
                    placeholder='Enter title here...'
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-[80%] p-2 mb-4 text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-800"
                    value={title}
                />
                <span className={`text-xs w-10 m-3 text-center items-center font-semibold ${title.length <= maxTitleLength ? 'text-black' : 'text-red-500'} `}>
                    {title.length} / {maxTitleLength}
                </span>
            </div>


            {/* Toolbar */}


            {/* Content Editor */}
            <EmojiSelector className="absolute bottom-0 left-0 z-10" onSelect={(emoji) => {
                contentEditor.chain().focus().insertContent(emoji).run();
            }} />

            <div className="w-full max-w-full overflow-x-hidden">

                <EditorContent
                    editor={contentEditor}
                    className={`
                        break-normal whitespace-pre-wrap px-1
                        w-full
                        editor-content border p-2 rounded min-h-[120px] max-h-[300px] overflow-y-auto
                        [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-black [&_pre]:text-white
                        [&_pre]:w-[400px] [&_pre]:mx-auto [&_pre]:p-3 [&_pre]:rounded-md
                        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2
                        [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-1
                        [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-1
                        [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-2 [&_p]:min-h-[30px]
                        outline-none focus:ring-2 focus:ring-blue-500
                        text-gray-800
                        [&_a]:text-blue-600 [&_a]:underline
                    
                    `}
                />
<button
  onClick={EnhancedText}
  disabled={loaderforAI || content.length < 10}
  className={`
    group
    h-12
    font-semibold
    text-white
    transition-all
    duration-300
    shadow-md
    flex rounded-full
    items-center
    justify-center
    overflow-hidden
    ${loaderforAI
      ? 'px-4 rounded-xl bg-gray-400 cursor-not-allowed'
      : 'w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:w-[200px] hover:px-4 hover:rounded-full hover:from-indigo-600 hover:to-purple-500 cursor-pointer'}
  `}
>
  {loaderforAI ? (
    <>
      <Loader2 className="animate-spin h-4 w-4 mr-2" />
      Enhancing...
    </>
  ) : (
    <>
      <span className='group-hover:hidden '>✨AI</span>
      <span className="whitespace-nowrap pl-2 opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all rounded-full duration-300">
        ✨Enhance it by AI
      </span>
    </>
  )}
</button>


              





            </div>



            <div className='flex justify-end'>
                {loadingforPublish === true ? (
                    <button className="mt-4 px-4 py-2   bg-blue-500 text-white rounded">
                        <Loader2 className='mr-2 h-2 animate-spin w-4 font-bold ' />
                        Please wait
                    </button>

                ) : (

                    <button onClick={handleSubmit} className="mt-4 px-4 py-2   bg-blue-500 text-white rounded">
                        Publish
                    </button>
                )}
            </div>
        </div>
    );
}

export default Tiptap;
