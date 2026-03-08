'use client'

import { SubmitHandler, UseFormReturn, useFieldArray } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { X } from 'lucide-react'
import { IClass } from '../types/IClass'
import { useAddClass } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetAllSubjects } from '../../Subject/hooks'

type Props = {
  form: UseFormReturn<IClass>
  onClose: () => void
}

const AddClassForm = ({ form, onClose }: Props) => {
  const addClass = useAddClass()
  const { data: allsubjects } = useGetAllSubjects()
  const { handleError, clearError } = useErrorHandler()

  const { fields, append, remove } = useFieldArray({
    name: 'subjects',
    control: form.control,
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit: SubmitHandler<IClass> = async (data) => {
    clearError()
    try {
      await toast.promise(addClass.mutateAsync(data), {
        loading: 'Adding Class...',
        success: 'Class added successfully!',
      })
      handleClose()
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
    }
  }

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-[100%] bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Class
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <InputElement
                label="Class Name"
                form={form}
                name="name"
                placeholder="Enter Name"
                required
              />
              <InputElement
                label="classSymbol"
                form={form}
                name="classSymbol"
                placeholder="Enter Class Symbol"
              />
            </div>

            <div className="mt-6">
              <h2 className="font-semibold mb-2">Subjects</h2>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 mb-2 items-end border-b border-gray-200 pb-2"
                >
                  <InputElement
                    label="Subject Name"
                    form={form}
                    name={`subjects.${index}.name`}
                    placeholder="Enter Subject Name"
                    required
                    className="w-48"
                  />
                  <InputElement
                    label="Code"
                    form={form}
                    name={`subjects.${index}.code`}
                    placeholder="Enter Code"
                    required
                    className="w-32"
                  />
                  <InputElement
                    label="Credit Hours"
                    form={form}
                    name={`subjects.${index}.creditHours`}
                    placeholder="Credit Hours"
                    type="number"
                    required
                    className="w-32"
                  />
                  <InputElement
                    label="Description"
                    form={form}
                    name={`subjects.${index}.description`}
                    placeholder="Description"
                    className="w-48"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 mt-6"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  append({
                    name: '',
                    code: '',
                    creditHours: 0,
                    classId: '',
                    description: '',
                  })
                }
                className="mt-2 px-3 py-1 bg-teal-500 text-white rounded"
              >
                Add Subject
              </button>
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

export default AddClassForm
