'use client'

import * as XLSX from "xlsx"
import { useState } from "react"
import toast from "react-hot-toast"

export type ExcelRow = Record<string, string | number | null>

export const useExcelPreview = () => {
  const [previewData, setPreviewData] = useState<ExcelRow[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)


  const parseExcel = async (file: File): Promise<ExcelRow[]> => {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
  const sheet = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheet]
  return XLSX.utils.sheet_to_json<ExcelRow>(worksheet)
}

  const handleExcelPreview = async (file: File) => {
    try {
      setSelectedFile(file)

     

      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      // ✅ FIX: strongly typed json
        const jsonData = await parseExcel(file)

       
      if (!jsonData.length) {
        toast.error("Excel is empty")
        return
      }

      const normalize = (key: string) =>
        key.toLowerCase().replace(/\s+/g, "")

      const headers = Object.keys(jsonData[0]).map(normalize)

      const requiredColumns = [
            "fullName",
            "Gender",
            "CurrentSchool",
            "StudentId",
            "Father Name"
          ]

    const requiredNormalized = requiredColumns.map(normalize)

      // ✅ FIX: safe validation
      const isValid = requiredNormalized.every(col =>
          headers.includes(col)
        )

      if (!isValid) {
        toast.error("Invalid Excel format")
        return
      }
      
      setPreviewData(jsonData)
      setSelectedFile(file)
      setShowPreviewModal(true)

    } catch (err) {
      console.error(err)
      toast.error("Invalid file")
    }
  }

  return {
  previewData,
  showPreviewModal,
  setShowPreviewModal,
  uploadLoading,
  setUploadLoading,
  handleExcelPreview,
  selectedFile,
  setSelectedFile,
};
}