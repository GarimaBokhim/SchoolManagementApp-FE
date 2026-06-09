'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'

import StarterKit from '@tiptap/starter-kit'

import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'

import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'

import MenuBar from './MenuBar'

interface TextEditorProps {
  content?: string
  onChange?: (html: string) => void
}

const TextEditor = ({ content = '', onChange }: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,

      // inline styling system
      TextStyle,
      Color,

      Underline,
      Highlight,

      Link.configure({
        openOnClick: false,
        autolink: true,
      }),

      Image,

      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],

    // initial content (only used once)
    content: '',

    editorProps: {
      attributes: {
        class:
          'min-h-[250px] border border-gray-300 rounded-b-md p-4 focus:outline-none prose max-w-none',
      },
    },

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  /**
   * ✅ SAFE external sync (API / form reset / load content)
   */
  useEffect(() => {
    if (!editor) return

    const incoming = content || ''
    const current = editor.getHTML()

    if (incoming !== current) {
      editor.commands.setContent(incoming, {
        emitUpdate: false,
      })
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default TextEditor