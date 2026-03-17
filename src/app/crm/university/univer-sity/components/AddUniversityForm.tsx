'use client'

import React, { useState } from 'react'
import { X, Save, Plus } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { api } from '@/utils/instance'
import toast from 'react-hot-toast'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetAllCountries } from '../hooks'
import { ICountry } from '../types/ICountry'
import { IUniversityFormData } from '../types/IUniversity'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { useQueryClient } from '@tanstack/react-query'
import { AddCountryPopup } from './AddCountryPopUp'

interface AddUniversityFormProps {
  form: UseFormReturn<IUniversityFormData>
  onClose: () => void
  onSuccess?: () => void
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`

export const AddUniversityForm: React.FC<AddUniversityFormProps> = ({
  form,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null)
  const [isAddCountryPopupOpen, setIsAddCountryPopupOpen] = useState(false)
  const { handleError, clearError } = useErrorHandler()
  const queryClient = useQueryClient()

  const { data: countryList } = useGetAllCountries()

  const handleCountryAdded = () => {
    // Invalidate and refetch countries
    queryClient.invalidateQueries({ queryKey: ['Countries'] })
  }

  const handleSubmit = async (data: IUniversityFormData) => {
    clearError()
    
    if (!data.countryId) {
      setError('Please select a country.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    try {
      await api.post('/api/AcademicPrograms/AddUniversity', data)
      toast.success('University added successfully!')
      form.reset()
      setSelectedCountry(null)
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
    <fieldset disabled={isSubmitting} className="min-w-0">
      <AddCountryPopup
        isOpen={isAddCountryPopupOpen}
        onClose={() => setIsAddCountryPopupOpen(false)}
        onSuccess={handleCountryAdded}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
          Add New University
        </h1>
        <button
          type="button"
          onClick={onClose}
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

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          University Information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
          {/* University Name */}
          <div className="flex flex-col gap-1 lg:col-span-2">
            <label className={labelClass}>
              University Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...form.register('name', { required: true })}
              placeholder="e.g. Harvard University"
              className={inputClass}
            />
          </div>

          {/* Country combobox with plus icon */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Country <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsAddCountryPopupOpen(true)}
                className="p-1 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
                title="Add new country"
              >
                <Plus size={18} />
              </button>
            </div>
            <AppCombobox
              label="Select Country"
              name="countryId"
              form={form}
              options={countryList ?? []}
              selected={selectedCountry}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              onSelect={(country) => {
                setSelectedCountry(country)
                form.setValue('countryId', country?.id ?? '')
                setError(null)
              }}
              getLabel={(country) => country?.name ?? ''}
              getValue={(country) => country?.id ?? ''}
              renderOptionExtra={(country) => (
                <span className={`text-xs ${country?.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                  {country?.isActive ? 'Active' : 'Inactive'}
                </span>
              )}
              placeholder="Search country..."
            />
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Website</label>
            <input
              type="text"
              {...form.register('website')}
              placeholder="e.g. https://harvard.edu"
              className={inputClass}
            />
          </div>

          {/* Global Ranking */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Global Ranking</label>
            <input
              type="number"
              {...form.register('globalRanking', { valueAsNumber: true })}
              min={0}
              placeholder="e.g. 1"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 lg:col-span-3">
            <label className={labelClass}>Description</label>
            <textarea
              {...form.register('descriptions')}
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
  )
}