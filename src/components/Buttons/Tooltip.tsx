import React, { ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <div className="relative group inline-block">
      {children}
      <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {content}
      </span>
    </div>
  )
}
