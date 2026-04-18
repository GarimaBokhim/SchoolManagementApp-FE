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
import { useGetSubjectByClassId } from '../../Subject/hooks'
import { IStudent } from '@/app/enduser/(StudentManagement)/Student/types/IStudents'

type Props = {
  form: UseFormReturn<IExamResult>
  onClose: () => void
  ExamResultId: string
}

const EditExamResultForm = ({ form, onClose, ExamResultId }: Props) => {
  const editExamResult = useEditExamResult()
  const { handleError, clearError } = useErrorHandler()

  const { control, reset } = form

  const { data: ExamResultData } = useGetExamResultById(ExamResultId)
  const [selectedClassId, setSelectedClassId] = useState<string | null>('')
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>()

  useEffect(() => {
    if (selectedStudent) {
      setSelectedClassId(selectedStudent.classId || '')
    }
  }, [selectedStudent])

  const { data: allExam } = useGetAllExams()
  const { data: allStudents } = useGetAllStudents('?IsPagination=false')
  const { data: allSubject } = useGetSubjectByClassId(selectedClassId || '')
  const [, setSelectedSubjectIds] = useState<{ [key: number]: string | null }>({})

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'marksObtained',
  })

  useEffect(() => {
    if (!ExamResultData) return

    reset({
      examId: ExamResultData.examId,
      studentId: ExamResultData.studentId,
      remarks: ExamResultData.remarks,
      marksObtained: ExamResultData.marksObtained ?? [],
    })

    setSelectedExamId(ExamResultData.examId)
    setSelectedStudentId(ExamResultData.studentId)

    const student = allStudents?.Items?.find((s) => s.id === ExamResultData.studentId)
    if (student?.classId) {
      setSelectedClassId(student.classId)
    }

    replace(ExamResultData.marksObtained ?? [])

    const initialSubjects: { [key: number]: string } = {}
    ExamResultData.marksObtained?.forEach((item, index) => {
      initialSubjects[index] = item.subjectId
    })
    setSelectedSubjectIds(initialSubjects)
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
                getLabel={(s) => s?.firstName ?? ''}
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

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-center p-2 border border-transparent rounded-md mb-4"
                >
                  {/* Subject dropdown — 5 cols */}
                  <div className="col-span-12 md:col-span-5">
                    <AppCombobox
                      dropDownWidth="w-full"
                      label="Subject"
                      name={`marksObtained.${index}.subjectId`}
                      form={form}
                      dropdownPositionClass="absolute"
                      options={allSubject ?? []}
                      value={form.watch(`marksObtained.${index}.subjectId`)}
                      selected={
                        allSubject?.find(
                          (subj) => subj.id === form.watch(`marksObtained.${index}.subjectId`)
                        ) || null
                      }
                      onSelect={(subject) => {
                        const id = subject?.id ?? ''
                        form.setValue(`marksObtained.${index}.subjectId`, id, {
                          shouldValidate: true,
                        })
                        setSelectedSubjectIds((prev) => ({ ...prev, [index]: id }))
                      }}
                      getLabel={(s) => s?.subjectName ?? ''}
                      getValue={(s) => s?.id ?? ''}
                    />
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

                  {/*
                   * Full Marks field is intentionally hidden from the UI.
                   * The field stays registered in the form schema so the
                   * existing API payload shape is not broken.
                   */}
                  <input
                    type="hidden"
                    {...form.register(`marksObtained.${index}.fullMarks`)}
                  />

                  {/* Remove row — 2 cols */}
                  <div className="col-span-12 md:col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        remove(index)
                        setSelectedSubjectIds((prev) => {
                          const updated = { ...prev }
                          delete updated[index]
                          return updated
                        })
                      }}
                      className="text-red-400 hover:text-red-600 text-xl font-bold"
                    >
                      <X />
                    </button>
                  </div>
                </div>
              ))}

              <ButtonElement
                type="button"
                text="Add Subject"
                onClick={() =>
                  append({
                    subjectId: '',
                    marksObtained: 0,
                    fullMarks: 0, // kept in payload, not shown in UI
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

export default EditExamResultForm