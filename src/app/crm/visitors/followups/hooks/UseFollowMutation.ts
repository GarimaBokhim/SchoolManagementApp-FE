// src/app/crm/applications/followups/hooks/useFollowUpMutations.ts

import { useState } from 'react'
import { api } from '@/utils/instance'
import toast from 'react-hot-toast'
import { AddFollowUpPayload } from '../types/IFollowUps'

export const useFollowUpMutations = (fetchFollowUps: () => void) => {
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async (payload: AddFollowUpPayload): Promise<boolean> => {
    setIsAdding(true)
    try {
      await api.post('/api/Enrolments/AddFollowUp', payload)
      toast.success('Follow up added successfully!')
      fetchFollowUps()
      return true
    } catch {
      toast.error('Failed to add follow up')
      return false
    } finally {
      setIsAdding(false)
    }
  }

  return {
    isAdding,
    handleAdd,
  }
}