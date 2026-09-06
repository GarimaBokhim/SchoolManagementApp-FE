'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddHouseHoldsPayload } from '../types/IHouseHolds'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddHouseHolds, useGetAllWaterTariffPlan, useUpdateHouseHolds } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';
import { useGetAllProvince, useGetDistrictByProvince, useGetMunicipalityByDistrict, useGetVDCByDistrict } from '@/components/common/hooks';
import dynamic from 'next/dynamic';

type Props = {
    form: UseFormReturn<AddHouseHoldsPayload>;
    onClose: () => void;
    householdId?: string;
};
const LocationPicker = dynamic(
    () => import("@/components/Maps/LocationPicker"),
    {
        ssr: false,
    }
);

const AddHouseHoldsForm = ({ form, onClose, householdId }: Props) => {
    const addHouseHolds = useAddHouseHolds();
    const updateHouseHolds = useUpdateHouseHolds();
    const { handleError, clearError } = useErrorHandler();

    const [HouseHoldsType, setHouseHoldsType] = useState<number | null>(null);

    const { data: allwaterTariffPlan } = useGetAllWaterTariffPlan();
    const [sellectedWaterTariffPlanId, setSelectedWaterTariffPlanId] = useState<string | null>('')

    const { data: allProvince } = useGetAllProvince()
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>(0)
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>(0)
    const [selectedVdcId, setSelectedVdcId] = useState<number | undefined>(0)
    const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<number | undefined>(0)
    const { data: filteredDistrict } = useGetDistrictByProvince(selectedProvinceId)
    const { data: filteredVdc } = useGetVDCByDistrict(selectedDistrictId)
    const { data: filteredMunicipality } = useGetMunicipalityByDistrict(selectedDistrictId)





    const handleClose = () => {
        form.reset({
            consumerName: "",
            familyMember: 0,
            contactNumber: "",
            email: "",
            provinceId: 0,
            districtId: 0,
            municipalityId: 0,
            vdcId: 0,
            wardNumber: 0,
            waterTrrifPlanId: "",
            latitude: 0,
            longitude: 0,
            tole: "",
            registrationDate: "",

        });
    };




    const onSubmit: SubmitHandler<AddHouseHoldsPayload> = async (data) => {
        clearError();

        try {
            const payload = {
                consumerName: data.consumerName,
                familyMember: data.familyMember,
                contactNumber: data.contactNumber,
                email: data.email,
                provinceId: data.provinceId,
                districtId: data.districtId,
                municipalityId: data.municipalityId,
                vdcId: data.vdcId,
                wardNumber: data.wardNumber,
                waterTrrifPlanId: data.waterTrrifPlanId,
                latitude: data.latitude,
                longitude: data.longitude,
                tole: data.tole,
                registrationDate: data.registrationDate
            };

            if (householdId) {
                await updateHouseHolds.mutateAsync({
                    id: householdId,
                    payload: { id: householdId, ...payload },
                });
            } else {
                await addHouseHolds.mutateAsync(payload);
            }

            handleClose()
            onClose()
        } catch (error) {
            Toast.error(handleError(error))
        }
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            {householdId ? "Edit HouseHolds" : "Add HouseHolds"}
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
                                label="ConsumerName"
                                form={form}
                                name="consumerName"
                                placeholder="Enter Consumer Name"
                            />


                            <InputElement
                                label="Family Member"
                                form={form}
                                inputType="number"
                                name="familyMember"
                                placeholder="Enter Family Member"
                            />

                            <InputElement
                                label="Conttact Number"
                                form={form}
                                name="contactNumber"
                                placeholder="Enter Contact Number"
                            />
                            <InputElement
                                label="Email"
                                form={form}
                                name="email"
                                placeholder="Enter Email"
                            />





                            <AppCombobox
                                value={selectedProvinceId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute"
                                label="Province"
                                name="provinceId"
                                form={form}
                                required
                                options={allProvince?.Items}
                                selected={
                                    allProvince?.Items?.find(
                                        (g) => g.Id === selectedProvinceId
                                    ) || null
                                }
                                onSelect={(group) => setSelectedProvinceId(group?.Id ?? 0)}
                                getLabel={(g) => g?.provinceNameInEnglish ?? ''}
                                getValue={(g) => g?.Id ?? ''}
                            />
                            <AppCombobox
                                value={selectedDistrictId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute"
                                label="District"
                                name="districtId"
                                form={form}
                                required
                                options={filteredDistrict}
                                selected={
                                    filteredDistrict?.find(
                                        (g) => g.Id === selectedDistrictId
                                    ) || null
                                }
                                onSelect={(group) => setSelectedDistrictId(group?.Id ?? 0)}
                                getLabel={(g) => g?.districtNameInEnglish ?? ''}
                                getValue={(g) => g?.Id ?? ''}
                            />
                            <AppCombobox
                                value={selectedMunicipalityId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute"
                                disabled={selectedVdcId !== 0 && selectedVdcId !== undefined}
                                label="Municipality"
                                name="municipalityId"
                                form={form}
                                options={filteredMunicipality}
                                selected={
                                    filteredMunicipality?.find(
                                        (g) => g.Id === selectedMunicipalityId
                                    ) || null
                                }
                                onSelect={(group) =>
                                    setSelectedMunicipalityId(group?.Id ?? 0)
                                }
                                getLabel={(g) => g?.MunicipalityNameinEnglish ?? ''}
                                getValue={(g) => g?.Id ?? ''}
                            />

                            <AppCombobox
                                value={selectedVdcId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute"
                                label="VDC"
                                disabled={
                                    selectedMunicipalityId !== 0 &&
                                    selectedMunicipalityId !== undefined
                                }
                                name="vdcid"
                                form={form}
                                options={filteredVdc}
                                selected={
                                    filteredVdc?.find((g) => g.Id === selectedVdcId) || null
                                }
                                onSelect={(group) => setSelectedVdcId(group?.Id ?? 0)}
                                getLabel={(g) => g?.VdcNameInNepali ?? ''}
                                getValue={(g) => g?.Id ?? ''}
                            />




                            <InputElement
                                label="Ward Number"
                                form={form}
                                name="wardNumber"
                                inputType="number"
                                placeholder="Enter Ward Number"
                            />


                            <AppCombobox
                                value={sellectedWaterTariffPlanId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="WaterTariff Plan"
                                name="waterTrrifPlanId"
                                form={form}
                                required
                                options={allwaterTariffPlan || []}
                                selected={
                                    allwaterTariffPlan?.find((g) => g.id === sellectedWaterTariffPlanId) ||
                                    null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? ''

                                        setSelectedWaterTariffPlanId(id || null)

                                        form.setValue('waterTrrifPlanId', id, {
                                            shouldValidate: true,
                                        })
                                    } else {
                                        setSelectedWaterTariffPlanId(null)

                                        form.setValue('waterTrrifPlanId', '', {
                                            shouldValidate: true,
                                        })
                                    }
                                }}
                                getLabel={(g) => g?.name ?? ''}
                                getValue={(g) => g?.id ?? ''}
                            />
                            <InputElement
                                label="Tole"
                                form={form}
                                name="tole"
                                placeholder="Enter Tole"
                            />
                            <InputElement
                                label="Registration Date"
                                form={form}
                                name="registrationDate"
                                placeholder="Enter Registration Date"
                            />
                            <div className="lg:col-span-3">
                                <LocationPicker
                                    latitude={form.watch("latitude")}
                                    longitude={form.watch("longitude")}
                                    onLocationChange={(latitude, longitude) => {
                                        form.setValue(
                                            "latitude",
                                            latitude,
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            }
                                        );

                                        form.setValue(
                                            "longitude",
                                            longitude,
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            }
                                        );
                                    }}
                                />
                            </div>




                        </div>


                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={householdId ? "Update" : "Submit"}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div >
    );
};

export default AddHouseHoldsForm;
