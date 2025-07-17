import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Undo2, Redo2 } from 'lucide-react';

const extensions = [StarterKit];

function Tiptap({ setTitle, setContent, handleSubmit }) {
  const titleEditor = useEditor({
    extensions: [StarterKit.configure({ 
      heading: false,
      codeBlock: false,
      blockquote: false,
      bulletList: false,
      orderedList: false
    })],
    content: '',
  });

  const contentEditor = useEditor({
    extensions,
    content: '',
  });

  useEffect(() => {
    if (!titleEditor) return;
    // console.log(titleEditor.getText());
    titleEditor.on('update', () => setTitle(titleEditor.getText()));
  }, [titleEditor.getHTML()]);

  useEffect(() => {
    if (!contentEditor) return;
    // setContent(contentEditor.getHTML());
    // console.log(contentEditor.getHTML());
    contentEditor.on('update', () => setContent(contentEditor.getHTML()));
  }, [contentEditor.getHTML()]);

  if (!titleEditor || !contentEditor) return null;

  const baseBtn =
    'w-8 h-8 flex items-center justify-center rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div>
      {/* Title Editor */}
      <h1>Title</h1>
      <EditorContent
        editor={titleEditor}
        className="mb-4 border rounded p-2 text-xl font-bold"
      />

      {/* Toolbar */}
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

      {/* Content Editor */}
      <EditorContent
        editor={contentEditor}
        className="
          editor-content border p-2 rounded min-h-[120px]
          [&_pre]:bg-black [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:text-sm
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-1
          [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-1
          [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-2
        "
      />

      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </div>
  );
}

export default Tiptap;
