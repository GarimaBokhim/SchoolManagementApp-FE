'use client'

import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { useAddDocument, useGetAllApplicants, useGetAllDocumentTypes } from '../../hooks'
import { AppCombobox } from '@/components/Input/ComboBox'

import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { IDocumentFormData } from '../model/IDocuments'
import { IApplicant } from '../../types/IApplicants'
import { IDocumentType } from '../../_documentType/types/IDoucumentTypes'

interface AddDocumentFormProps {
  form: UseFormReturn<IDocumentFormData>
  onClose: () => void
  onSuccess?: () => void
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-emerald-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`

const DOCUMENT_STATUS_OPTIONS = [
  { label: 'Pending', value: 1 },
  { label: 'Approved', value: 2 },
  { label: 'Rejected', value: 3 },
]

export const AddDocumentForm: React.FC<AddDocumentFormProps> = ({
  form, onClose, onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<IApplicant | null>(null)
  const [selectedDocType, setSelectedDocType] = useState<IDocumentType | null>(null)
  const { handleError, clearError } = useErrorHandler()
  const { mutateAsync: addDocument } = useAddDocument()
  const { data: applicants } = useGetAllApplicants()
  const { data: docTypes } = useGetAllDocumentTypes()

  const handleSubmit = async (data: IDocumentFormData) => {
    clearError()
    if (!data.applicantId) { setError('Please select an applicant.'); return }
    if (!data.documentTypeId) { setError('Please select a document type.'); return }
    setIsSubmitting(true)
    setError(null)
    try {
      await addDocument(data)
      toast.success('Document added successfully!')
      form.reset()
      setSelectedApplicant(null)
      setSelectedDocType(null)
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
          Add New Document
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
          Document Information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
          {/* Applicant */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Applicant <span className="text-red-500">*</span>
            </label>
            <AppCombobox
              label="Select Applicant"
              name="applicantId"
              form={form}
              options={applicants ?? []}
              selected={selectedApplicant}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              onSelect={(applicant) => {
                setSelectedApplicant(applicant)
                form.setValue('applicantId', applicant?.id ?? '')
                setError(null)
              }}
              getLabel={(a) => a?.fullName ?? ''}
              getValue={(a) => a?.id ?? ''}
              placeholder="Search applicant..."
            />
          </div>

          {/* Document Type */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Document Type <span className="text-red-500">*</span>
            </label>
            <AppCombobox
              label="Select Document Type"
              name="documentTypeId"
              form={form}
              options={(docTypes as { Items: IDocumentType[] } | IDocumentType[] | undefined) instanceof Array
                ? docTypes as unknown as IDocumentType[]
                : (docTypes as { Items?: IDocumentType[] } | undefined)?.Items ?? []}
              selected={selectedDocType}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              onSelect={(dt) => {
                setSelectedDocType(dt)
                form.setValue('documentTypeId', dt?.id ?? '')
                setError(null)
              }}
              getLabel={(dt) => dt?.name ?? ''}
              getValue={(dt) => dt?.id ?? ''}
              renderOptionExtra={(dt) => (
                <span className={`text-xs ${dt?.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                  {dt?.isActive ? 'Active' : 'Inactive'}
                </span>
              )}
              placeholder="Search document type..."
            />
          </div>

          {/* Document Status */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Document Status <span className="text-red-500">*</span>
            </label>
            <select
              {...form.register('documentStatus', { valueAsNumber: true, required: true })}
              className={inputClass}
            >
              <option value="">Select status...</option>
              {DOCUMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
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
            {isSubmitting ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </form>
    </fieldset>
  )
}