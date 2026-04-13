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
    defaultValues: {
      applicantId: '',
      documentTypeId: '',
      docFile: null,
    },
  })

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#2a2b2e] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AddDocumentForm form={form} onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  )
}

export default AddDocumentModal