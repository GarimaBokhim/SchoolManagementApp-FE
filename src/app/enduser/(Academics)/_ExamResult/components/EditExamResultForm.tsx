/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { SubmitHandler, UseFormReturn, useFieldArray } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { IExamResult } from '../types/IExamResults'
import { useEditExamResult, useGetExamResultById } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetAllExams } from '../../Exam/hooks'
import { useGetAllStudents } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { useGetSubjectById } from '../../Subject/hooks' // Changed import
import { IStudent } from '@/app/enduser/(StudentManagement)/Student/types/IStudents'
import { ISubject } from '../../Subject/types/ISubjects'

type Props = {
  form: UseFormReturn<IExamResult>
  onClose: () => void
  ExamResultId: string
}

// Component to fetch and display subject name in the dropdown
const SubjectOption = ({ subjectId, children }: { subjectId: string; children: React.ReactNode }) => {
  const { data: subject, isLoading } = useGetSubjectById(subjectId)
  
  if (isLoading) return <span>Loading...</span>
  if (!subject) return <span>{children}</span>
  
  return <span>{subject.name}</span>
}

const EditExamResultForm = ({ form, onClose, ExamResultId }: Props) => {
  const editExamResult = useEditExamResult()
  const { handleError, clearError } = useErrorHandler()

  const { control, reset, watch } = form

  const { data: ExamResultData } = useGetExamResultById(ExamResultId)
  const [selectedClassId, setSelectedClassId] = useState<string | null>('')
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>()
  
  // Store fetched subjects for each row
  const [subjectsData, setSubjectsData] = useState<{ [key: number]: ISubject | null }>({})

  useEffect(() => {
    if (selectedStudent) {
      setSelectedClassId(selectedStudent.classId || '')
    }
  }, [selectedStudent])

  const { data: allExam } = useGetAllExams()
  const { data: allStudents } = useGetAllStudents('?IsPagination=false')
  
  // Remove useGetSubjectByClassId - we'll fetch individually
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'marksObtained',
  })

  // Fetch subject data for each row when subject IDs are available
  useEffect(() => {
    const fetchSubjects = async () => {
      const marksObtained = watch('marksObtained')
      if (!marksObtained) return

      const newSubjectsData: { [key: number]: ISubject | null } = {}
      
      for (let i = 0; i < marksObtained.length; i++) {
        const subjectId = marksObtained[i]?.subjectId
        if (subjectId && !subjectsData[i]) {
          // You would need to create a hook that can fetch subjects
          // For now, we'll mark it as loading
          newSubjectsData[i] = null
        }
      }
      
      setSubjectsData(prev => ({ ...prev, ...newSubjectsData }))
    }
    
    fetchSubjects()
  }, [watch('marksObtained')])

  // In EditExamResultForm, inside the useEffect that calls reset(...)
  useEffect(() => {
    if (!ExamResultData) return

    // Normalize API response: "marksObtaineds" → "marksObtained"
    const normalizedMarks = (ExamResultData.marksObtained ?? []).map((item) => ({
      subjectId: item.subjectId,
      marksObtained: item.marksObtaineds ?? item.marksObtained ?? 0,
      fullMarks: item.fullMarks ?? 0,
    }))

    reset({
      examId: ExamResultData.examId,
      studentId: ExamResultData.studentId,
      remarks: ExamResultData.remarks,
      marksObtained: normalizedMarks,
    })

    setSelectedExamId(ExamResultData.examId)
    setSelectedStudentId(ExamResultData.studentId)

    const student = allStudents?.Items?.find((s) => s.id === ExamResultData.studentId)
    if (student?.classId) {
      setSelectedClassId(student.classId)
    }

    replace(normalizedMarks)
  }, [ExamResultData, allStudents, reset, replace])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit: SubmitHandler<IExamResult> = async (data) => {
    clearError()
    try {
      await toast.promise(
        editExamResult.mutateAsync({ id: ExamResultId, data }),
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

  // Helper to get subject options - since we don't have a list, 
  // we'll allow manual entry or keep the existing subject
  const getSubjectOptions = (currentSubjectId: string) => {
    // Return an array with just the current subject if it exists
    if (currentSubjectId) {
      return [{ id: currentSubjectId, name: 'Current Subject' }]
    }
    return []
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
              <AppCombobox
                dropDownWidth="w-[25rem]"
                label="Exam"
                name="examId"
                form={form}
                dropdownPositionClass="absolute"
                value={selectedExamId}
                options={allExam?.Items ?? []}
                selected={allExam?.Items?.find((e) => e.id === selectedExamId) || null}
                onSelect={(exam) => {
                  const id = exam?.id ?? ''
                  setSelectedExamId(id)
                  form.setValue('examId', id)
                }}
                getLabel={(e) => e?.name ?? ''}
                getValue={(e) => e?.id ?? ''}
              />
              <AppCombobox
                dropDownWidth="w-[25rem]"
                label="Student Name"
                name="studentId"
                form={form}
                dropdownPositionClass="absolute"
                value={selectedStudentId}
                options={allStudents?.Items ?? []}
                selected={allStudents?.Items?.find((s) => s.id === selectedStudentId) || null}
                onSelect={(student) => {
                  const id = student?.id ?? ''
                  setSelectedStudentId(id)
                  setSelectedStudent(student)
                  form.setValue('studentId', id)
                }}
                getLabel={(s) => {
                  if (!s) return ''
                  return [s.firstName, s.middleName, s.lastName].filter(Boolean).join(' ')
                }}
                getValue={(s) => s?.id ?? ''}
              />
              <InputElement
                label="Remark"
                form={form}
                name="remarks"
                type="string"
                placeholder="Enter remark"
              />
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-3">Subject Marks</h2>

              {fields.map((field, index) => {
                const currentSubjectId = watch(`marksObtained.${index}.subjectId`)
                
                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-4 items-center p-2 border border-transparent rounded-md mb-4"
                  >
                    {/* Subject display - show subject name fetched by ID */}
                    <div className="col-span-12 md:col-span-5">
                      {currentSubjectId ? (
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                          <SubjectNameDisplay subjectId={currentSubjectId} />
                        </div>
                      ) : (
                        <InputElement
                          label="Subject ID"
                          form={form}
                          name={`marksObtained.${index}.subjectId`}
                          type="text"
                          placeholder="Enter Subject ID"
                        />
                      )}
                    </div>

                    {/* Marks Obtained — 5 cols */}
                    <div className="col-span-12 md:col-span-5">
                      <InputElement
                        label="Marks Obtained"
                        form={form}
                        name={`marksObtained.${index}.marksObtained`}
                        type="number"
                        placeholder="Enter marks"
                      />
                    </div>

                    {/* Full Marks field - hidden */}
                    <input
                      type="hidden"
                      {...form.register(`marksObtained.${index}.fullMarks`)}
                    />

                    {/* Remove row — 2 cols */}
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
              />
            </div>

            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text="Submit" />
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
  
  return (
    <div>
      <span className="font-medium">{subject.name}</span>
      <span className="text-xs text-gray-500 ml-2">(ID: {subjectId})</span>
    </div>
  )
}

export default EditExamResultForm