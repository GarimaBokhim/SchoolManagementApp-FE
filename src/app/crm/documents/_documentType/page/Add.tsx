'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { IDocumentTypeFormData } from '../types/IDoucumentTypes'
import { AddDocumentTypeForm } from '../components/AddDoucmentTypes'

interface AddDocumentTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const AddDocumentTypeModal: React.FC<AddDocumentTypeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const form = useForm<IDocumentTypeFormData>({
    defaultValues: { name: '', countryId: '' },
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#2a2b2e] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <AddDocumentTypeForm form={form} onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  )
}

export default AddDocumentTypeModal