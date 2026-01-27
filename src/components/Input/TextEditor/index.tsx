"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import {Table} from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import RichTextEditor from "./MenuBar";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Highlight,

      Placeholder.configure({
        placeholder: "Start typing here...",
      }),

      CharacterCount,

      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],

    content,
  immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);

      const wordCount = editor.storage.characterCount.words();
      const charCount = editor.storage.characterCount.characters();

      console.log("Words:", wordCount, "Characters:", charCount);
    },
  });

  return (
    <div className="w-full border rounded-md">
      <RichTextEditor/>
      <div className=" overflow-y-auto w-full p-4 editor-content">
        <EditorContent editor={editor} className="prose w-full min-w-0" />
      </div>
    </div>
  );
};

export default TextEditor;
