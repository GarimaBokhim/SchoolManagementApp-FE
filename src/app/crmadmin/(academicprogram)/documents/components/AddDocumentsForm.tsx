'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddDocumentsPayload } from '../types/IDocuments'
import { SubmitHandler, useFieldArray, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import {
  useAddDocuments,
  useGetAllApplicants,
  useGetAllDocType,
} from '../hooks'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'

type Props = {
  form: UseFormReturn<AddDocumentsPayload>
  onClose: () => void
  ApplicantId: string
}
const AddDocumentsForm = ({ form, onClose, ApplicantId }: Props) => {
  const addDocuments = useAddDocuments()
  const { handleError, clearError } = useErrorHandler()
  const { data: applicant } = useGetAllApplicants()
  const { data: documentType } = useGetAllDocType()

  const [sellecteApplicantId, setSelectedApplicantId] = useState<string | null>(
    ''
  )
  const [sellectedDocumentTypeId, setSelectedDocumentTypeId] = useState<
    string | null
  >('')

  const handleClose = () => {
    form.reset({
      applicantId: ApplicantId ? ApplicantId : '',
      documentsDTOs: [
        {
          documentTypeId: '',
          docFile: null,
        },
      ],
    })
    setSelectedApplicantId(null)
    setSelectedDocumentTypeId(null)

    onClose()
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'documentsDTOs',
  })

  const onSubmit: SubmitHandler<AddDocumentsPayload> = async () => {
    clearError()
    const values = form.getValues()

    const payload = {
      applicantId: ApplicantId ? ApplicantId : values.applicantId,
      documentsDTOs: (values.documentsDTOs ?? []).map((item) => ({
        documentTypeId: item.documentTypeId,
        docFile: item.docFile,
      })),
    }

    await addDocuments.mutateAsync(payload)
    handleClose()
    onClose()
  }

  const hasApplicant = ApplicantId && ApplicantId.trim().length > 0

  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Documents
            </h1>
            <button
              type="button"
              onClick={() => {
                handleClose()
                onClose()
              }}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {!hasApplicant && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <AppCombobox
                  value={sellecteApplicantId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute z-20"
                  label="Applicant"
                  name="applicantId"
                  form={form}
                  required
                  options={applicant || []}
                  selected={
                    applicant?.find(
                      (item) => item.id === sellecteApplicantId
                    ) || null
                  }
                  onSelect={(item) => {
                    const applicantId = item?.id ?? ''

                    setSelectedApplicantId(applicantId || null)

                    form.setValue('applicantId', applicantId, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }}
                  getLabel={(item) => item?.fullName ?? ''}
                  getValue={(item) => item?.id ?? ''}
                />
              </div>
            )}

            {/* ITEMS */}
            <div className="mt-8">
              <h2 className="font-semibold mb-4">Document Items</h2>

              {fields.length === 0 && (
                <button
                  type="button"
                  onClick={() =>
                    append({
                      documentTypeId: '',
                      docFile: null,
                    })
                  }
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Add Item
                </button>
              )}

              {fields.map((field, index) => {
                return (
                  <div key={field.id} className="border p-4 rounded mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Item {index + 1}</span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            append({
                              documentTypeId: '',
                              docFile: null,
                            })
                          }
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <Plus size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1 rounded hover:bg-red-50 text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AppCombobox
                        value={sellectedDocumentTypeId}
                        dropDownWidth="w-full"
                        dropdownPositionClass="absolute z-20"
                        label="Document Type"
                        name={`documentsDTOs.${index}.documentTypeId`}
                        form={form}
                        required
                        options={documentType || []}
                        selected={
                          documentType?.find(
                            (item) => item.id === sellectedDocumentTypeId
                          ) || null
                        }
                        onSelect={(item) => {
                          form.setValue(
                            `documentsDTOs.${index}.documentTypeId`,
                            item?.id ?? '',
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            }
                          )
                        }}
                        getLabel={(item) => item?.name ?? ''}
                        getValue={(item) => item?.id ?? ''}
                      />

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Document File
                        </label>

                        <input
                          type="file"
                          className="w-full border rounded-lg p-2"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null

                            form.setValue(
                              `documentsDTOs.${index}.docFile`,
                              file,
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              }
                            )
                          }}
                        />

                        {form.watch(`documentsDTOs.${index}.docFile`) instanceof
                          File && (
                          <p className="text-xs text-gray-500 mt-1">
                            {
                              (
                                form.watch(
                                  `documentsDTOs.${index}.docFile`
                                ) as File
                              ).name
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={'Submit'} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default AddDocumentsForm
