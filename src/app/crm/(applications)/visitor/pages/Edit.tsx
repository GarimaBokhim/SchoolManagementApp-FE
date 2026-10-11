'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AddInquiryPayload } from '../types/IVisitors'
import { useInquiryById } from '../hooks'
import AddInquiryForm from '../components/AddInquiryForm'

type Props = {
  visible: boolean
  onClose: () => void
  InquiryId: string
}

const EditInquiry = ({ visible, onClose, InquiryId }: Props) => {
  const { data: inquiry, isLoading, error } = useInquiryById(InquiryId)
  const form = useForm<AddInquiryPayload>({
    defaultValues: {
      fullName: '',
      email: '',
      dateOfBirth: '',
      gender: 0,
      contactNumber: '',
      permanentAddress: '',
      educationLevel: 0,
      englishProficiency: 0,
      bandScore: 0,
      languageRemarks: '',
      skillOrTrainingName: '',
      institutionName: '',
      trainingRemarks: '',
      trainingStartDate: '',
      trainingEndDate: '',
      completionYear: '',
      currentGpa: '',
      previousAcademicQualification: '',
      source: '',
      feedBackOrSuggestion: '',
      countries: [],
    },
  })

  useEffect(() => {
    if (!inquiry) return

    const dateOnly = (date?: string) => date?.split('T')[0] ?? ''
    form.reset({
      fullName: inquiry.fullName ?? '',
      email: inquiry.email ?? '',
      dateOfBirth: dateOnly(inquiry.dateOfBirth),
      gender: inquiry.gender ?? 0,
      contactNumber: inquiry.contactNumber ?? '',
      permanentAddress: inquiry.permanentAddress ?? '',
      educationLevel: inquiry.educationLevel ?? 0,
      englishProficiency: inquiry.englishProficiency ?? 0,
      bandScore: inquiry.bandScore ?? 0,
      languageRemarks: inquiry.languageRemarks ?? '',
      skillOrTrainingName: inquiry.skillOrTrainingName ?? '',
      institutionName: inquiry.institutionName ?? '',
      trainingRemarks: inquiry.trainingRemarks ?? '',
      trainingStartDate: dateOnly(inquiry.trainingStartDate),
      trainingEndDate: dateOnly(inquiry.trainingEndDate),
      completionYear: inquiry.completionYear ?? '',
      currentGpa: inquiry.currentGpa ?? '',
      previousAcademicQualification: inquiry.previousAcademicQualification ?? '',
      source: inquiry.source ?? '',
      feedBackOrSuggestion: inquiry.feedBackOrSuggestion ?? '',
      countries: inquiry.countries ?? [],
    })
  }, [form, inquiry])

  if (!visible) return null

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
        <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">Loading visitor...</div>
      </div>
    )
  }

  if (error || !inquiry) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ml-12 md:ml-64 sm:ml-16">
        <div className="rounded-lg bg-white p-6 dark:bg-[#27272a]">
          <p className="mb-4">Unable to load visitor details.</p>
          <button type="button" onClick={onClose} className="text-blue-600">Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16">
      <div className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] max-h-[95vh] md:max-h-[92vh] h-full rounded-lg overflow-auto p-6 md:p-8 shadow-lg">
        <AddInquiryForm
          form={form}
          onClose={onClose}
          inquiry={inquiry}
          inquiryId={InquiryId}
        />
      </div>
    </div>
  )
}

export default EditInquiry
