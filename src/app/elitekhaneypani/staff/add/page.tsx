"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { AppCombobox } from "@/components/Input/ComboBox";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AuthContext } from "@/context/auth/AuthContext";
import { MobilePageHeader } from "../../components/MobilePageHeader";
import { useAddStaff, useGetRoles } from "../hooks/useStaff";
import { RoleOption } from "../types/staff.types";

interface StaffForm {
    userName: string;
    email: string;
    password: string;
}

export default function AddStaffPage() {
    const router = useRouter();
    const { handleError, clearError } = useErrorHandler();
    const { userDetails } = useContext(AuthContext);
    const addStaff = useAddStaff();
    const { data: roles } = useGetRoles();
    const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);

    const form = useForm<StaffForm>({
        defaultValues: { userName: "", email: "", password: "" },
    });

    const onSubmit = async (data: StaffForm) => {
        clearError();
        if (!selectedRole) {
            Toast.error("Please select a role.");
            return;
        }
        try {
            await addStaff.mutateAsync({
                userName: data.userName,
                email: data.email,
                password: data.password,
                rolesId: [selectedRole.Id],
                institutionId: userDetails?.institutionId ?? "",
                schoolIds: userDetails?.schoolId ? [userDetails.schoolId] : [],
            });
            Toast.success("Staff added successfully.");
            router.push("/elitekhaneypani/more");
        } catch (error) {
            Toast.error(handleError(error));
        }
    };

    return (
        <div className="p-4 pb-24 space-y-4">
            <MobilePageHeader title="Add Staff" />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <InputElement label="Full Name" form={form} name="userName" placeholder="Enter staff name" required />
                <InputElement label="Email" form={form} name="email" placeholder="staff@example.com" required />
                <InputElement label="Password" form={form} name="password" inputType="password" placeholder="••••••••" required />

                <AppCombobox<RoleOption>
                    label="Role"
                    name="role"
                    form={form}
                    required
                    options={roles || []}
                    selected={selectedRole || undefined}
                    onSelect={(role) => setSelectedRole(role ?? null)}
                    getLabel={(r) => r?.Name ?? ""}
                    getValue={(r) => r?.Id ?? ""}
                />

                <ButtonElement type="submit" text="Save Staff" isLoading={addStaff.isPending} className="w-full py-3 rounded-xl" />
            </form>
        </div>
    );
}
