'use client'

import { SubmitHandler, UseFormReturn, useFieldArray } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { X } from 'lucide-react'
import { IExamResult } from '../types/IExamResults'
import { useAddExamResult } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'
import { ChangeEvent, useState } from 'react'
import { useGetAllExams } from '../../Exam/hooks'
import { useGetStudentByClass } from '@/app/enduser/(StudentManagement)/Student/hooks'
import { useGetSubjectByClassId } from '../../Subject/hooks'
import { useGetAllClass } from '../../Class/hooks'

type Props = {
  form: UseFormReturn<IExamResult>
  onClose: () => void
}

const AddExamResultForm = ({ form, onClose }: Props) => {
  const addExamResult = useAddExamResult()
  const { handleError, clearError } = useErrorHandler()
  const { data: allClass } = useGetAllClass()
  const { control } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'marksObtained',
  })

  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<{ [key: number]: string | null }>({})
  const [selectedFullMarks, setSelectedFullMarks] = useState<{ [key: number]: number | undefined }>({})
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>('')

  const { data: allExam } = useGetAllExams()
  const { data: allStudents } = useGetStudentByClass(selectedClassId || '')
  const { data: allSubject } = useGetSubjectByClassId(selectedClassId, selectedExamId ?? undefined)

  const handleClose = () => {
    form.reset()
    setSelectedClassId('')
    setSelectedExamId(null)
    setSelectedStudentId(null)
    setSelectedSubjectIds({})
    setSelectedFullMarks({})
    onClose()
  }

  const onSubmit: SubmitHandler<IExamResult> = async (data) => {
    clearError()
    try {
      await toast.promise(addExamResult.mutateAsync(data), {
        loading: 'Adding ExamResult...',
        success: 'Successfully added ExamResult',
      })
      handleClose()
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
    }
  }

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-full bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Exam Result
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
              {/* Exam ComboBox */}
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
                  setSelectedClassId(exam?.classId)
                  form.setValue('examId', id)
                }}
                getLabel={(e) => e?.name ?? ''}
                getValue={(e) => e?.id ?? ''}
              />

              {/* Student ComboBox */}
              <AppCombobox
                dropDownWidth="w-[25rem]"
                label="Student Name"
                name="studentId"
                form={form}
                dropdownPositionClass="absolute"
                value={selectedStudentId}
                options={allStudents?.Items ?? []}
                selected={allStudents?.Items.find((s) => s.id === selectedStudentId) || null}
                onSelect={(student) => {
                  const id = student?.id ?? ''
                  setSelectedStudentId(id)
                  form.setValue('studentId', id)
                }}
                getLabel={(s) => `${s?.firstName ?? ''} ${s?.lastName ?? ''}`.trim()}
                getValue={(s) => s?.id ?? ''}
                renderOptionExtra={(s) => (
                  <div>
                    {allClass?.Items.find((i) => i.id === s?.classId)?.name}
                  </div>
                )}
              />

              <InputElement
                label="Remark"
                form={form}
                name="remarks"
                type="string"
                placeholder="Enter remark"
              />
            </div>

            {/* Subject Marks */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-3">Subject Marks</h2>

              {fields.map((field, index: number) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md mb-4 relative"
                >
                  {/* Subject ComboBox */}
                  <AppCombobox
                    dropDownWidth="w-[25rem]"
                    label="Subject"
                    name={`marksObtained.${index}.subjectId`}
                    form={form}
                    dropdownPositionClass="absolute"
                    value={selectedSubjectIds[index] ?? ''}
                    options={(allSubject ?? []).filter((subj) => {
                      const currentId = selectedSubjectIds[index]
                      const selectedIds = Object.values(selectedSubjectIds)
                      return subj.id === currentId || !selectedIds.includes(subj.id)
                    })}
                    selected={allSubject?.find((subj) => subj.id === selectedSubjectIds[index]) || null}
                    onSelect={(subject) => {
                      const id = subject?.id ?? ''
                      const fullMarksValue = subject?.fullMarks ?? 0

                      form.setValue(`marksObtained.${index}.subjectId`, id, { shouldValidate: true })
                      form.setValue(`marksObtained.${index}.fullMarks`, fullMarksValue, { shouldValidate: true })
                      // Reset marks obtained when subject changes
                      form.setValue(`marksObtained.${index}.marksObtained`, 0, { shouldValidate: true })

                      setSelectedFullMarks((prev) => ({ ...prev, [index]: fullMarksValue }))
                      setSelectedSubjectIds((prev) => ({ ...prev, [index]: id }))
                    }}
                    getLabel={(s) => s?.subjectName ?? ''}
                    getValue={(s) => s?.id ?? ''}
                  />

                  {/* Marks Obtained Input */}
                  <div className="mt-1">
                    <InputElement
                      label="Marks Obtained"
                      form={form}
                      name={`marksObtained.${index}.marksObtained`}
                      inputType="number"
                      placeholder="Enter marks"
                      onBlur={(e: ChangeEvent<HTMLInputElement>) => {
                        const value = Number(e.target.value)
                        const max = selectedFullMarks[index]

                        if (max !== undefined && value > max) {
                          alert(`Obtained marks cannot exceed full marks (${max})`)
                          form.setValue(
                            `marksObtained.${index}.marksObtained`,
                            max,
                            { shouldValidate: true }
                          )
                        }
                      }}
                    />
                  </div>

                  {/* Full Marks Input */}
                  <div className="mt-1">
                    <InputElement
                      label="Full Marks"
                      form={form}
                      name={`marksObtained.${index}.fullMarks`}
                      inputType="number"
                      placeholder="Full marks"
                      readOnly
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => {
                      remove(index)
                      setSelectedSubjectIds((prev) => {
                        const updated = { ...prev }
                        delete updated[index]
                        return updated
                      })
                      setSelectedFullMarks((prev) => {
                        const updated = { ...prev }
                        delete updated[index]
                        return updated
                      })
                    }}
                    className="absolute right-[-4] top-6 text-red-400 hover:text-red-600"
                  >
                    <X />
                  </button>
                </div>
              ))}

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

export default AddExamResultForm