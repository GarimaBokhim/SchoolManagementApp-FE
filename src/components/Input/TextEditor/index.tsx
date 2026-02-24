"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extension-placeholder";
import {Table} from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import RichTextEditor from "./MenuBar";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import Document from '@tiptap/extension-document'
import CodeBlock from "@tiptap/extension-code-block";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Blockquote from "@tiptap/extension-blockquote";
import Superscript from "@tiptap/extension-superscript";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Code from "@tiptap/extension-code";
import { Text as TextExtension } from '@tiptap/extension-text'

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TextEditor = ({  onChange }: RichTextEditorProps) => {


  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      StarterKit,
      TextExtension,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      CodeBlock.configure({
        languageClassPrefix: 'language-',
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: `${
            'bg-gray-100 text-gray-800 border-gray-200'} p-4 rounded-md overflow-x-auto font-mono text-sm border`
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: `list-disc pl-6`,
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: `list-decimal pl-6`,
        },
      }),
      ListItem,
      Underline,
      Subscript,
      Blockquote.configure({
        HTMLAttributes: {
          class: `border-l-4 border-blue-500 pl-4 italic my-4`,
        }
      }),
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: `${ 'text-blue-600 hover:text-blue-500'} cursor-pointer underline`,
        },
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }
            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },

      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Code.configure({
        HTMLAttributes: {
          class: "bg-purple-100 text-gray-800 p-1 rounded font-mono text-sm border border-gray-300 dark:border-gray-700"

        },
      }),
    ],
     immediatelyRender: false,
     onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    content: `<p>Type your text here...</p>`,
  })

  return (
    <div className="w-full border rounded-md">
      <RichTextEditor editor= {editor}/>
      {/* <div className=" overflow-y-auto w-full p-4 editor-content">
        <EditorContent editor={editor} className="prose w-full min-w-0" />
      </div> */}
      <div className={`border rounded-lg p-6 min-h-96 shadow-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 `}>
        <EditorContent editor={editor}className="prose w-full min-w-0"  />
      </div>
    </div>
  );
};

export default TextEditor;
