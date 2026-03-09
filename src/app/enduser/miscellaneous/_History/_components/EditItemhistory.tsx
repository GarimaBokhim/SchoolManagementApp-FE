/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { X } from 'lucide-react'
import { IHistory } from '../types/IHistory'
import { useEditHistory, useGetHistoryById } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'
import { useGetAllSchoolItems } from '../../_SchoolItem/hooks'
import { useEffect, useState } from 'react'
import { ISchoolItem } from '../../_SchoolItem/types/ISchoolItem'

type Props = {
  historyId: string
  form: UseFormReturn<IHistory>
  onClose: () => void
}

const EditHistoryForm = ({ historyId, form, onClose }: Props) => {
  const editHistory = useEditHistory()
  const { data: historyData } = useGetHistoryById(historyId)

  const { handleError, clearError } = useErrorHandler()
  const { data: allSchoolItem } = useGetAllSchoolItems()

  const [selectedSchoolItemId, setSelectedSchoolItemId] = useState('')
  const [prevItemStatus, setPrevItemStatus] = useState(0)
  const [currentStatus, setCurrentStatus] = useState(0)
  const [selectedSchoolItem, setSelectedSchoolItem] = useState<ISchoolItem>()

  useEffect(() => {
    if (historyData) {
      form.reset({
        schoolItemId: historyData.schoolItemId,
        previousStatus: historyData.previousStatus,
        currentStatus: historyData.currentStatus,
        remarks: historyData.remarks,
      })

      setSelectedSchoolItemId(historyData.schoolItemId)
      setPrevItemStatus(historyData.previousStatus)
      setCurrentStatus(historyData.currentStatus)
    }
  }, [historyData, form])

  useEffect(() => {
    if (selectedSchoolItem) {
      setPrevItemStatus(selectedSchoolItem.itemStatus)
    }
  }, [selectedSchoolItem])

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit: SubmitHandler<IHistory> = async (data) => {
    clearError()

    try {
      await toast.promise(
        editHistory.mutateAsync({
          id: historyId,
          data: data,
        }),
        {
          loading: 'Updating History...',
          success: 'Successfully updated History',
        }
      )

      handleClose()
    } catch (error) {
      const errorMsg = handleError(error)
      Toast.error(errorMsg)
    }
  }

  const statusOptions = [
    { id: 1, name: 'Available' },
    { id: 2, name: 'Damaged' },
    { id: 3, name: 'Replaced' },
    { id: 4, name: 'Lost' },
    { id: 5, name: 'Disposed' },
  ]

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-full bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit History</h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-3xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* School Item */}
              <AppCombobox
                value={selectedSchoolItemId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="School Item"
                name="schoolItemId"
                form={form}
                required
                options={allSchoolItem?.Items}
                selected={
                  allSchoolItem?.Items?.find(
                    (g) => g.id === selectedSchoolItemId
                  ) || null
                }
                onSelect={(item) => {
                  setSelectedSchoolItemId(item?.id ?? '')
                  if (item) setSelectedSchoolItem(item)
                }}
                getLabel={(g) => g?.name ?? ''}
                getValue={(g) => g?.id ?? ''}
              />

              {/* Previous Status */}
              <AppCombobox
                label="Previous Item Status"
                dropdownPositionClass="absolute"
                name="previousStatus"
                form={form}
                value={prevItemStatus}
                options={statusOptions}
                dropDownWidth="w-full"
                selected={
                  statusOptions.find((g) => g.id === prevItemStatus) || null
                }
                onSelect={(option) => setPrevItemStatus(option?.id ?? 0)}
                getLabel={(o) => o?.name || ''}
                getValue={(o) => o?.id ?? ''}
              />

              {/* Current Status */}
              <AppCombobox
                label="Current Item Status"
                dropdownPositionClass="absolute"
                name="currentStatus"
                form={form}
                value={currentStatus}
                options={statusOptions}
                dropDownWidth="w-full"
                selected={
                  statusOptions.find((g) => g.id === currentStatus) || null
                }
                onSelect={(option) => setCurrentStatus(option?.id ?? 0)}
                getLabel={(o) => o?.name || ''}
                getValue={(o) => o?.id ?? ''}
              />

              {/* Remarks */}
              <InputElement
                label="Remarks"
                form={form}
                name="remarks"
                required
                placeholder="Enter Remarks"
              />
            </div>

            <div className="flex justify-center mt-8">
              <ButtonElement
                type="submit"
                text="Update"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  )
}

export default EditHistoryForm
