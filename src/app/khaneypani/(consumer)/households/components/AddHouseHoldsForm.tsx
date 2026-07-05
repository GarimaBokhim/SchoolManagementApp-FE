'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AddHouseHoldsPayload } from '../types/IHouseHolds'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { useAddHouseHolds, useGetAllHouseHolds } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'

type Props = {
    form: UseFormReturn<AddHouseHoldsPayload>
    onClose: () => void
}
const AddHouseHoldsForm = ({ form, onClose }: Props) => {
    const addHouseHolds = useAddHouseHolds()
    const { handleError, clearError } = useErrorHandler()

    const handleClose = () => {
        form.reset({
            consumerId: '',
            consumerName: '',
            meterNumber: '',
            familyMember: 0,
            contactNumber: '',
            email: '',
            provinceId: 0,
            districtId: 0,
            municipalityId: 0,
            vdcId: 0,
            wardnumber: 0,
            tole: '',
            registrationDate: ''
        })
    }

    const onSubmit: SubmitHandler<AddHouseHoldsPayload> = async (data) => {
        clearError()
        try {
            await addHouseHolds.mutateAsync({
                consumerId: data.consumerId,
                consumerName: data.consumerName,
                meterNumber: data.meterNumber,
                familyMember: data.familyMember,
                contactNumber: data.contactNumber,
                email: data.email,
                provinceId: data.provinceId,
                districtId: data.districtId,
                municipalityId: data.municipalityId,
                vdcId: data.vdcId,
                wardnumber: data.wardnumber,
                tole: data.tole,
                registrationDate: data.registrationDate,
            })

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
                            Add HouseHolds
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
                                label="Consumer No"
                                form={form}
                                name="consumerId"
                                placeholder="Enter consumerNo"
                                required
                            />

                            <InputElement
                                label="ConsumerName"
                                form={form}
                                name="consumerName"
                                placeholder="Enter consumerName"
                                required
                            />

                            <InputElement
                                label="MeterNumber"
                                form={form}
                                name="meterNumber"
                                placeholder="Enter MeterNumber"
                                required
                            />

                            <InputElement
                                label="FamilyMember"
                                form={form}
                                name="familyMember"
                                placeholder="Enter Batch"
                                inputType="number"
                                required
                            />

                            <InputElement
                                label="Contact No"
                                form={form}
                                name="contactNumber"
                                placeholder="Enter ContactNumber"
                                required
                            />

                            <InputElement
                                label="Email"
                                form={form}
                                name="email"
                                placeholder="Enter Email"
                                required
                            />

                            <InputElement
                                label="Province"
                                form={form}
                                name="provinceId"
                                placeholder="Enter Province"
                                required
                            />

                            <InputElement
                                label="District"
                                form={form}
                                name="districtId"
                                placeholder="Enter District"
                                required
                            />

                            <InputElement
                                label="Municipality"
                                form={form}
                                name="municipalityId"
                                placeholder="Enter Municipality"
                                required
                            />

                            <InputElement
                                label="VDC"
                                form={form}
                                name="vdcId"
                                placeholder="Enter Vdc"
                                required
                            />

                            <InputElement
                                label="WardNo"
                                form={form}
                                name="wardnumber"
                                placeholder="Enter Vdc"
                                required
                            />


                            <InputElement
                                label="Tole"
                                form={form}
                                name="tole"
                                placeholder="Enter Tole"
                                required
                            />


                            <InputElement
                                label="Registration Date"
                                form={form}
                                name="registrationDate"
                                placeholder="Enter Registration Date"
                                required
                            />


                        </div>
                        <div className="flex justify-center mt-6">
                            <ButtonElement type="submit" text={'Submit'} />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    )
}

export default AddHouseHoldsForm
