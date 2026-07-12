'use client'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { ISchool } from '../types/ISchool'
import { useAddSchool, useGetAllFiscalYear } from '../hooks'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { useGetAllInstitution } from '@/app/SuperAdmin/institutionSetup/Institution/hooks'
import { AppCombobox } from '@/components/Input/ComboBox'

import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import toast from 'react-hot-toast'
import { useGetAllAcademicYear } from '@/app/enduser/(StudentManagement)/_Registration/hooks'

type Props = {
    form: UseFormReturn<ISchool>
    onClose: () => void
}

const AddSchoolForm = ({ form, onClose }: Props) => {
    const addSchool = useAddSchool()
    const { data: institution } = useGetAllInstitution()
    const { data: fiscalYear } = useGetAllFiscalYear()
    const { data: academicYear } = useGetAllAcademicYear()
    const { handleError, clearError } = useErrorHandler()

    const [schoolLogo, setSchoolLogo] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Handle form submission
    const onSubmit: SubmitHandler<ISchool> = async (data) => {
        clearError()
        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (value === null || value === undefined) return
                if (key === 'logoUrl' && value instanceof File) {
                    formData.append('logoUrl', value)
                } else {
                    formData.append(key, value.toString())
                }
            })

            await toast.promise(addSchool.mutateAsync(formData), {
                loading: 'Adding School...',
                success: 'Successfully added School',
            })
            onClose()
        } catch (error) {
            const errorMsg = handleError(error)
            Toast.error(errorMsg)
        }
    }

    // File selection
    const handleImageClick = () => fileInputRef.current?.click()
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            form.setValue('logoUrl', file)
            const reader = new FileReader()
            reader.onloadend = () => setSchoolLogo(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto ml-56 md:ml-64 sm:ml-16">
            <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[50%] xl:max-w-[40%] bg-white rounded-xl shadow-2xl p-6 m-4">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-lg font-semibold">Add School</h1>
                        <button type="button" onClick={onClose} className="text-red-400 hover:text-red-500">
                            <X strokeWidth={3} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left column: Inputs */}
                        <div className="space-y-4">
                            <InputElement label="Name" layout="column" form={form} name="name" placeholder="Enter School name" />
                            <InputElement label="Address" layout="column" form={form} name="address" placeholder="Enter Address" />
                            <InputElement label="Email" layout="column" form={form} name="email" type="email" placeholder="Enter Email" />
                            <InputElement label="Short Name" layout="column" form={form} name="shortName" placeholder="Enter Short Name" />
                            <InputElement label="Contact Number" layout="column" form={form} name="contactNumber" placeholder="Enter Contact Number" />
                            <InputElement label="Contact Person" layout="column" form={form} name="contactPerson" placeholder="Enter Contact Person" />
                            <InputElement label="Pan" layout="column" form={form} name="pan" placeholder="Enter Pan" />
                        </div>

                        {/* Right column: File & Comboboxes */}
                        <div className="space-y-4">
                            {/* Logo Upload */}
                            <div className="flex flex-col items-center">
                                <div
                                    onClick={handleImageClick}
                                    className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-teal-500 transition"
                                >
                                    {schoolLogo ? (
                                        <img src={schoolLogo} alt="School Logo" className="object-cover w-full h-full" />
                                    ) : (
                                        <span className="text-gray-400 text-sm">Click to add</span>
                                    )}
                                </div>
                                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                            </div>

                            {/* Institution */}
                            <AppCombobox
                                required
                                form={form}
                                name="institutionId"
                                label="Institution"
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-50"
                                options={institution?.Items ?? []}
                                selected={institution?.Items.find((g) => g.id === form.watch('institutionId')) || null}
                                onSelect={(item) => form.setValue('institutionId', item?.id || '')}
                                getLabel={(g) => g?.name || ''}
                                getValue={(g) => g?.id ?? ''}
                            />

                            {/* Fiscal Year */}
                            <AppCombobox
                                required
                                form={form}
                                name="fiscalYearId"
                                label="Fiscal Year"
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-50"
                                options={fiscalYear?.Items ?? []}
                                selected={fiscalYear?.Items.find((g) => g.Id === form.watch('fiscalYearId')) || null}
                                onSelect={(item) => form.setValue('fiscalYearId', item?.Id || '')}
                                getLabel={(g) => g?.FyName || ''}
                                getValue={(g) => g?.Id ?? ''}
                            />

                            {/* Academic Year */}
                            <AppCombobox
                                required
                                form={form}
                                name="academicYearId"
                                label="Academic Year"
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-50"
                                options={academicYear?.Items ?? []}
                                selected={academicYear?.Items.find((g) => g.Id === form.watch('academicYearId')) || null}
                                onSelect={(item) => form.setValue('academicYearId', item?.Id || '')}
                                getLabel={(g) => g?.Name || ''}
                                getValue={(g) => g?.Id ?? ''}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <ButtonElement type="submit" text="Submit" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddSchoolForm