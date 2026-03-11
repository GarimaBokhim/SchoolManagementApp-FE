'use client'

import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import { api } from '@/utils/instance'
import toast from 'react-hot-toast'

interface UniversityFormData {
  name: string
  country: string
  descriptions: string
  website: string
  globalRanking: number
}

interface AddUniversityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`

const defaultFormData: UniversityFormData = {
  name: '',
  country: '',
  descriptions: '',
  website: '',
  globalRanking: 0,
}

const AddUniversityModal: React.FC<AddUniversityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UniversityFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'globalRanking' ? Number(value) : value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await api.post('/api/AcademicPrograms/AddUniversity', formData)
      toast.success('University added successfully!')
      setFormData(defaultFormData)
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number
          data?: { message?: string; title?: string }
        }
        request?: unknown
        message?: string
      }
      if (axiosErr.response) {
        const msg =
          axiosErr.response.data?.message ||
          axiosErr.response.data?.title ||
          'Server error occurred'
        setError(`Error ${axiosErr.response.status}: ${msg}`)
        toast.error(`Failed to add university: ${msg}`)
      } else if (axiosErr.request) {
        setError('No response from server. Please check your connection.')
        toast.error('No response from server.')
      } else {
        setError(axiosErr.message ?? 'An unexpected error occurred')
        toast.error('Failed to add university. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(defaultFormData)
      setError(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={handleClose}
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a]
                   w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
                   max-h-[95vh] md:max-h-[92vh]
                   rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <fieldset disabled={isSubmitting} className="min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add New University
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              University Information
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1 lg:col-span-2">
                <label className={labelClass}>
                  University Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Harvard University"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="e.g. United States"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="e.g. https://harvard.edu"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Global Ranking</label>
                <input
                  type="number"
                  name="globalRanking"
                  value={formData.globalRanking}
                  onChange={handleChange}
                  min={0}
                  placeholder="e.g. 1"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1 lg:col-span-3">
                <label className={labelClass}>Description</label>
                <textarea
                  name="descriptions"
                  value={formData.descriptions}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter a brief description of the university..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700
                           text-white rounded-lg font-medium shadow-md transition-colors
                           disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save University'}
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default AddUniversityModal
