import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { BubbleMenu } from '@tiptap/react/menus';
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
import { useCallback } from 'react';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { Toggle } from '../ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { ImageUploadDialog, VideoEmbedDialog } from './dialogs';
import { EditorToolbarProps } from './types';

export function EditorToolbar({ editor }: EditorToolbarProps) {
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
          <Separator orientation="vertical" className="mx-1 h-6" />
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
          <Separator orientation="vertical" className="mx-1 h-6" />
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
              if (url) editor.chain().focus().setImage({ src: url }).run();
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
              if (url)
                editor.chain().focus().setYoutubeVideo({ src: url }).run();
            }}
          />
        </Dialog>

        <div className="self-stretch">
          <Separator orientation="vertical" className="mx-1 h-6" />
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
          <Separator orientation="vertical" className="mx-1 h-6" />
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
