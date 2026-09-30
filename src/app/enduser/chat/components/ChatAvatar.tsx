'use client'

import React from 'react'
import { getAvatarColor, getInitial } from '../types/IChat'

interface ChatAvatarProps {
  userId: string
  name: string
  size?: number
  className?: string
}

export const ChatAvatar: React.FC<ChatAvatarProps> = ({
  userId,
  name,
  size = 40,
  className = '',
}) => {
  const bgColor = getAvatarColor(userId)
  const initial = getInitial(name)

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-semibold shrink-0 select-none shadow-sm ${className}`}
      style={{
        backgroundColor: bgColor,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.round(size * 0.42)}px`,
      }}
    >
      {initial}
    </div>
  )
}
