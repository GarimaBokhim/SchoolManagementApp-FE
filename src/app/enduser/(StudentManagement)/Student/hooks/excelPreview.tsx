
'use client'

import * as XLSX from 'xlsx'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useUploadStudents } from './index'

export type ExcelRow = Record<string, string | number | boolean | null>

const getUploadErrorMessage = (error: unknown) => {
  if (isAxiosError<{ Message?: string; message?: string }>(error)) {
    return (
      error.response?.data?.Message ||
      error.response?.data?.message ||
      error.message
    )
  }

  return error instanceof Error
    ? error.message
    : 'Student upload failed. Please check the Excel format.'
}

const getUploadSuccessMessage = (message?: string) => {
  const importedCount = message?.match(
    /(\d+)\s+students?\s+imported\s+successfully/i
  )?.[1]

  if (importedCount) {
    const count = Number(importedCount)
    return `${count} ${count === 1 ? 'student' : 'students'} imported successfully.`
  }

  return (
    message ||
    'Students uploaded successfully, but the imported row count was not returned.'
  )
}

export const useExcelPreview = () => {
  const [previewData, setPreviewData] = useState<ExcelRow[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)

  const { mutateAsync: uploadStudents } = useUploadStudents()

  const handleExcelPreview = async (file: File) => {
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheetName = workbook.SheetNames[0]

      if (!sheetName) {
        toast.error('The Excel file does not contain a worksheet')
        return
      }

      const worksheet = workbook.Sheets[sheetName]

      const rows = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
        defval: null,
      })

      if (!rows.length) {
        toast.error('Excel is empty')
        return
      }

      // Validate required headers
      const normalize = (value: string) =>
        value.toLowerCase().replace(/[^a-z0-9]/g, '')

      const headers = Object.keys(rows[0]).map(normalize)

      const requiredHeaders = [
        'FullName',
        'registrationNumber',
        'Gender',
        'currentclass',
        'Phone',
        'DOB',
        'Address',
      ]

      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(normalize(header))
      )

      if (missingHeaders.length) {
        toast.error(
          `Invalid Excel format. Missing columns: ${missingHeaders.join(', ')}`
        )
        return
      }

      // Add auto-increment S.N
      const numberedRows = rows.map((row, index) => ({
        'S.N': index + 1,
        ...row,
      }))

      setPreviewData(numberedRows)
      setSelectedFile(file)
      setShowPreviewModal(true)

    } catch (err) {
      console.error('Error previewing student Excel file:', err)
      toast.error('Could not read the Excel file')
    }
  }

  const handleSaveExcel = async () => {
    if (!selectedFile) {
      toast.error('Select an Excel file before saving')
      return
    }

    setUploadLoading(true)

    try {
      const response = await uploadStudents(selectedFile)
      toast.success(getUploadSuccessMessage(response.Message))

      setShowPreviewModal(false)
      setPreviewData([])
      setSelectedFile(null)

    } catch (error) {
      console.error('Error uploading student Excel file:', error)
      toast.error(getUploadErrorMessage(error))
    } finally {
      setUploadLoading(false)
    }
  }

  return {
    previewData,
    showPreviewModal,
    setShowPreviewModal,
    uploadLoading,
    handleExcelPreview,
    handleSaveExcel,
  }
}
