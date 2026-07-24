'use client'

import { useMemo, useState } from 'react'
import { Paperclip, X, FileText, Check } from 'lucide-react'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import {
  IRequiredDocuments,
  useGetDocumentsByApplication,
} from '../hooks/index'

export type AttachedDocument = {
  documentsId: string
  documentsName: string
  file: File | null
}

type Props = {
  open: boolean
  onClose: () => void
  countryId?: string | null
  universityId?: string | null
  courseId?: string | null
  initialValues?: AttachedDocument[]
  onSave: (documents: AttachedDocument[]) => void
}

const AttachDocumentsModal = ({
  open,
  onClose,
  countryId,
  universityId,
  courseId,
  initialValues,
  onSave,
}: Props) => {
  const {
    data: requiredDocuments,
    isLoading,
    isError,
  } = useGetDocumentsByApplication(countryId, universityId, courseId)
  const [fileOverrides, setFileOverrides] = useState<
    Record<string, File | null>
  >({})
  const attachments = useMemo(() => {
    const result: Record<string, AttachedDocument> = {}
    requiredDocuments?.forEach((doc: IRequiredDocuments) => {
      const previouslyAttached = initialValues?.find(
        (item) => item.documentsId === doc.documentsId
      )
      const hasOverride = doc.documentsId in fileOverrides

      result[doc.documentsId] = {
        documentsId: doc.documentsId,
        documentsName: doc.documentsName,
        file: hasOverride
          ? fileOverrides[doc.documentsId]
          : (previouslyAttached?.file ?? null),
      }
    })
    return result
  }, [requiredDocuments, initialValues, fileOverrides])

  if (!open) return null

  const handleFileChange = (documentsId: string, file: File | null) => {
    setFileOverrides((prev) => ({
      ...prev,
      [documentsId]: file,
    }))
  }

  const attachedCount = Object.values(attachments).filter(
    (item) => item.file
  ).length
  const totalCount = requiredDocuments?.length ?? 0

  const handleSave = () => {
    onSave(Object.values(attachments))
    handleClose()
  }

  const handleClose = () => {
    setFileOverrides({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white dark:bg-[#27272a] shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-50">
              Required Documents
            </h2>
            {totalCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {attachedCount} of {totalCount} attached
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {isLoading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              Loading required documents…
            </p>
          )}

          {isError && (
            <p className="text-sm text-red-500 py-6 text-center">
              Couldn&apos;t load required documents. Please try again.
            </p>
          )}

          {!isLoading && !isError && totalCount === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              No documents are required for this selection.
            </p>
          )}

          {!isLoading && !isError && totalCount > 0 && (
            <ul className="flex flex-col gap-3">
              {requiredDocuments?.map((doc: IRequiredDocuments) => {
                const attached = attachments[doc.documentsId]?.file
                const inputId = `doc-upload-${doc.documentsId}`

                return (
                  <li
                    key={doc.documentsId}
                    className="flex items-center justify-between gap-3 rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText
                        size={16}
                        className="text-gray-400 dark:text-gray-500 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                          {doc.documentsName}
                        </p>
                        {attached && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {attached.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {attached ? (
                        <>
                          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <Check size={14} />
                            Attached
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleFileChange(doc.documentsId, null)
                            }
                            className="cursor-pointer text-xs text-red-400 hover:text-red-500 underline"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <label
                          htmlFor={inputId}
                          className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Paperclip size={13} />
                          Attach
                        </label>
                      )}
                      <input
                        id={inputId}
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(
                            doc.documentsId,
                            e.target.files?.[0] ?? null
                          )
                        }
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-5 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <ButtonElement
            type="button"
            text="Save"
            className="cursor-pointer"
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  )
}

export default AttachDocumentsModal
