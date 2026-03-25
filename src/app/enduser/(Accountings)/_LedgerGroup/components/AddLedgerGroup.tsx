/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { ILedgerGroup } from '../types/ILedgerGroup'
import { useAddLedgerGroup } from '../hooks'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { useEffect, useState } from 'react'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useTranslation } from 'react-i18next'
import toast, { Toaster } from 'react-hot-toast'
import { useGetAllMaster } from '../../_Master/hooks'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { Toast } from '@/components/Toast/toast'
import { X } from 'lucide-react'

type Props = {
  form: UseFormReturn<ILedgerGroup>
  onClose: () => void
  selectedMaster?: string
}

const AddLedgerGroupForm = ({ form, onClose, selectedMaster }: Props) => {
  const { t } = useTranslation()
  const addLedgerGroup = useAddLedgerGroup()
  const { data: Masters } = useGetAllMaster()
  const [selectedMasterId, setSelectedMasterId] = useState('')
  const { handleError, clearError } = useErrorHandler()

  useEffect(() => {
    if (selectedMasterId) form.setValue('masterId', selectedMasterId)
  }, [selectedMasterId])
  useEffect(() => {
    if (selectedMaster) {
      setSelectedMasterId(selectedMaster)
    }
  }, [selectedMaster])
  const handleClose = () => {
    onClose()
    form.reset()
    setSelectedMasterId('')
  }
  const onSubmit: SubmitHandler<ILedgerGroup> = async (data) => {
    clearError()
    try {
      await toast.promise(addLedgerGroup.mutateAsync(data), {
        loading: 'Submitting Data',
        success: 'Successfully Added Ledger Group',
      })
      handleClose()
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className=" inset-0 flex  w-full h-full">
        <div className="w-full  h-full p-4  relative dark:text-white">
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg  font-semibold">
                  {t('Add LedgerGroup')}
                </h1>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-red-400 text-2xl hover:text-red-500 "
                >
                  <X strokeWidth={3} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex pt-1 flex-col">
                  <InputElement
                    required
                    label="Name"
                    layout="column"
                    form={form}
                    name="name"
                    placeholder="Enter LedgerGroup name"
                  />
                </div>
                <AppCombobox
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Master"
                  required
                  name="masterId"
                  options={Masters?.Items}
                  value={selectedMasterId}
                  selected={
                    Masters?.Items.find((g) => g.id === selectedMasterId) ||
                    null
                  }
                  onSelect={(group) => {
                    if (group) {
                      setSelectedMasterId(group.id || '')
                    } else {
                      setSelectedMasterId('')
                    }
                  }}
                  getLabel={(g) => g?.Name ?? ''}
                  getValue={(g) => g?.id ?? ''}
                />
              </div>
              <div className="mb-2 flex items-center">
                <InputElement
                  layout="row"
                  form={form}
                  name="isPrimary"
                  inputType="checkbox"
                  customStyle="!border-0 after:!content-none"
                />
                <p className="ml-4 ">Is Primary</p>
              </div>
              <div className="flex justify-center pt-12">
                <ButtonElement type="submit" text="Submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddLedgerGroupForm
