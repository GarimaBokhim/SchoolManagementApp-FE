"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { AppCombobox } from "@/components/Input/ComboBox";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { useAddHousehold, useGetWaterTariffPlans } from "../hooks/useHouseholds";
import { AddHouseholdPayload, WaterTariffPlan } from "../types/household.types";

interface Props {
    onSuccess?: () => void;
}

export const HouseholdForm = ({ onSuccess }: Props) => {
    const { handleError, clearError } = useErrorHandler();
    const addHousehold = useAddHousehold();
    const { data: waterTariffPlans } = useGetWaterTariffPlans();
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>("");

    const form = useForm<AddHouseholdPayload>({
        defaultValues: {
            consumerName: "",
            familyMember: 0,
            contactNumber: "",
            email: "",
            provinceId: 0,
            districtId: 0,
            municipalityId: 0,
            vdcId: 0,
            wardNumber: 0,
            tole: "",
            registrationDate: "",
            waterTrrifPlanId: "",
            latitude: 0,
            longitude: 0,
        },
    });

    const onSubmit: SubmitHandler<AddHouseholdPayload> = async (data) => {
        clearError();
        try {
            await addHousehold.mutateAsync(data);
            form.reset();
            setSelectedPlanId(null);
            onSuccess?.();
        } catch (error) {
            Toast.error(handleError(error));
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputElement label="Consumer Name" form={form} name="consumerName" placeholder="Enter consumer name" required />
                <InputElement label="Family Member" form={form} inputType="number" name="familyMember" placeholder="Enter family member count" />
                <InputElement label="Contact Number" form={form} name="contactNumber" placeholder="Enter contact number" />
                <InputElement label="Email" form={form} name="email" placeholder="Enter email" />
                <InputElement label="Province" form={form} inputType="number" name="provinceId" placeholder="Enter province" />
                <InputElement label="District" form={form} inputType="number" name="districtId" placeholder="Enter district" />
                <InputElement label="Municipality" form={form} inputType="number" name="municipalityId" placeholder="Enter municipality" />
                <InputElement label="VDC" form={form} inputType="number" name="vdcId" placeholder="Enter VDC" />
                <InputElement label="Ward Number" form={form} inputType="number" name="wardNumber" placeholder="Enter ward number" />
                <InputElement label="Tole" form={form} name="tole" placeholder="Enter tole" />
                <InputElement label="Registration Date" form={form} name="registrationDate" placeholder="Enter registration date" />
                <InputElement label="Latitude" form={form} name="latitude" placeholder="Enter latitude" />
                <InputElement label="Longitude" form={form} name="longitude" placeholder="Enter longitude" />

                <AppCombobox<WaterTariffPlan>
                    label="Water Tariff Plan"
                    name="waterTrrifPlanId"
                    form={form}
                    required
                    options={waterTariffPlans || []}
                    selected={waterTariffPlans?.find((plan) => plan.id === selectedPlanId) || undefined}
                    onSelect={(plan) => {
                        const id = plan?.id ?? "";
                        setSelectedPlanId(id || null);
                        form.setValue("waterTrrifPlanId", id, { shouldValidate: true });
                    }}
                    getLabel={(plan) => plan?.name ?? ""}
                    getValue={(plan) => plan?.id ?? ""}
                />
            </div>

            <div className="flex justify-end pt-2">
                <ButtonElement type="submit" text="Save Household" isLoading={addHousehold.isPending} />
            </div>
        </form>
    );
};

export default HouseholdForm;
