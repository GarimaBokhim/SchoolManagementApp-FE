'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AddStaffPayload } from '../types/IStaff'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import { useAddStaff, useGetAllRoles, useGetAllStaff } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'

type Props = {
    form: UseFormReturn<AddStaffPayload>
    onClose: () => void
}
const AddStaffForm = ({ form, onClose }: Props) => {
    const addStaff = useAddStaff()
    const { handleError, clearError } = useErrorHandler()


    const [gender, setGender] = useState<number | null>(null);

    const { data: allRoles = [] } = useGetAllRoles();

    const selectedRoleId = form.watch("rolesId")?.[0] ?? "";



    const handleClose = () => {
        form.reset({
            username: "",
            password: "",
            employeeCode: "",
            fullName: "",
            gender: 0,
            dob: "",
            contactNumber: "",
            email: "",
            nid: "",
            address: "",
            joiningDate: "",
            tole: "",
            registrationDate: "",
            rolesId: [],
        });
    };

    const onSubmit: SubmitHandler<AddStaffPayload> = async (data) => {
        clearError()
        try {
            await addStaff.mutateAsync({
                username: data.username,
                password: data.password,
                employeeCode: data.employeeCode,
                fullName: data.fullName,
                gender: data.gender,
                dob: data.dob,
                contactNumber: data.contactNumber,
                email: data.email,
                nid: data.nid,
                address: data.address,
                joiningDate: data.joiningDate,
                tole: data.tole,
                registrationDate: data.registrationDate,
                rolesId: data.rolesId,
            });

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
                            Add Staff
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
                                label="Username"
                                form={form}
                                name="username"
                                placeholder="Enter Username"
                                required
                            />

                            <InputElement
                                label="Password"
                                form={form}
                                name="password"
                                placeholder="Enter Password"
                                inputType="password"
                                required
                            />

                            <InputElement
                                label="Employee Code"
                                form={form}
                                name="employeeCode"
                                placeholder="Enter Employee Code"
                                required
                            />

                            <InputElement
                                label="Full Name"
                                form={form}
                                name="fullName"
                                placeholder="Enter Full Name"
                                required
                            />

                            <AppCombobox
                                label="Gender"
                                dropdownPositionClass="absolute"
                                name="gender"
                                form={form}
                                value={gender}
                                options={[
                                    { id: 1, name: 'Male' },
                                    { id: 2, name: 'Female' },
                                    { id: 3, name: 'Others' }

                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 1, name: 'Male' },
                                        { id: 2, name: 'Female' },
                                        { id: 3, name: 'Others' }
                                    ].find((g) => g.id === gender) || null
                                }
                                onSelect={(option) => {
                                    setGender(option?.id ?? null);
                                    form.setValue('gender', option?.id ?? 0);
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
                            />


                            <InputElement
                                label="Date of Birth"
                                form={form}
                                name="dob"
                                placeholder="Select Date of Birth"
                                inputType="date"
                                required
                            />

                            <InputElement
                                label="Contact Number"
                                form={form}
                                name="contactNumber"
                                placeholder="Enter Contact Number"
                                required
                            />

                            <InputElement
                                label="Email"
                                form={form}
                                name="email"
                                placeholder="Enter Email"
                                inputType="email"
                                required
                            />

                            <InputElement
                                label="NID"
                                form={form}
                                name="nid"
                                placeholder="Enter National ID"
                                required
                            />

                            <InputElement
                                label="Address"
                                form={form}
                                name="address"
                                placeholder="Enter Address"
                                required
                            />

                            <InputElement
                                label="Joining Date"
                                form={form}
                                name="joiningDate"
                                placeholder="Select Joining Date"
                                inputType="date"
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
                                placeholder="Select Registration Date"
                                inputType="date"
                                required
                            />

                            <AppCombobox
                                label="Roles"
                                name="roleId"
                                form={form}
                                required
                                value={selectedRoleId}
                                options={allRoles}
                                selected={
                                    allRoles.find(role => role.id === selectedRoleId) ?? null
                                }
                                onSelect={(role) => {
                                    form.setValue(
                                        "rolesId",
                                        role ? [role.id] : [],
                                        {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        }
                                    );
                                }}
                                getLabel={(role) => role?.name ?? ''}
                                getValue={(role) => role?.id ?? ''}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
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

export default AddStaffForm
