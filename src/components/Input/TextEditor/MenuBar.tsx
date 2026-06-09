/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore: allow importing CSS side-effect in TSX without global declaration
import './index.css'
import type { Editor } from '@tiptap/core'

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  PlusCircle,
  PlusSquare,
  MinusCircle,
  MinusSquare,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Undo,
  Redo,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Palette,
  Trash2,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Plus,
  Minus,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { Tooltip } from '@/components/Buttons/Tooltip'

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72]

const RichTextEditor = ({ editor }: { editor: Editor | null }) => {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [tableModalShow, setTableModalShow] = useState(false)

  const themeClasses = 'bg-gray-50 text-gray-900'
  const toolbarClasses = 'bg-white border-gray-200'
  const buttonClasses =
    'bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900'
  const activeButtonClasses = 'border-2 border-blue-400'

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    } catch (e: any) {
      alert(e.message)
    }
  }, [editor])

  const getCurrentFontSize = () => {
    const fontSize = editor?.getAttributes('textStyle')?.fontSize

    if (!fontSize) return 16

    const parsed = parseInt(String(fontSize).replace('px', ''), 10)
    return Number.isNaN(parsed) ? 16 : parsed
  }

  const increaseFontSize = () => {
    const currentSize = getCurrentFontSize()

    const nextSize =
      FONT_SIZES.find((size) => size > currentSize) ||
      Math.min(currentSize + 2, 72)

    editor?.chain().focus().setFontSize(`${nextSize}px`).run()
  }

  const decreaseFontSize = () => {
    const currentSize = getCurrentFontSize()

    const prevSizes = FONT_SIZES.filter((size) => size < currentSize)
    const prevSize =
      prevSizes[prevSizes.length - 1] || Math.max(currentSize - 2, 8)

    editor?.chain().focus().setFontSize(`${prevSize}px`).run()
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value

    if (!size) {
      editor?.chain().focus().unsetFontSize().run()
      return
    }

    editor?.chain().focus().setFontSize(`${size}px`).run()
  }

  if (!editor) {
    return null
  }

  return (
    <div className={`p-6 transition-all duration-300 ${themeClasses}`}>
      <div className={`border rounded-lg p-4 mb-4 shadow-lg ${toolbarClasses}`}>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center space-x-1 mr-4">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${!editor.can().undo() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${!editor.can().redo() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center space-x-1 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('bold') ? activeButtonClasses : ''
                }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('italic') ? activeButtonClasses : ''
                }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('underline') ? activeButtonClasses : ''
                }`}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('strike') ? activeButtonClasses : ''
                }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('highlight') ? activeButtonClasses : ''
                }`}
              title="Highlight Text"
            >
              <Highlighter className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleMark('subscript').run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('subscript') ? activeButtonClasses : ''
                }`}
              title="Subscript"
            >
              <SubscriptIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleMark('superscript').run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('superscript') ? activeButtonClasses : ''
                }`}
              title="Superscript"
            >
              <SuperscriptIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center space-x-1 mr-4">
            <button
              type="button"
              onClick={decreaseFontSize}
              className={`p-2 rounded transition-colors ${buttonClasses}`}
              title="Decrease Font Size"
            >
              <Minus className="w-4 h-4" />
            </button>

            <select
              value={getCurrentFontSize()}
              onChange={handleFontSizeChange}
              className="h-9 px-2 rounded border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              title="Font Size"
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={increaseFontSize}
              className={`p-2 rounded transition-colors ${buttonClasses}`}
              title="Increase Font Size"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center space-x-1 mr-4">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('heading', { level: 1 })
                ? activeButtonClasses
                : ''
                }`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('heading', { level: 2 })
                ? activeButtonClasses
                : ''
                }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('heading', { level: 3 })
                ? activeButtonClasses
                : ''
                }`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('paragraph') ? activeButtonClasses : ''
                }`}
              title="Paragraph"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center space-x-1 mr-4">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive({ textAlign: 'left' })
                ? activeButtonClasses
                : ''
                }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive({ textAlign: 'center' })
                ? activeButtonClasses
                : ''
                }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive({ textAlign: 'right' })
                ? activeButtonClasses
                : ''
                }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setTextAlign('justify').run()
              }
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive({ textAlign: 'justify' })
                ? activeButtonClasses
                : ''
                }`}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center space-x-1 mr-4">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('bulletList') ? activeButtonClasses : ''
                }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('orderedList') ? activeButtonClasses : ''
                }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('blockquote') ? activeButtonClasses : ''
                }`}
              title="Quote Block"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Link / Image */}
          <div className="flex items-center space-x-1 mr-4">
            <button
              type="button"
              onClick={setLink}
              className={`p-2 rounded transition-colors ${buttonClasses} ${editor.isActive('link') ? activeButtonClasses : ''
                }`}
              title="Insert Link (Ctrl+K)"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive('link')}
              className={`p-2 rounded transition-colors ${buttonClasses} ${!editor.isActive('link') ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              title="Remove Link"
            >
              <Unlink className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={addImage}
              className={`p-2 rounded transition-colors ${buttonClasses}`}
              title="Insert Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setTableModalShow(!tableModalShow)}
              className={`p-2 rounded transition-colors ${buttonClasses}`}
              title="Table Options"
            >
              <TableIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().unsetAllMarks().clearNodes().run()
              }
              className={`p-2 rounded transition-colors ${buttonClasses}`}
              title="Clear Formatting"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`p-2 rounded transition-colors ${buttonClasses}`}
              title="Color Options"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showColorPicker && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm font-medium">Text:</span>
                {[
                  '#000000',
                  '#dc2626',
                  '#16a34a',
                  '#2563eb',
                  '#ca8a04',
                  '#9333ea',
                  '#c2410c',
                  '#64748b',
                ].map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={`Text Color: ${color}`}
                  />
                ))}

                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetColor().run()}
                  className={`px-2 py-1 text-xs rounded border border-gray-300 ${buttonClasses}`}
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm font-medium">Highlight:</span>
                {[
                  'transparent',
                  '#fef3c7',
                  '#dcfce7',
                  '#dbeafe',
                  '#fce7f3',
                  '#f3e8ff',
                  '#fed7aa',
                  '#f1f5f9',
                ].map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() =>
                      editor.chain().focus().toggleHighlight({ color }).run()
                    }
                    className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                    style={{
                      backgroundColor:
                        color === 'transparent' ? 'transparent' : color,
                      border:
                        color === 'transparent'
                          ? '2px dashed #9ca3af'
                          : '2px solid #d1d5db',
                    }}
                    title={`Highlight: ${color}`}
                  />
                ))}

                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetHighlight().run()}
                  className={`px-2 py-1 text-xs rounded border border-gray-300 ${buttonClasses}`}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Controls */}
        {tableModalShow && (
          <div className="mt-4 mb-2 border-b border-gray-300 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip content="Insert Table">
                <button
                  type="button"
                  className="p-2 rounded hover:bg-gray-200"
                  onClick={() =>
                    (editor.chain().focus() as any)
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Add column before">
                <button
                  type="button"
                  className={`p-2 rounded transition-colors ${buttonClasses}`}
                  onClick={() => (editor.chain().focus() as any).addColumnBefore().run()}
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Add column after">
                <button
                  type="button"
                  className={`p-2 rounded transition-colors ${buttonClasses}`}
                  onClick={() => (editor.chain().focus() as any).addColumnAfter().run()}
                >
                  <PlusSquare className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Delete column">
                <button
                  type="button"
                  className={`p-2 rounded transition-colors ${buttonClasses}`}
                  onClick={() => (editor.chain().focus() as any).deleteColumn().run()}
                >
                  <MinusSquare className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Add row before">
                <button
                  type="button"
                  className={`p-2 rounded transition-colors ${buttonClasses}`}
                  onClick={() => (editor.chain().focus() as any).addRowBefore().run()}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Add row after">
                <button
                  type="button"
                  className={`p-2 rounded transition-colors ${buttonClasses}`}
                  onClick={() => (editor.chain().focus() as any).addRowAfter().run()}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Delete row">
                <button
                  type="button"
                  className={`p-2 rounded transition-colors ${buttonClasses}`}
                  onClick={() => (editor.chain().focus() as any).deleteRow().run()}
                >
                  <MinusCircle className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Delete table">
                <button
                  type="button"
                  className={`p-2 rounded transition-colors ${buttonClasses}`}
                  onClick={() => (editor.chain().focus() as any).deleteTable().run()}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Go to next cell">
                <button
                  type="button"
                  className={`p-2 rounded transition-colors ${buttonClasses}`}
                  onClick={() => (editor.chain().focus() as any).goToNextCell().run()}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Go to previous cell">
                <button
                  type="button"
                  className={`p-2 rounded transition-colors ${buttonClasses}`}
                  onClick={() =>
                    (editor.chain().focus() as any).goToPreviousCell().run()
                  }
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1 p-1 rounded shadow-lg bg-white">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${buttonClasses} ${editor.isActive('bold') ? 'bg-blue-500 text-white' : ''
            }`}
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${buttonClasses} ${editor.isActive('italic') ? 'bg-blue-500 text-white' : ''
            }`}
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded ${buttonClasses} ${editor.isActive('underline') ? 'bg-blue-500 text-white' : ''
            }`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={setLink}
          className={`p-1 rounded ${buttonClasses} ${editor.isActive('link') ? 'bg-blue-500 text-white' : ''
            }`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={decreaseFontSize}
          className={`p-1 rounded ${buttonClasses}`}
          title="Decrease Font Size"
        >
          <Minus className="w-4 h-4" />
        </button>

        <select
          value={getCurrentFontSize()}
          onChange={handleFontSizeChange}
          className="h-8 px-2 rounded border border-gray-300 bg-white text-xs text-gray-700 focus:outline-none"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={increaseFontSize}
          className={`p-1 rounded ${buttonClasses}`}
          title="Increase Font Size"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default RichTextEditor