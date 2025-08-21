import type { Editor } from '@tiptap/react';

/**
 * Props for the main RichTextEditor component.
 * This is the primary interface for using the editor in your application.
 */
export interface RichTextEditorProps {
  /** The initial HTML content to load into the editor. */
  initialContent?: string;
  /** A callback function that is triggered on every content change. */
  onChange: (html: string) => void;
  /** Determines if the editor is in an editable state or read-only. */
  editable?: boolean;
}

/**
 * Props for the EditorToolbar and its sub-components.
 * It requires a Tiptap editor instance to function.
 */
export interface EditorToolbarProps {
  editor: Editor | null;
}

/**
 * Props for the ImageUploadDialog component.
 */
export interface ImageUploadDialogProps {
  onSetImage: (url: string) => void;
}

/**
 * Props for the VideoEmbedDialog component.
 */
export interface VideoEmbedDialogProps {
  onSetVideo: (url: string) => void;
}
