'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddStaffPayload, StaffResponse } from '../types/IStaff'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddStaff, useUpdateStaff } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";

type Props = {
    form: UseFormReturn<AddStaffPayload>;
    onClose: () => void;
    staff?: StaffResponse | null;
};
const AddStaffForm = ({ form, onClose, staff }: Props) => {
    const addStaff = useAddStaff();
    const updateStaff = useUpdateStaff();
    const { handleError, clearError } = useErrorHandler();

    const { data: rolesResponse } = useGetAllRoles();

    const roles = (rolesResponse?.Items ?? []).map(role => ({
        id: role.Id,
        name: role.Name,
    }));


    const [selectedRoleId, setSelectedRoleId] = useState<string>(staff?.rolesId?.[0] ?? "");
    const [genderStatus, setGenderStatus] = useState<number | null>(staff?.gender ?? null);


    const handleClose = () => {
        form.reset({
            username: "",
            password: "",
            fullName: "",
            gender: 0,
            dob: "",
            contactNumber: "",
            email: "",
            nid: "",
            address: "",
            joiningDate: "",
            rolesId: [],
        });
        onClose?.();
    };




    const onSubmit: SubmitHandler<AddStaffPayload> = async (data) => {
        clearError();

        try {
            const payload = {
                username: data.username,
                password: data.password,
                fullName: data.fullName,
                gender: data.gender,
                dob: data.dob,
                contactNumber: data.contactNumber,
                email: data.email,
                nid: data.nid,
                address: data.address,
                joiningDate: data.joiningDate,
                rolesId: Array.isArray(data.rolesId)
                    ? data.rolesId
                    : []
            };

            if (staff) {
                await updateStaff.mutateAsync({
                    id: staff.id,
                    payload: { id: staff.id, ...payload },
                });
            } else {
                await addStaff.mutateAsync(payload);
            }

            handleClose();
            onClose();
        } catch (error) {
            Toast.error(handleError(error));
        }
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            {staff ? "Edit Staff" : "Add Staff"}
                        </h1>
                        <button
                            type="button"
                            onClick={() => {
                                handleClose();
                                onClose();
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
                            />

                            <InputElement
                                label="Password"
                                form={form}
                                name="password"
                                inputType="password"
                                placeholder="Enter Password"
                            />

                            <InputElement
                                label="Full Name"
                                form={form}
                                name="fullName"
                                placeholder="Enter Full Name"
                            />

                            <AppCombobox
                                label="Status"
                                dropdownPositionClass="absolute"
                                name="gender"
                                form={form}
                                value={genderStatus}
                                options={[
                                    { id: 1, name: 'Male' },
                                    { id: 2, name: 'Female' },
                                    { id: 3, name: 'Other' }
                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 1, name: 'Male' },
                                        { id: 2, name: 'Female' },
                                        { id: 3, name: 'Other' }
                                    ].find((g) => g.id === genderStatus) || null
                                }
                                onSelect={(option) => {
                                    setGenderStatus(option?.id ?? null);
                                    form.setValue('gender', option?.id ?? 0);
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
                            />

                            <InputElement
                                label="Date of Birth"
                                form={form}
                                name="dob"
                                inputType="date"
                            />

                            <InputElement
                                label="Contact Number"
                                form={form}
                                name="contactNumber"
                                placeholder="Enter Contact Number"
                            />

                            <InputElement
                                label="Email"
                                form={form}
                                name="email"
                                inputType="email"
                                placeholder="Enter Email"
                            />

                            <InputElement
                                label="National ID (NID)"
                                form={form}
                                name="nid"
                                placeholder="Enter National ID"
                            />

                            <InputElement
                                label="Address"
                                form={form}
                                name="address"
                                placeholder="Enter Address"
                            />

                            <InputElement
                                label="Joining Date"
                                form={form}
                                name="joiningDate"
                                inputType="date"
                            />

                            <AppCombobox
                                value={selectedRoleId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Role"
                                name=""
                                form={form}
                                required
                                options={roles}
                                selected={
                                    roles.find((role) => role.id === selectedRoleId) ?? null
                                }
                                onSelect={(role) => {
                                    const roleId = role?.id ?? "";

                                    console.log("SELECTED ROLE:", roleId);

                                    setSelectedRoleId(roleId);

                                    form.setValue(
                                        "rolesId",
                                        roleId ? [roleId] : [],
                                        {
                                            shouldDirty: true,
                                            shouldTouch: true,
                                            shouldValidate: true,
                                        }
                                    );
                                }}
                                getLabel={(role) => role?.name ?? ""}
                                getValue={(role) => role?.id ?? ""}
                            />

                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={staff ? "Update" : "Submit"}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div >
    );
};

export default AddStaffForm;
