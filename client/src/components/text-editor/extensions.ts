import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import StarterKit from '@tiptap/starter-kit';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github-dark.css';
import { all, createLowlight } from 'lowlight';

const lowlight = createLowlight(all);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

export const editorExtensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
  }),
  Heading.configure({
    levels: [1, 2, 3],
  }),
  Image.configure({
    inline: false,
    HTMLAttributes: {
      class: 'w-full rounded-md border border-black/50 shadow-xl object-cover',
    },
  }),
  Youtube.configure({
    controls: false,
    nocookie: true,
    HTMLAttributes: {
      class: 'rounded-md shadow-xl max-w-full aspect-video',
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
];
