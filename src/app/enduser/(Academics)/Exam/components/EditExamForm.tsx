'use client'

import { SubmitHandler, UseFormReturn, useFieldArray } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { IExam } from '../types/IExams'
import { useEditExam, useGetExamById } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetAllClass } from '../../Class/hooks'
import { useGetSubjectByClassId } from '../../Subject/hooks'

type Props = {
  form: UseFormReturn<IExam>
  onClose: () => void
  ExamId: string
}

const EditExamForm = ({ form, onClose, ExamId }: Props) => {
  const editExam = useEditExam()
  const { handleError, clearError } = useErrorHandler()

  const { data: allClass } = useGetAllClass()
  const { data: examData } = useGetExamById(ExamId)

  const { control, reset, setValue, watch } = form
  const classId = watch('classId')

  const { data: allSubjects } = useGetSubjectByClassId(classId || '')

  const { fields, append, remove, replace } = useFieldArray({
    name: 'examSubjects',
    control,
  })

  const isInitialLoad = useRef(true)

  // Populate form from API
  useEffect(() => {
    if (!examData) return

    reset({
      name: examData.name,
      examDate: examData.examDate,
      classId: examData.classId,
      isfinalExam: examData.isfinalExam,
      examSubjects: examData.examSubjects ?? [],
    })

    replace(examData.examSubjects ?? [])

    isInitialLoad.current = false
  }, [examData, reset, replace])

  // ❌ DO NOT clear subjects automatically on classId change
  // handled manually in onSelect

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit: SubmitHandler<IExam> = async (data) => {
    clearError()

    try {
      await toast.promise(
        editExam.mutateAsync({
          id: ExamId,
          data,
        }),
        {
          loading: 'Updating Exam...',
          success: 'Successfully Updated Exam',
        }
      )

      handleClose()
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
    }
  }

  return (
    <div className="fixed inset-0 z-50 ml-12 md:ml-64 sm:ml-16 xs:ml-0 flex items-center justify-center bg-black/40 p-8 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#27272a] h-full w-[95vw] max-h-[90vh] overflow-auto rounded-lg p-6 shadow-lg dark:text-white">
        <fieldset>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Update Exam</h1>
            <button onClick={handleClose}>
              <X />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputElement
                label="Exam Name"
                form={form}
                name="name"
                required
              />

              <InputElement
                label="Exam Date"
                form={form}
                name="examDate"
                inputType="date"
              />

              {/* Class */}
              <AppCombobox
                dropDownWidth="w-[20rem]"
                label="Class"
                name="classId"
                form={form}
                dropdownPositionClass="absolute"
                value={classId}
                options={allClass?.Items ?? []}
                selected={
                  allClass?.Items?.find(
                    (e) => String(e.id) === String(classId)
                  ) || null
                }
                onSelect={(cls) => {
                  const id = String(cls?.id ?? '')

                  setValue('classId', id, { shouldValidate: true })

                  // ✅ clear subjects ONLY when user changes class
                  setValue('examSubjects', [])
                  replace([])
                }}
                getLabel={(e) => e?.name ?? ''}
                getValue={(e) => String(e?.id)}
              />
            </div>

            {/* Subjects Section */}
            <div className="mt-6">
              <h2 className="font-semibold mb-3">Exam Subjects</h2>

              {!classId ? (
                <p className="text-sm text-gray-500">
                  Please select a class first
                </p>
              ) : (
                fields.map((field, index) => {
                  const currentSubjectId = watch(
                    `examSubjects.${index}.subjectId`
                  )

                  const selectedIds =
                    watch('examSubjects')?.map((s) =>
                      String(s.subjectId)
                    ) ?? []

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 items-start mb-3"
                    >
                      {/* Subject */}
                      <AppCombobox
                        dropDownWidth="w-[20rem]"
                        label="Subject"
                        name={`examSubjects.${index}.subjectId`}
                        form={form}
                        dropdownPositionClass="absolute"
                        value={currentSubjectId}
                        options={(allSubjects ?? []).filter((subj) => {
                          const subjId = String(subj.id)
                          return (
                            subjId === String(currentSubjectId) ||
                            !selectedIds.includes(subjId)
                          )
                        })}
                        selected={
                          allSubjects?.find(
                            (subj) =>
                              String(subj.id) ===
                              String(currentSubjectId)
                          ) || null
                        }
                        onSelect={(subject) => {
                          setValue(
                            `examSubjects.${index}.subjectId`,
                            String(subject?.id ?? ''),
                            { shouldValidate: true }
                          )
                        }}
                        getLabel={(s) => s?.subjectName ?? ''}
                        getValue={(s) => String(s?.id)}
                      />

                      {/* Full Marks */}
                      <InputElement
                        label="Full Marks"
                        form={form}
                        name={`examSubjects.${index}.fullMarks`}
                        type="number"
                        required
                      />

                      {/* Pass Marks */}
                      <InputElement
                        label="Pass Marks"
                        form={form}
                        name={`examSubjects.${index}.passMarks`}
                        type="number"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 h-10 self-end"
                      >
                        Remove
                      </button>
                    </div>
                  )
                })
              )}

              <button
                type="button"
                onClick={() =>
                  append({
                    subjectId: '',
                    fullMarks: 0,
                    passMarks: 0,
                  })
                }
                className="mt-2 px-3 py-1 bg-teal-500 text-white rounded"
                disabled={!classId}
              >
                Add Subject
              </button>
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text="Update" />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default EditExamForm