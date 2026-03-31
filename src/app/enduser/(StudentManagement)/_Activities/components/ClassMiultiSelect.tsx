'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { IClass } from '../types/IActivities'

interface Props {
  classes: IClass[]
  selected: IClass[]
  onChange: (selected: IClass[]) => void
  isLoading?: boolean
  error?: string
}

const ClassMultiSelect = ({ classes, selected, onChange, isLoading, error }: Props) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.find((s) => s.id === cls.id)
  )

  const handleSelect = (cls: IClass) => {
    onChange([...selected, cls])
    setSearch('')
    inputRef.current?.focus()
  }

  const handleRemove = (id: string) => {
    onChange(selected.filter((s) => s.id !== id))
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Tag input box */}
      <div
        onClick={() => {
          setOpen(true)
          inputRef.current?.focus()
        }}
        className={`min-h-[40px] w-full px-3 py-1.5 flex flex-wrap items-center gap-1.5 rounded-lg border cursor-text
          bg-white dark:bg-[#2a2a2a] transition
          ${error
            ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-400'
            : 'border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-emerald-500'
          }`}
      >
        {/* Selected class tags */}
        {selected.map((cls, idx) => (
          <span key={cls.id} className="flex items-center gap-1">
            <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-medium px-2 py-0.5 rounded-md">
              {cls.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(cls.id)
                }}
                className="hover:text-red-500 transition-colors"
              >
                <X size={10} />
              </button>
            </span>
            {/* Comma separator between tags */}
            {idx < selected.length - 1 && (
              <span className="text-gray-400 text-xs select-none">,</span>
            )}
          </span>
        ))}

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? (isLoading ? 'Loading classes...' : 'Select classes...') : ''}
          disabled={isLoading}
          className="flex-1 min-w-[100px] text-sm bg-transparent text-gray-800 dark:text-gray-200 outline-none placeholder-gray-400 py-0.5"
        />

        {/* Chevron */}
        <ChevronDown
          size={14}
          className={`text-gray-400 ml-auto shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-400 italic">Loading...</div>
          ) : filteredClasses.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400 italic">
              {search ? 'No matching classes' : 'All classes selected'}
            </div>
          ) : (
            filteredClasses.map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => handleSelect(cls)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200
                           hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
              >
                {cls.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ClassMultiSelect