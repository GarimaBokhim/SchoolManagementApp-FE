'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import {
  AddTrainingRegistrationPayload,
  TrainingRegistrationResponse,
} from '../types/ITrainingRegistration'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import {
  useAddTrainingRegistration,
  useGetAllApplicants,
  useGetAllConsultancyClass,
  useUpdateTrainingRegistration,
} from '../hooks'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'

type Props = {
  form: UseFormReturn<AddTrainingRegistrationPayload>
  onClose: () => void
  trainingRegistration?: TrainingRegistrationResponse | null
}

const AddTrainingRegistrationForm = ({
  form,
  onClose,
  trainingRegistration,
}: Props) => {
  const addTrainingRegistration = useAddTrainingRegistration()
  const updateTrainingRegistration = useUpdateTrainingRegistration()
  const { handleError, clearError } = useErrorHandler()
  const { data: allapplicant } = useGetAllApplicants()
  const { data: allConsultancyClass } = useGetAllConsultancyClass()

  const [sellectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    trainingRegistration?.applicantId ?? ''
  )
  const [sellectedConsultancyClassId, setSellectedConsultancyClassId] = useState<
    string | null
  >(trainingRegistration?.consultancyClassId ?? '')

  useEffect(() => {
    if (trainingRegistration) {
      form.setValue('applicantId', trainingRegistration.applicantId)
      form.setValue('consultancyClassId', trainingRegistration.consultancyClassId)
      form.setValue('registeredAt', trainingRegistration.registeredAt)
      setSelectedApplicantId(trainingRegistration.applicantId)
      setSellectedConsultancyClassId(trainingRegistration.consultancyClassId)
    }
  }, [trainingRegistration, form])

  const handleClose = () => {
    form.reset({
      applicantId: '',
      consultancyClassId: '',
      registeredAt: '',
    })
    setSelectedApplicantId(null)
    setSellectedConsultancyClassId(null)
  }

  const onSubmit: SubmitHandler<AddTrainingRegistrationPayload> = async (data) => {
    clearError()
    const applicantId = String(data.applicantId ?? '').trim()
    if (!applicantId) {
      Toast.error('Please select applicant')
      return
    }

    const consultancyClassId = String(data.consultancyClassId ?? '').trim()
    if (!consultancyClassId) {
      Toast.error('Please select Consultancy Class')
      return
    }

    try {
      if (trainingRegistration) {
        await updateTrainingRegistration.mutateAsync({
          id: trainingRegistration.id,
          payload: {
            applicantId,
            consultancyClassId,
            registeredAt: data.registeredAt,
          },
        })
      } else {
        await addTrainingRegistration.mutateAsync({
          applicantId,
          consultancyClassId,
          registeredAt: data.registeredAt,
        })
      }

      handleClose()
      onClose()
    } catch (error) {
      Toast.error(handleError(error))
    }
  }

  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              {trainingRegistration ? 'Edit Training Registration' : 'Add TrainingRegistration'}
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
              <AppCombobox
                value={sellectedApplicantId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute z-20"
                label="Applicant"
                name="applicantId"
                form={form}
                required
                options={allapplicant || []}
                selected={
                  allapplicant?.find((g) => g.id === sellectedApplicantId) || null
                }
                onSelect={(group) => {
                  if (group) {
                    const id = group.id ?? ''
                    setSelectedApplicantId(id || null)
                    form.setValue('applicantId', id, { shouldValidate: true })
                  } else {
                    setSelectedApplicantId(null)
                    form.setValue('applicantId', '', { shouldValidate: true })
                  }
                }}
                getLabel={(g) => g?.fullName ?? ''}
                getValue={(g) => g?.id ?? ''}
              />

              <AppCombobox
                value={sellectedConsultancyClassId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute z-20"
                label="ConsultancyClass"
                name="consultancyClassId"
                form={form}
                required
                options={allConsultancyClass || []}
                selected={
                  allConsultancyClass?.find(
                    (g) => g.id === sellectedConsultancyClassId
                  ) || null
                }
                onSelect={(group) => {
                  if (group) {
                    const id = group.id ?? ''
                    setSellectedConsultancyClassId(id || null)
                    form.setValue('consultancyClassId', id, { shouldValidate: true })
                  } else {
                    setSellectedConsultancyClassId(null)
                    form.setValue('consultancyClassId', '', { shouldValidate: true })
                  }
                }}
                getLabel={(g) => g?.name ?? ''}
                getValue={(g) => g?.id ?? ''}
              />

              <InputElement
                label="RegisteredAt"
                form={form}
                name="registeredAt"
                inputType="date"
                placeholder="Enter registeredAt"
                required
              />
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement
                type="submit"
                text={trainingRegistration ? 'Update' : 'Submit'}
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default AddTrainingRegistrationForm
