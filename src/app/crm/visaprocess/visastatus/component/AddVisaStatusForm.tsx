'use client'

import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { X } from 'lucide-react'
import { useAddVisaStatus } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { IAddVisaStatus } from '../types/IVisaStatus'

const VISA_STATUS_TYPES = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Approved' },
    { value: 3, label: 'Rejected' },
    { value: 4, label: 'Under Review' },
]

type Props = {
    form: UseFormReturn<IAddVisaStatus>
    onClose: () => void
}

const AddVisaStatusForm = ({ form, onClose }: Props) => {
    const addVisaStatus = useAddVisaStatus()
    const { handleError, clearError } = useErrorHandler()

    const handleClose = () => {
        form.reset()
        onClose()
    }

    const onSubmit: SubmitHandler<IAddVisaStatus> = async (data) => {
        clearError()
        try {
            await toast.promise(
                addVisaStatus.mutateAsync({
                    name: data.name,
                    visaStatusType: Number(data.visaStatusType),
                }),
                {
                    loading: 'Adding Visa Status...',
                    success: 'Visa Status added successfully!',
                    error: 'Failed to add Visa Status',
                }
            )
            handleClose()
        } catch (error) {
            const errorMsg = handleError(error)
            toast.error(errorMsg)
        }
    }

    return (
        <div className="fixed inset-0 z-50 ml-[17%] bg-white dark:bg-[#27272a] overflow-y-auto">

            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-[#27272a] dark:border-gray-700">
                <h1 className="text-xl font-semibold dark:text-white">
                    Add Visa Status
                </h1>
                <button
                    onClick={handleClose}
                    className="text-red-500 hover:text-red-600"
                >
                    <X size={22} />
                </button>
            </div>

            {/* CONTENT */}
            <div className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Status Name */}
                        <InputElement
                            label="Status Name"
                            name="name"
                            inputType="text"
                            form={form}
                            rules={{ required: 'Status name is required' }}
                        />

                        {/* Visa Status Type */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Visa Status Type
                            </label>
                            <select
                                {...form.register('visaStatusType', {
                                    required: 'Visa status type is required',
                                    valueAsNumber: true,
                                })}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-[#353535] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select type</option>
                                {VISA_STATUS_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {form.formState.errors.visaStatusType && (
                                <p className="text-xs text-red-500">
                                    {form.formState.errors.visaStatusType.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="flex justify-center mt-8">
                        <ButtonElement type="submit" text="Submit" />
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddVisaStatusForm
