'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { all, createLowlight } from 'lowlight';

import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Strikethrough,
  Video,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Toggle } from '../ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const lowlight = createLowlight(all);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

function VideoEmbedDialog({
  onSetVideo,
}: {
  onSetVideo: (url: string) => void;
}) {
  const [videoUrl, setVideoUrl] = useState('');

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const handleSetVideo = () => {
    if (videoUrl) {
      const embedUrl = getEmbedUrl(videoUrl);
      onSetVideo(embedUrl);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Embed Video</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            placeholder="Paste a YouTube or Vimeo URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSetVideo}>Embed Video</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function ImageUploadDialog({
  onSetImage,
}: {
  onSetImage: (url: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState('');

  const handleSetImage = () => {
    if (imageUrl) {
      onSetImage(imageUrl);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Image</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="image-url">Image URL</Label>
          <Input
            id="image-url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <Separator className="my-2" />
        <div className="grid gap-2">
          <Label htmlFor="upload">Or upload a file</Label>
          <Input id="upload" type="file" disabled />
          <p className="text-muted-foreground text-xs">
            File upload is not implemented in this demo. Please use a URL.
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSetImage}>Set Image</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="bg-background flex flex-wrap items-center gap-1 rounded-tl-md rounded-tr-md border-b p-2">
        <Select
          value={
            editor.isActive('heading', { level: 1 })
              ? 'h1'
              : editor.isActive('heading', { level: 2 })
                ? 'h2'
                : editor.isActive('heading', { level: 3 })
                  ? 'h3'
                  : 'p'
          }
          onValueChange={(value) => {
            if (value === 'p') editor.chain().focus().setParagraph().run();
            if (value === 'h1')
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            if (value === 'h2')
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            if (value === 'h3')
              editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
        >
          <SelectTrigger className="h-9 w-auto">
            <SelectValue placeholder="Block type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">Paragraph</SelectItem>
            <SelectItem value="h1">
              <Heading1 className="inline-block h-5 w-5" /> Heading 1
            </SelectItem>
            <SelectItem value="h2">
              <Heading2 className="inline-block h-5 w-5" /> Heading 2
            </SelectItem>
            <SelectItem value="h3">
              <Heading3 className="inline-block h-5 w-5" /> Heading 3
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="self-stretch">
          <Separator orientation="vertical" className="h-6" />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('bold')}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold (Ctrl+B)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('italic')}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
            >
              <Italic className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic (Ctrl+I)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('strike')}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Strikethrough</TooltipContent>
        </Tooltip>

        <div className="self-stretch">
          <Separator orientation="vertical" className="h-6" />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('bulletList')}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
            >
              <List className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bulleted List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('orderedList')}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Numbered List</TooltipContent>
        </Tooltip>

        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Add Image</TooltipContent>
          </Tooltip>
          <ImageUploadDialog
            onSetImage={(url) => {
              editor.chain().focus().setImage({ src: url }).run();
            }}
          />
        </Dialog>

        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Embed Video</TooltipContent>
          </Tooltip>
          <VideoEmbedDialog
            onSetVideo={(url) => {
              editor.chain().focus().setYoutubeVideo({ src: url }).run();
            }}
          />
        </Dialog>

        <div className="self-stretch">
          <Separator orientation="vertical" className="h-6" />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('codeBlock')}
              onPressedChange={() =>
                editor.chain().focus().toggleCodeBlock().run()
              }
            >
              <Code className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Code Block</TooltipContent>
        </Tooltip>
      </div>

      <BubbleMenu
        editor={editor}
        shouldShow={({ state }) => !state.selection.empty}
        className="bg-background flex items-center gap-1 rounded-md border p-1 shadow-md"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('bold')}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold (Ctrl+B)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('italic')}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
            >
              <Italic className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic (Ctrl+I)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive('strike')}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Strikethrough</TooltipContent>
        </Tooltip>

        <div className="self-stretch">
          <Separator orientation="vertical" className="h-6" />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(editor.isActive('link') ? 'bg-accent' : '')}
              onClick={setLink}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Link (Ctrl+K)</TooltipContent>
        </Tooltip>
      </BubbleMenu>
    </TooltipProvider>
  );
}

interface RichTextEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

export function RichTextEditor({
  initialContent = '<p>Start typing here...</p>',
  onChange,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'rounded-md border border-black/50 shadow-xl',
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        HTMLAttributes: {
          class: 'rounded-md  shadow-xl max-w-full',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          className:
            'cursor-pointer text-blue-500 underline pointer-events-none',
        },
      }),
    ],
    content: `
  <h2>Hi there,</h2>

   <p>
          That's a boring paragraph followed by a fenced code block:
        </p>
        <pre><code class="language-javascript">for (var i=1; i <= 20; i++)
{
  if (i % 15 == 0)
    console.log("FizzBuzz");
  else if (i % 3 == 0)
    console.log("Fizz");
  else if (i % 5 == 0)
    console.log("Buzz");
  else
    console.log(i);
}</code></pre>
        <p>
          Press Command/Ctrl + Enter to leave the fenced code block and continue typing in boring paragraphs.
        </p>
      <p>This is a basic Tiptap editor with the default Starter Kit.</p>
      <ul>
        <li>That means we can do things like <strong>bold text</strong>.</li>
        <li>Or create bullet lists.</li>
      </ul>
      <p>Let's build a beautiful toolbar for this!</p>
<img src="https://i.ytimg.com/vi/OqH9RoUNG24/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBr5mF-7XkKoe-Jsh_MDW4MxHdNXA" alt='Image'/>
 <div data-youtube-video>
    <iframe 
      width="560" 
      height="315" 
      src="https://www.youtube.com/embed/OqH9RoUNG24" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
    `,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base min-h-[150px] w-full rounded-md rounded-br-md rounded-bl-md bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  if (!editor) {
    return <RichTextEditorSkeleton />;
  }

  return (
    <div className="rounded-md border">
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

export function RichTextEditorSkeleton() {
  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export default function TestTextEditor() {
  const [lessonContent, setLessonContent] = useState(
    '<h2>Welcome to your lesson!</h2><p>This content is loaded from the parent page.</p>'
  );

  const handleContentChange = (newContent: string) => {
    setLessonContent(newContent);
  };

  const handleSave = () => {
    console.log('Saving content:', lessonContent);
    alert('Content saved!');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Lesson Editor</h1>
      <RichTextEditor
        initialContent={lessonContent}
        onChange={handleContentChange}
      />

      <div className="mt-4">
        <button
          onClick={handleSave}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Save Lesson
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Read-Only Preview:</h2>
        <RichTextEditor
          initialContent={lessonContent}
          onChange={() => {}}
          editable={false}
        />
      </div>
    </div>
  );
}
