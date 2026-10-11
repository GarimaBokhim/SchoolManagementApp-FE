'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { AddClassPayload, ClassResponse } from '../types/IClass'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { useAddClass, useUpdateClass } from '../hooks'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'

type Props = {
  form: UseFormReturn<AddClassPayload>
  onClose: () => void
  classItem?: ClassResponse | null
}

const AddClassForm = ({ form, onClose, classItem }: Props) => {
  const addClass = useAddClass()
  const updateClass = useUpdateClass()
  const { handleError, clearError } = useErrorHandler()

  const [englishProficiency, setEnglishProficiency] = useState<number | null>(
    classItem?.englishProficiency ?? null
  )

  useEffect(() => {
    if (classItem) {
      setEnglishProficiency(classItem.englishProficiency)
      form.setValue('name', classItem.name)
      form.setValue('startTime', classItem.startTime)
      form.setValue('endTime', classItem.endTime)
      form.setValue('batch', classItem.batch)
      form.setValue('englishProficiency', classItem.englishProficiency)
    }
  }, [classItem, form])

  const handleClose = () => {
    form.reset({
      name: '',
      startTime: '',
      endTime: '',
      batch: '',
      englishProficiency: 0,
    })
    setEnglishProficiency(null)
  }

  const onSubmit: SubmitHandler<AddClassPayload> = async (data) => {
    clearError()
    try {
      if (classItem) {
        await updateClass.mutateAsync({
          id: classItem.id,
          payload: {
            name: data.name,
            startTime: data.startTime,
            endTime: data.endTime,
            batch: data.batch,
            englishProficiency: data.englishProficiency,
          },
        })
      } else {
        await addClass.mutateAsync({
          name: data.name,
          startTime: data.startTime,
          endTime: data.endTime,
          batch: data.batch,
          englishProficiency: data.englishProficiency,
        })
      }

      handleClose()
      onClose()
    } catch (error) {
      Toast.error(handleError(error))
    }
  }

  const proficiencyOptions = [
    { id: 1, name: 'IELTS' },
    { id: 2, name: 'TOEFL' },
    { id: 3, name: 'PTE' },
    { id: 4, name: 'DET' },
    { id: 5, name: 'TOEIC' },
    { id: 6, name: 'CELPIP' },
    { id: 7, name: 'OET' },
    { id: 8, name: 'FCE' },
    { id: 9, name: 'CAE' },
    { id: 10, name: 'CPE' },
  ]

  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              {classItem ? 'Edit Class' : 'Add Class'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <InputElement
                label="Name"
                form={form}
                name="name"
                placeholder="Enter Name"
                required
              />

              <InputElement
                label="StartTime"
                form={form}
                name="startTime"
                inputType="time"
                placeholder="Enter Start Time"
                required
              />

              <InputElement
                label="EndTime"
                form={form}
                name="endTime"
                inputType="time"
                placeholder="Enter End Time"
                required
              />

              <InputElement
                label="Batch"
                form={form}
                name="batch"
                placeholder="Enter Batch"
                required
              />

              <AppCombobox
                label="English Proficiency"
                dropdownPositionClass="absolute"
                name="englishProficiency"
                form={form}
                value={englishProficiency}
                options={proficiencyOptions}
                dropDownWidth="w-full"
                selected={
                  proficiencyOptions.find((g) => g.id === englishProficiency) || null
                }
                onSelect={(option) => {
                  setEnglishProficiency(option?.id ?? null)
                  form.setValue('englishProficiency', option?.id ?? 0)
                }}
                getLabel={(o) => o?.name || ''}
                getValue={(o) => o?.id ?? ''}
              />
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={classItem ? 'Update' : 'Submit'} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default AddClassForm
