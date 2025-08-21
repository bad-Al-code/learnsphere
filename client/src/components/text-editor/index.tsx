'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { editorExtensions } from './extensions';
import { RichTextEditorSkeleton } from './text-editor-skeleton';
import { EditorToolbar } from './toolbar';
import { RichTextEditorProps } from './types';

export function RichTextEditor({
  initialContent = '<p>Start typing here...</p>',
  onChange,
  editable = true,
}: RichTextEditorProps) {
  const [, setForceUpdate] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: initialContent,
    editable,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base min-h-[150px] w-full rounded-md rounded-br-md rounded-bl-md bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      setForceUpdate((prev) => prev + 1);
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, { emitUpdate: false });
    }
  }, [initialContent, editor]);

  if (!editor) {
    return <RichTextEditorSkeleton />;
  }

  return (
    <div className="rounded-md border bg-transparent">
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

const sampleInitialContent = `
  <h2>Welcome to Your Reusable Tiptap Editor!</h2>
  <p>
    This is a demonstration of the <strong>RichTextEditor</strong> component. The content you see here was passed in via the <code>initialContent</code> prop.
  </p>
  <ul>
    <li>You can edit this content in the first editor.</li>
    <li>Your changes will be reflected in real-time in the read-only preview below.</li>
  </ul>
  <p>
    Try adding images, videos, or code blocks!
  </p>
  <image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS46SAdbg4xit4rTe4qzi7h7YErU441bJMk4A&s' alt='cat meme' />
<div data-youtube-video=""><iframe class="rounded-md shadow-xl max-w-full aspect-video" width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" rel="1" src="https://www.youtube-nocookie.com/embed/OqH9RoUNG24" start="0"></iframe></div>
  <pre><code class="language-javascript">console.log("Hello, World!");</code></pre>
`;

export default function TestEditorPage() {
  const [editorContent, setEditorContent] = useState(sampleInitialContent);

  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
  };

  const handleSave = () => {
    console.log('SAVING CONTENT:', editorContent);
    alert('Content has been logged to the console. Press F12 to see it.');
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold">Tiptap Editor Test Page</h1>
      <p className="text-muted-foreground mt-2">
        A comprehensive test of the reusable RichTextEditor component.
      </p>

      <Separator className="my-8" />

      <div>
        <h2 className="text-2xl font-semibold">1. Editable Instance</h2>
        <p className="text-muted-foreground mb-4">
          This is a fully editable instance for creating or updating content.
        </p>
        <RichTextEditor
          initialContent={editorContent}
          onChange={handleContentChange}
          editable={true}
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Save Content</Button>
        </div>
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="text-2xl font-semibold">2. Read-Only Preview</h2>
        <p className="text-muted-foreground mb-4">
          This is a second instance of the same component, but in read-only
          mode. It reflects the changes from the editor above in real-time.
        </p>
        <RichTextEditor
          initialContent={editorContent}
          onChange={() => {}}
          editable={false}
        />
      </div>
    </div>
  );
}

export { RichTextEditorSkeleton };
