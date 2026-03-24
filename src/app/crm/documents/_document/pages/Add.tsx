'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { AddDocumentForm } from '../components/AddDocumentForm'
import { IDocumentFormData } from '../model/IDocuments'

interface AddDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const form = useForm<IDocumentFormData>({
    defaultValues: { applicantId: '', documentTypeId: '', documentStatus: 1 },
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#2a2b2e] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <AddDocumentForm form={form} onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  )
}

export default AddDocumentModal