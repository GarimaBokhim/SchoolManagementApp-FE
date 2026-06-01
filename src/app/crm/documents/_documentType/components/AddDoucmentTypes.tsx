'use client'

import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { useAddDocumentType } from '../../hooks'
import { AppCombobox } from '@/components/Input/ComboBox'

import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { IDocumentTypeFormData } from '../types/IDoucumentTypes'
import { ICountry } from '../../../university/_university/types/ICountry'
import { useGetAllCountries } from '../../../university/_university/hooks'

interface AddDocumentTypeFormProps {
  form: UseFormReturn<IDocumentTypeFormData>
  onClose: () => void
  onSuccess?: () => void
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`

export const AddDocumentTypeForm: React.FC<AddDocumentTypeFormProps> = ({
  form, onClose, onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null)
  const { handleError, clearError } = useErrorHandler()
  const { mutateAsync: addDocumentType } = useAddDocumentType()

  const handleSubmit = async (data: IDocumentTypeFormData) => {
    clearError()
    setIsSubmitting(true)
    setError(null)
    try {
      await addDocumentType(data)
      toast.success('Document type added successfully!')
      form.reset()
      setSelectedCountry(null)
      onSuccess?.()
      onClose()
    } catch (err) {
      const errorMsg = handleError(err)
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <fieldset disabled={isSubmitting} className="min-w-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
          Add New Document Type
        </h1>
        <button type="button" onClick={onClose} className="text-red-400 text-2xl hover:text-red-500">
          <X strokeWidth={3} />
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          <strong className="font-bold">Error: </strong><span>{error}</span>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Document Type Information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-6">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Document Type Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...form.register('name', { required: true })}
              placeholder="e.g. Citizenship, Passport"
              className={inputClass}
            />
          </div>

        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700
                       text-white rounded-lg font-medium shadow-md transition-colors
                       disabled:bg-emerald-300 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Document Type'}
          </button>
        </div>
      </form>
    </fieldset>
  )
}