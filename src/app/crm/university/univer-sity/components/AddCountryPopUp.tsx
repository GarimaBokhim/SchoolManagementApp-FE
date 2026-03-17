// src/components/AddCountryPopup.tsx
import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { api } from '@/utils/instance'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'

interface AddCountryPopupProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`

export const AddCountryPopup: React.FC<AddCountryPopupProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [countryName, setCountryName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { handleError, clearError } = useErrorHandler()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!countryName.trim()) {
      setError('Country name is required.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await api.post('/api/AcademicPrograms/AddCountry', {
        name: countryName.trim()
      })
      toast.success('Country added successfully!')
      setCountryName('')
      if (onSuccess) onSuccess()
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-[#1f1f22] rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
            Add New Country
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={labelClass}>
              Country Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              placeholder="e.g. United States"
              className={inputClass}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Country'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}