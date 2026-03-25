'use client'

import React, { useState, useRef } from 'react'
import { X, Save, UploadCloud, FileText, XCircle } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { useGetAllApplicants, useGetAllDocumentTypes } from '../../hooks'
import { AppCombobox } from '@/components/Input/ComboBox'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { IDocumentFormData } from '../model/IDocuments'
import { IApplicant } from '../../types/IApplicants'
import { IDocumentType } from '../../_documentType/types/IDoucumentTypes'
import { useAddDocument } from '../hooks'

interface AddDocumentFormProps {
  form: UseFormReturn<IDocumentFormData>
  onClose: () => void
  onSuccess?: () => void
}

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`

export const AddDocumentForm: React.FC<AddDocumentFormProps> = ({
  form, onClose, onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<IApplicant | null>(null)
  const [selectedDocType, setSelectedDocType] = useState<IDocumentType | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { handleError, clearError } = useErrorHandler()
  const { mutateAsync: addDocument } = useAddDocument()
  const { data: applicants } = useGetAllApplicants()
  const { data: docTypes } = useGetAllDocumentTypes()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
    form.setValue('docFile', file)
    setError(null)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    form.setValue('docFile', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (data: IDocumentFormData) => {
    clearError()
    if (!data.applicantId) { setError('Please select an applicant.'); return }
    if (!data.documentTypeId) { setError('Please select a document type.'); return }
    if (!data.docFile) { setError('Please upload a document file.'); return }

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('applicantId', data.applicantId)
      formData.append('documentTypeId', data.documentTypeId)
      formData.append('docFile', data.docFile)

      await addDocument(formData)
      toast.success('Document added successfully!')
      form.reset()
      setSelectedApplicant(null)
      setSelectedDocType(null)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-6">

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
              options={
                Array.isArray(docTypes)
                  ? docTypes as unknown as IDocumentType[]
                  : (docTypes as { Items?: IDocumentType[] } | undefined)?.Items ?? []
              }
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

          {/* File Upload — full width */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className={labelClass}>
              Document File <span className="text-red-500">*</span>
            </label>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Drop zone / click area */}
            {!selectedFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed 
                           border-gray-300 dark:border-gray-600 rounded-xl p-8 
                           hover:border-emerald-500 dark:hover:border-emerald-400 
                           hover:bg-emerald-50 dark:hover:bg-emerald-900/10 
                           transition-colors duration-200 cursor-pointer group"
              >
                <UploadCloud
                  size={36}
                  className="text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors"
                />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Click to upload a document
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG, WEBP supported
                </p>
              </button>
            ) : (
              /* File preview row */
              <div className="flex items-center gap-3 w-full border border-emerald-300 dark:border-emerald-700 
                              bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-4 py-3">
                <FileText size={24} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                {/* Change file */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex-shrink-0"
                >
                  Change
                </button>
                {/* Remove file */}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-400 hover:text-red-500 flex-shrink-0"
                  title="Remove file"
                >
                  <XCircle size={18} />
                </button>
              </div>
            )}
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