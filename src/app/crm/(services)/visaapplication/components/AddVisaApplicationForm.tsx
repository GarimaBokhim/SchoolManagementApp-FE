'use client'

import { useState } from 'react'
import { X, Paperclip, Check } from 'lucide-react'
import { AddVisaApplicationPayload } from '../types/IVisaApplication'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import {
  useAddVisaApplication,
  useGetAllApplicants,
  useGetAllCountry,
  useGetAllIntake,
  useGetAllVisaStatus,
  useGetCourseByUniversity,
  useGetDocumentsByApplication,
  useGetUniversityByCountry,
} from '../hooks'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'
import TextEditor from '@/components/Input/TextEditor'
import AttachDocumentsModal, { AttachedDocument } from './AttachDocumentModel'

type Props = {
  form: UseFormReturn<AddVisaApplicationPayload>
  onClose: () => void
}
const AddVisaApplicationForm = ({ form, onClose }: Props) => {
  const addVisaApplication = useAddVisaApplication()
  const { clearError } = useErrorHandler()
  const { data: allapplicant } = useGetAllApplicants()
  const { data: country } = useGetAllCountry()
  const { data: allintake = [] } = useGetAllIntake()
  const { data: allVisaStatus } = useGetAllVisaStatus()

  const emailSent = form.watch('emailSent')

  const [sellectedApplicantId, setSelectedApplicantId] = useState<
    string | null
  >('')
  const [sellectedIntakeId, setSelectedIntakeId] = useState<string | null>('')
  const [sellectedVisaStatusId, setSelectedVisaStatusId] = useState<
    string | null
  >('')

  const countryId = form.watch('countryId')
  const universityId = form.watch('universityId')
  const courseId = form.watch('courseId')

  const { data: universityByCountry } = useGetUniversityByCountry(countryId)
  const { data: courseByUniversity } = useGetCourseByUniversity(universityId)

  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)
  const [attachedDocuments, setAttachedDocuments] = useState<
    AttachedDocument[]
  >([])
  const { data: requiredDocuments } = useGetDocumentsByApplication(
    countryId,
    universityId,
    courseId
  )

  const canAttachDocuments = Boolean(countryId && universityId && courseId)
  const attachedCount = attachedDocuments.filter((d) => d.file).length
  const requiredCount = requiredDocuments?.length ?? 0

  const handleClose = () => {
    form.reset({
      applicantId: '',
      countryId: '',
      universityId: '',
      courseId: '',
      intakeId: '',
      appliedDate: '',
      visaStatusId: '',
      visaDetails: '',
      emailSent: false,
      emailContent: '',
    })
    setSelectedApplicantId(null)
    setAttachedDocuments([])
  }

  const onSubmit: SubmitHandler<AddVisaApplicationPayload> = async (data) => {
    clearError()

    const values = form.getValues()

    const payload = {
      applicantId: values.applicantId,
      countryId: values.countryId,
      universityId: values.universityId,
      courseId: values.courseId,
      intakeId: values.intakeId,
      appliedDate: values.appliedDate,
      visaStatusId: values.visaStatusId,
      emailSent: values.emailSent,
      visaDetails: values.visaDetails,
      emailContent: values.emailContent,
      documents: attachedDocuments
        .filter((doc) => doc.file)
        .map((doc) => ({
          documentsId: doc.documentsId,
          file: doc.file,
        })),
    }

    await addVisaApplication.mutateAsync(payload)
    handleClose()
    onClose()
  }
  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Visa Application
            </h1>
            <button
              type="button"
              onClick={() => {
                handleClose()
                onClose()
              }}
              className="cursor-pointer text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <AppCombobox
                value={sellectedApplicantId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute z-20"
                label="Applicant"
                name="applicantId"
                form={form}
                required
                options={allapplicant || []}
                selected={
                  allapplicant?.find((g) => g.id === sellectedApplicantId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    const id = group.id ?? ''

                    setSelectedApplicantId(id || null)

                    form.setValue('applicantId', id, {
                      shouldValidate: true,
                    })
                  } else {
                    setSelectedApplicantId(null)

                    form.setValue('applicantId', '', {
                      shouldValidate: true,
                    })
                  }
                }}
                getLabel={(g) => g?.fullName ?? ''}
                getValue={(g) => g?.id ?? ''}
              />
              <AppCombobox
                dropdownPositionClass="absolute"
                dropDownWidth="w-full"
                value={countryId}
                name="countryId"
                label="Country"
                form={form}
                options={country || []}
                selected={country?.find((x) => x.id === countryId) || null}
                onSelect={(item) => {
                  const id = item?.id ?? ''

                  form.setValue('countryId', id, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })

                  form.setValue('universityId', '')
                  form.setValue('courseId', '')
                  setAttachedDocuments([])
                }}
                getLabel={(i) => i?.name ?? ''}
                getValue={(i) => i?.id ?? ''}
              />

              <AppCombobox
                value={universityId}
                name="universityId"
                label="University"
                dropdownPositionClass="absolute"
                dropDownWidth="w-full"
                form={form}
                options={universityByCountry || []}
                selected={
                  universityByCountry?.find((x) => x.id === universityId) ||
                  null
                }
                onSelect={(item) => {
                  const id = item?.id ?? ''

                  form.setValue('universityId', id, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })

                  form.setValue('courseId', '')
                  setAttachedDocuments([])
                }}
                getLabel={(i) => i?.name ?? ''}
                getValue={(i) => i?.id ?? ''}
              />
              <AppCombobox
                value={courseId}
                name="courseId"
                label="Course"
                dropdownPositionClass="absolute"
                dropDownWidth="w-full"
                form={form}
                options={courseByUniversity || []}
                selected={
                  courseByUniversity?.find((x) => x.id === courseId) || null
                }
                onSelect={(item) => {
                  form.setValue('courseId', item?.id ?? '', {
                    shouldValidate: true,
                  })
                  setAttachedDocuments([])
                }}
                getLabel={(i) => i?.title ?? ''}
                getValue={(i) => i?.id ?? ''}
              />

              <AppCombobox
                label="Intake"
                dropdownPositionClass="absolute"
                name="intakeId"
                dropDownWidth="w-full"
                form={form}
                value={sellectedIntakeId}
                options={allintake.map((item) => ({
                  id: item.id,
                  name:
                    item.month === 1
                      ? 'January'
                      : item.month === 2
                        ? 'February'
                        : item.month === 3
                          ? 'March'
                          : item.month === 4
                            ? 'April'
                            : item.month === 5
                              ? 'May'
                              : item.month === 6
                                ? 'June'
                                : item.month === 7
                                  ? 'July'
                                  : item.month === 8
                                    ? 'August'
                                    : item.month === 9
                                      ? 'September'
                                      : item.month === 10
                                        ? 'October'
                                        : item.month === 11
                                          ? 'November'
                                          : item.month === 12
                                            ? 'December'
                                            : '',
                }))}
                selected={
                  allintake
                    .map((item) => ({
                      id: item.id,
                      name:
                        item.month === 1
                          ? 'January'
                          : item.month === 2
                            ? 'February'
                            : item.month === 3
                              ? 'March'
                              : item.month === 4
                                ? 'April'
                                : item.month === 5
                                  ? 'May'
                                  : item.month === 6
                                    ? 'June'
                                    : item.month === 7
                                      ? 'July'
                                      : item.month === 8
                                        ? 'August'
                                        : item.month === 9
                                          ? 'September'
                                          : item.month === 10
                                            ? 'October'
                                            : item.month === 11
                                              ? 'November'
                                              : item.month === 12
                                                ? 'December'
                                                : '',
                    }))
                    .find((g) => g.id === sellectedIntakeId) || null
                }
                onSelect={(option) => {
                  setSelectedIntakeId(option?.id ?? null)
                  form.setValue('intakeId', option?.id ?? '')
                }}
                getLabel={(o) => o?.name || ''}
                getValue={(o) => o?.id || ''}
              />

              <AppCombobox
                value={sellectedVisaStatusId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute z-20"
                label="Visa Status"
                name="visaStatusId"
                form={form}
                required
                options={allVisaStatus || []}
                selected={
                  allVisaStatus?.find((g) => g.id === sellectedVisaStatusId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    const id = group.id ?? ''

                    setSelectedVisaStatusId(id || null)

                    form.setValue('visaStatusId', id, {
                      shouldValidate: true,
                    })
                  } else {
                    setSelectedVisaStatusId(null)

                    form.setValue('visaStatusId', '', {
                      shouldValidate: true,
                    })
                  }
                }}
                getLabel={(g) => g?.name ?? ''}
                getValue={(g) => g?.id ?? ''}
              />

              <InputElement
                label="AppliedDate"
                form={form}
                name="appliedDate"
                inputType="date"
                placeholder="Enter Applied Date"
                required
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email Sent
                </label>

                <Controller
                  control={form.control}
                  name="emailSent"
                  render={({ field }) => {
                    const value = Boolean(field.value)

                    return (
                      <button
                        type="button"
                        onClick={() => field.onChange(!value)}
                        className={`cursor-pointer relative flex items-center h-7 w-14 rounded-full px-1 transition-colors duration-300 ${
                          value
                            ? 'bg-green-500 justify-end'
                            : 'bg-gray-300 dark:bg-gray-600 justify-start'
                        }`}
                      >
                        <span className="h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300" />
                      </button>
                    )
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Required Documents
                </label>
                <button
                  type="button"
                  disabled={!canAttachDocuments}
                  onClick={() => setIsDocsModalOpen(true)}
                  title={
                    canAttachDocuments
                      ? undefined
                      : 'Select country, university and course first'
                  }
                  className="flex cursor-pointer items-center justify-center gap-2 h-10 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                >
                  {attachedCount > 0 ? (
                    <Check size={15} className="text-green-500" />
                  ) : (
                    <Paperclip size={15} />
                  )}
                  {attachedCount > 0
                    ? `${attachedCount} of ${requiredCount} attached`
                    : 'Attach Required Documents'}
                </button>
              </div>
            </div>
            <div className="mt-6">
              <label
                htmlFor="visaDetails"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Visa Details
              </label>
              <textarea
                id="visaDetails"
                {...form.register('visaDetails')}
                rows={4}
                placeholder="Add any additional notes about this visa application..."
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f23] px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none transition-colors"
              />
            </div>
            {emailSent && (
              <div className="mt-6">
                <h2 className="text-sm font-medium mb-2">Email Content</h2>
                <TextEditor
                  content={form.watch('emailContent') || ''}
                  onChange={(content) => form.setValue('emailContent', content)}
                />
              </div>
            )}
            <div className="flex justify-center mt-6">
              <ButtonElement
                type="submit"
                text={'Submit'}
                className="cursor-pointer"
              />
            </div>
          </form>
        </fieldset>
      </div>
      <AttachDocumentsModal
        open={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        countryId={countryId}
        universityId={universityId}
        courseId={courseId}
        initialValues={attachedDocuments}
        onSave={(documents) => setAttachedDocuments(documents)}
      />
    </div>
  )
}

export default AddVisaApplicationForm
