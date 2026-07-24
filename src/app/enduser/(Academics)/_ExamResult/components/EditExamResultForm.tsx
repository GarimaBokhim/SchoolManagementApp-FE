/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useGetStudentByClass, useGetStudentById } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { useGetSubjectByClassId, useGetSubjectById } from '../../Subject/hooks'
import { useGetAllClass } from '../../Class/hooks'
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

  const [selectedExam, setSelectedExam] = useState<IExam | undefined>()
  const [selectedStudent, setSelectedStudent] = useState<IStudent | undefined>()
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>('')

  const { data: ExamResultData, isLoading: isLoadingExamResult } =
    useGetExamResultById(ExamResultId)

  const { data: allExam, isLoading: isLoadingExams } = useGetAllExams()

  const { data: allSubject } = useGetSubjectByClassId(
    selectedClassId,
    selectedExamId ?? undefined
  )

  const { data: allStudents } = useGetStudentByClass(selectedClassId || '')

  const { data: allClass } = useGetAllClass()

  const { data: studentData, isLoading: isLoadingStudent } =
    useGetStudentById(ExamResultData?.studentId || '')

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'marksObtained',
  })

  // INIT — populate form from existing ExamResult
  useEffect(() => {
    if (!ExamResultData || !allExam?.Items) return

    const exam = allExam.Items.find((e: IExam) => e.id === ExamResultData.examId)
    setSelectedExam(exam)
    setSelectedExamId(exam?.id ?? null)
    setSelectedClassId(exam?.classId)
    setSelectedStudentId(ExamResultData.studentId)

    const normalizedMarks = (ExamResultData.marksObtained ?? []).map((item: any) => ({
      subjectId: item.subjectId,
      marksObtained: item.marksObtaineds ?? item.marksObtained ?? 0,
      fullMarks: item.fullMarks ?? 0,
      isNew: false,
    }))

    reset({
      examId: ExamResultData.examId,
      studentId: ExamResultData.studentId,
      remarks: ExamResultData.remarks || '',
      marksObtained: normalizedMarks,
    })
  }, [ExamResultData, allExam, reset])

  // Set selectedStudent from studentData for initial display fallback
  useEffect(() => {
    if (studentData) setSelectedStudent(studentData)
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
          fullMarks: item.fullMarks,
        })),
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
      Toast.error(handleError(error))
    }
  }

  const handleMarksBlur =
    (index: number, currentFullMarks: number | undefined) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        if (currentFullMarks !== undefined && value > currentFullMarks) {
          alert(`Obtained marks cannot exceed full marks (${currentFullMarks})`)
          setValue(`marksObtained.${index}.marksObtained` as any, currentFullMarks)
        }
      }

  if (isLoadingExamResult || isLoadingExams || isLoadingStudent) {
    return <div className="text-center p-10">Loading...</div>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm ml-[13%]">
      <div className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[90vw] h-full rounded-lg overflow-auto p-10 shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Edit Exam Result</h1>
          <button onClick={handleClose}>
            <X />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>

          {/* TOP FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">

            {/* EXAM */}
            <AppCombobox<IExam>
              label="Exam"
              name="examId"
              form={form}
              selected={selectedExam ?? undefined}
              options={allExam?.Items ?? []}
              onSelect={(exam) => {
                setSelectedExam(exam || undefined)
                setSelectedExamId(exam?.id ?? null)
                setSelectedClassId(exam?.classId)
                setValue('examId', exam?.id ?? '')

                // Reset student when exam changes
                setSelectedStudentId(null)
                setSelectedStudent(undefined)
                setValue('studentId', '')
              }}
              getLabel={(e) => e.name}
              getValue={(e) => e.id ?? ''}
            />

            {/* STUDENT */}
            <AppCombobox<IStudent>
              label="Student Name"
              name="studentId"
              form={form}
              selected={
                allStudents?.Items.find((s) => s.id === selectedStudentId) ||
                selectedStudent ||
                undefined
              }
              options={allStudents?.Items ?? []}
              onSelect={(student) => {
                const id = student?.id ?? ''
                setSelectedStudentId(id)
                setSelectedStudent(student || undefined)
                setValue('studentId', id)
              }}
              getLabel={(s) =>
                [s.firstName, s.middleName, s.lastName].filter(Boolean).join(' ')
              }
              getValue={(s) => s.id ?? ''}
              renderOptionExtra={(s) => (
                <div>
                  {allClass?.Items.find((i) => i.id === s?.classId)?.name}
                </div>
              )}
            />

            {/* REMARKS */}
            <InputElement
              label="Remark"
              form={form}
              name="remarks"
              inputType="text"
              placeholder="Enter remark"
            />
          </div>

          {/* SUBJECT MARKS */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Subject Marks</h2>

            {fields.map((field, index) => {
              const currentSubjectId = watch(`marksObtained.${index}.subjectId`)
              const currentFullMarks = watch(`marksObtained.${index}.fullMarks`)
              const isNew = (fields[index] as any).isNew ?? false

              const allSelectedIds =
                watch('marksObtained')?.map((i: any) => i.subjectId)?.filter(Boolean) || []

              const filteredSubjects = (allSubject ?? []).filter((subj: any) => {
                if (subj.id === currentSubjectId) return true
                return !allSelectedIds.includes(subj.id)
              })

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-center p-2 border rounded-md mb-4"
                >
                  {/* SUBJECT */}
                  <div className="col-span-12 md:col-span-5">
                    {!isNew ? (
                      <div className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                        <SubjectNameDisplay subjectId={currentSubjectId} />
                      </div>
                    ) : (
                      <AppCombobox
                        label="Subject"
                        name={`marksObtained.${index}.subjectId`}
                        form={form}
                        options={filteredSubjects}
                        selected={filteredSubjects.find((s: any) => s.id === currentSubjectId) ?? null}
                        onSelect={(subject: any) => {
                          setValue(`marksObtained.${index}.subjectId`, subject?.id ?? '')
                          setValue(`marksObtained.${index}.fullMarks`, subject?.fullMarks ?? 0)
                          setValue(`marksObtained.${index}.marksObtained` as any, 0)
                        }}
                        getLabel={(s: any) => s.subjectName}
                        getValue={(s: any) => s.id}
                      />
                    )}
                  </div>

                  {/* MARKS OBTAINED */}
                  <div className="col-span-12 md:col-span-3">
                    <InputElement
                      label="Marks Obtained"
                      form={form}
                      name={`marksObtained.${index}.marksObtained`}
                      inputType="number"
                      onBlur={handleMarksBlur(index, currentFullMarks)}
                    />
                  </div>

                  {/* FULL MARKS */}
                  <div className="col-span-12 md:col-span-2">
                    <InputElement
                      label="Full Marks"
                      form={form}
                      name={`marksObtained.${index}.fullMarks`}
                      inputType="number"
                      readOnly
                    />
                  </div>

                  {/* REMOVE */}
                  <div className="col-span-12 md:col-span-2 flex justify-center">
                    <button type="button" onClick={() => remove(index)}>
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
                  isNew: true,
                } as any)
              }
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-center mt-6 gap-4">
            <ButtonElement text="Cancel" type="button" onClick={handleClose} />
            <ButtonElement text="Update" type="submit" />
          </div>

        </form>
      </div>
    </div>
  )
}

const SubjectNameDisplay = ({ subjectId }: { subjectId: string }) => {
  const { data } = useGetSubjectById(subjectId)
  return <span>{data?.name}</span>
}

export default EditExamResultForm