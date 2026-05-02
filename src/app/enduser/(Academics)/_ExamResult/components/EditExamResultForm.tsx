/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { SubmitHandler, UseFormReturn, useFieldArray } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { useEffect, useState, ChangeEvent } from 'react'
import { X } from 'lucide-react'
import { IExamResult } from '../types/IExamResults'
import { useEditExamResult, useGetExamResultById } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetAllExams } from '../../Exam/hooks'
import { useGetStudentById } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { useGetSubjectById } from '../../Subject/hooks'
import { IStudent } from '@/app/enduser/(StudentManagement)/Student/types/IStudents'
import { IExam } from '../../Exam/types/IExams'

type Props = {
  form: UseFormReturn<IExamResult>
  onClose: () => void
  ExamResultId: string
}

const EditExamResultForm = ({ form, onClose, ExamResultId }: Props) => {
  const editExamResult = useEditExamResult()
  const { handleError, clearError } = useErrorHandler()

  const { control, reset, watch, setValue } = form

  const { data: ExamResultData, isLoading: isLoadingExamResult } = useGetExamResultById(ExamResultId)
  const { data: allExam, isLoading: isLoadingExams } = useGetAllExams()

  // Fetch student individually by ID
  const { data: studentData, isLoading: isLoadingStudent } = useGetStudentById(
    ExamResultData?.studentId || ''
  )

  const [selectedExam, setSelectedExam] = useState<IExam | undefined>(undefined)
  const [selectedStudent, setSelectedStudent] = useState<IStudent | undefined>(undefined)

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'marksObtained',
  })

  // Initialize form with API data
  useEffect(() => {
    if (!ExamResultData) {
      return
    }

    if (!allExam?.Items) {
      return
    }

    // Find the full exam object from the list
    const exam = allExam.Items.find((e: IExam) => e.id === ExamResultData.examId)
    setSelectedExam(exam)

    // Student will be set separately by the useGetStudentById hook
    // We'll update selectedStudent when studentData changes

    // Normalize marks data
    const normalizedMarks = (ExamResultData.marksObtained ?? []).map((item: any) => ({
      subjectId: item.subjectId,
      marksObtained: item.marksObtaineds ?? item.marksObtained ?? 0,
      fullMarks: item.fullMarks ?? 0,
    }))

    reset({
      examId: ExamResultData.examId,
      studentId: ExamResultData.studentId,
      remarks: ExamResultData.remarks || '',
      marksObtained: normalizedMarks,
    })

    replace(normalizedMarks)
  }, [ExamResultData, allExam, reset, replace])

  // Update selected student when studentData is fetched
  useEffect(() => {
    if (studentData) {
      setSelectedStudent(studentData)
    }
  }, [studentData])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit: SubmitHandler<IExamResult> = async (data) => {
    clearError()
    try {
      const transformedData = {
        examId: data.examId,
        studentId: data.studentId,
        remarks: data.remarks,
        marksObtained: data.marksObtained.map((item: any) => ({
          subjectId: item.subjectId,
          marksObtaineds: item.marksObtained,
          fullMarks: item.fullMarks
        }))
      }

      await toast.promise(
        editExamResult.mutateAsync({ id: ExamResultId, data: transformedData as any }),
        {
          loading: 'Updating Exam Result...',
          success: 'Successfully Updated Exam Result',
        }
      )
      handleClose()
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
    }
  }

  const handleMarksBlur = (index: number, currentFullMarks: number | undefined) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (currentFullMarks && value > currentFullMarks) {
      alert(`Obtained marks cannot exceed full marks (${currentFullMarks})`)
      setValue(`marksObtained.${index}.marksObtained`, currentFullMarks)
    }
  }

  // Show loading state
  if (isLoadingExamResult || isLoadingExams || isLoadingStudent) {
    return (
      <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0">
        <div className="bg-[#FBFBFB] dark:bg-[#27272a] w-full h-full max-w-[90vw] max-h-full rounded-lg overflow-auto p-10 shadow-lg">
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a]
               w-full h-full max-w-[90vw] max-h-full rounded-lg
               overflow-auto p-10 shadow-lg"
      >
        <fieldset>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Edit Exam Result
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AppCombobox<IExam>
                label="Exam"
                name="examId"
                form={form}
                selected={selectedExam}
                options={allExam?.Items ?? []}
                onSelect={(exam: IExam | null) => {
                  setSelectedExam(exam || undefined)
                  setValue('examId', exam?.id ?? '', {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }}
                getLabel={(e: IExam) => e?.name ?? ''}
                getValue={(e: IExam) => e?.id ?? ''}
                placeholder="Select an exam"
              />

              <div className="w-full">
                <AppCombobox<IStudent>
                  label="Student Name"
                  name="studentId"
                  form={form}
                  selected={selectedStudent}
                  options={[]} // Empty array since we don't need options in readOnly mode
                  onSelect={() => { }} // No-op since it's readOnly
                  getLabel={(s: IStudent) => {
                    if (!s) return ''
                    return [s.firstName, s.middleName, s.lastName].filter(Boolean).join(' ')
                  }}
                  getValue={(s: IStudent) => s?.id ?? ''}
                  placeholder="Loading student..."
                  readOnly={true} // This makes it read-only
                />
                <input
                  type="hidden"
                  {...form.register('studentId')}
                />
              </div>

              <InputElement
                label="Remark"
                form={form}
                name="remarks"
                inputType="text"
                placeholder="Enter remark"
              />
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-3">Subject Marks</h2>

              {fields.map((field, index: number) => {
                const currentSubjectId = watch(`marksObtained.${index}.subjectId`)
                const currentFullMarks = watch(`marksObtained.${index}.fullMarks`)

                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-4 items-center p-2 border border-transparent rounded-md mb-4"
                  >
                    {/* Subject display */}
                    <div className="col-span-12 md:col-span-5">
                      {currentSubjectId ? (
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700">
                          <SubjectNameDisplay subjectId={currentSubjectId} />
                        </div>
                      ) : (
                        <InputElement
                          label="Subject ID"
                          form={form}
                          name={`marksObtained.${index}.subjectId`}
                          inputType="text"
                          placeholder="Enter Subject ID"
                        />
                      )}
                    </div>

                    {/* Marks Obtained */}
                    <div className="col-span-12 md:col-span-3">
                      <InputElement
                        label="Marks Obtained"
                        form={form}
                        name={`marksObtained.${index}.marksObtained`}
                        inputType="number"
                        placeholder="Enter marks"
                        onBlur={handleMarksBlur(index, currentFullMarks)}
                      />
                    </div>

                    {/* Full Marks display */}
                    <div className="col-span-12 md:col-span-2">
                      <InputElement
                        label="Full Marks"
                        form={form}
                        name={`marksObtained.${index}.fullMarks`}
                        inputType="number"
                        placeholder="Full marks"
                        readOnly
                      />
                    </div>

                    {/* Remove row */}
                    <div className="col-span-12 md:col-span-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-600 text-xl font-bold"
                      >
                        <X />
                      </button>
                    </div>
                  </div>
                )
              })}

              <ButtonElement
                type="button"
                text="Add Subject"
                onClick={() =>
                  append({
                    subjectId: '',
                    marksObtained: 0,
                    fullMarks: 0,
                  })
                }
                className="mt-2"
              />
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <ButtonElement
                type="button"
                text="Cancel"
                onClick={handleClose}
                className="bg-gray-500 hover:bg-gray-600"
              />
              <ButtonElement type="submit" text="Update" />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

// Component to display subject name by ID
const SubjectNameDisplay = ({ subjectId }: { subjectId: string }) => {
  const { data: subject, isLoading, error } = useGetSubjectById(subjectId)

  if (isLoading) return <span className="text-gray-500">Loading subject...</span>
  if (error) return <span className="text-red-500">Error loading subject</span>
  if (!subject) return <span className="text-gray-500">Subject not found</span>

  return <span className="font-medium">{subject.name}</span>
}

export default EditExamResultForm