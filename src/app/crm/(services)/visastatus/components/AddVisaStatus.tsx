'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { useAddVisaStatus, useUpdateVisaStatus } from '../hooks'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'
import { AddVisaStatusPayload, UpdateVisaStatusResponse } from '../types/IVisaStatus'

type Props = {
  form: UseFormReturn<AddVisaStatusPayload>
  onClose: () => void
  visaStatus?: UpdateVisaStatusResponse | null
}

const AddVisaStatusForm = ({ form, onClose, visaStatus }: Props) => {
  const addVisaStatus = useAddVisaStatus()
  const updateVisaStatus = useUpdateVisaStatus()
  const { handleError, clearError } = useErrorHandler()

  const [visaStatusType, setVisaStatusType] = useState<number | null>(
    visaStatus?.visaStatusType ?? null
  )

  useEffect(() => {
    if (visaStatus) {
      setVisaStatusType(visaStatus.visaStatusType)
      form.setValue('name', visaStatus.name)
      form.setValue('visaStatusType', visaStatus.visaStatusType)
    }
  }, [visaStatus, form])

  const handleClose = () => {
    form.reset({
      name: '',
      visaStatusType: 0,
    })
    setVisaStatusType(null)
  }

  const onSubmit: SubmitHandler<AddVisaStatusPayload> = async (data) => {
    clearError()

    try {
      if (visaStatus) {
        await updateVisaStatus.mutateAsync({
          id: visaStatus.id,
          payload: {
            name: data.name,
            visaStatusType: data.visaStatusType,
          },
        })
      } else {
        await addVisaStatus.mutateAsync({
          name: data.name,
          visaStatusType: data.visaStatusType,
        })
      }

      handleClose()
      onClose()
    } catch (error) {
      Toast.error(handleError(error))
    }
  }

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              {visaStatus ? 'Edit Visa Status' : 'Add Visa Status'}
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
              <InputElement
                label="Name"
                form={form}
                name="name"
                placeholder="Enter Name"
              />

              <AppCombobox
                label="Visa Type"
                dropdownPositionClass="absolute"
                name="visaStatusType"
                form={form}
                value={visaStatusType}
                options={[
                  { id: 1, name: 'Application' },
                  { id: 2, name: 'Documents' },
                ]}
                dropDownWidth="w-full"
                selected={
                  [
                    { id: 1, name: 'Application' },
                    { id: 2, name: 'Documents' },
                  ].find((g) => g.id === visaStatusType) || null
                }
                onSelect={(option) => {
                  setVisaStatusType(option?.id ?? null)
                  form.setValue('visaStatusType', option?.id ?? 0)
                }}
                getLabel={(o) => o?.name || ''}
                getValue={(o) => o?.id ?? ''}
              />
            </div>

            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={visaStatus ? 'Update' : 'Submit'} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default AddVisaStatusForm

