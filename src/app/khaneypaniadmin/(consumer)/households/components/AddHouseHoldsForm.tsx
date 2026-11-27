'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddHouseHoldsPayload } from '../types/IHouseHolds'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import {
    useAddHouseHolds,
    useGetAllWaterRateSlabs,
    useGetAllWaterTariffPlan,
    useUpdateHouseHolds,
} from "../hooks";
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

    const {
        data: allwaterTariffPlan,
        isLoading: tariffPlansLoading,
        error: tariffPlansError,
    } = useGetAllWaterTariffPlan();
    const {
        data: waterRateSlabs,
        isLoading: waterRateSlabsLoading,
        error: waterRateSlabsError,
    } = useGetAllWaterRateSlabs();
    const selectedWaterTariffPlanId = form.watch('waterTariffPlanId') ?? ''
    const selectedWaterRateSlabId = form.watch('waterRateSlabId') ?? ''

    const {
        data: allProvince,
        isLoading: provincesLoading,
        error: provincesError,
    } = useGetAllProvince()
    const selectedProvinceId = form.watch('provinceId')
    const selectedDistrictId = form.watch('districtId')
    const selectedVdcId = form.watch('vdcId')
    const selectedMunicipalityId = form.watch('municipalityId')
    const {
        data: filteredDistrict,
        isLoading: districtsLoading,
        error: districtsError,
    } = useGetDistrictByProvince(selectedProvinceId)
    const {
        data: filteredVdc,
        isLoading: vdcsLoading,
        error: vdcsError,
    } = useGetVDCByDistrict(selectedDistrictId)
    const {
        data: filteredMunicipality,
        isLoading: municipalitiesLoading,
        error: municipalitiesError,
    } = useGetMunicipalityByDistrict(selectedDistrictId)





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
            waterTariffPlanId: "",
            waterRateSlabId: "",
            latitude: 0,
            longitude: 0,
            tole: "",
            registrationDate: "",

        });
    };




    const onSubmit: SubmitHandler<AddHouseHoldsPayload> = async (data) => {
        clearError();

        try {
            if (!data.waterTariffPlanId) {
                form.setError('waterTariffPlanId', {
                    type: 'required',
                    message: 'Select a water tariff plan.',
                })
                return
            }

            if (!data.waterRateSlabId) {
                form.setError('waterRateSlabId', {
                    type: 'required',
                    message: 'Select a water rate slab.',
                })
                return
            }

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
                waterTariffPlanId: data.waterTariffPlanId,
                waterRateSlabId: data.waterRateSlabId,
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
                                options={allProvince?.Items ?? []}
                                disabled={provincesLoading || Boolean(provincesError)}
                                placeholder={provincesLoading ? 'Loading provinces...' : 'Select a province...'}
                                selected={
                                    allProvince?.Items?.find(
                                        (g) => Number(g.Id) === Number(selectedProvinceId)
                                    ) || null
                                }
                                onSelect={() => {
                                    form.setValue('districtId', 0, { shouldDirty: true })
                                    form.setValue('municipalityId', 0, { shouldDirty: true })
                                    form.setValue('vdcId', 0, { shouldDirty: true })
                                }}
                                getLabel={(g) => g?.provinceNameInEnglish ?? ''}
                                getValue={(g) => g?.Id ?? ''}
                            />
                            {provincesError && (
                                <p role="alert" className="text-sm text-red-500">
                                    Could not load provinces.
                                </p>
                            )}
                            <AppCombobox
                                value={selectedDistrictId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute"
                                label="District"
                                name="districtId"
                                form={form}
                                required
                                options={filteredDistrict ?? []}
                                disabled={!selectedProvinceId || districtsLoading || Boolean(districtsError)}
                                placeholder={districtsLoading ? 'Loading districts...' : 'Select a district...'}
                                selected={
                                    filteredDistrict?.find(
                                        (g) => Number(g.Id) === Number(selectedDistrictId)
                                    ) || null
                                }
                                onSelect={() => {
                                    form.setValue('municipalityId', 0, { shouldDirty: true })
                                    form.setValue('vdcId', 0, { shouldDirty: true })
                                }}
                                getLabel={(g) => g?.districtNameInEnglish ?? ''}
                                getValue={(g) => g?.Id ?? ''}
                            />
                            {districtsError && (
                                <p role="alert" className="text-sm text-red-500">
                                    Could not load districts for the selected province.
                                </p>
                            )}
                            <AppCombobox
                                value={selectedMunicipalityId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute"
                                disabled={!selectedDistrictId || municipalitiesLoading || Boolean(municipalitiesError) || (selectedVdcId !== 0 && selectedVdcId !== undefined)}
                                label="Municipality"
                                name="municipalityId"
                                form={form}
                                options={filteredMunicipality ?? []}
                                placeholder={municipalitiesLoading ? 'Loading municipalities...' : 'Select a municipality...'}
                                selected={
                                    filteredMunicipality?.find(
                                        (g) => Number(g.Id) === Number(selectedMunicipalityId)
                                    ) || null
                                }
                                onSelect={() => form.setValue('vdcId', 0, { shouldDirty: true })}
                                getLabel={(g) => g?.MunicipalityNameinEnglish ?? ''}
                                getValue={(g) => g?.Id ?? ''}
                            />
                            {municipalitiesError && (
                                <p role="alert" className="text-sm text-red-500">
                                    Could not load municipalities for the selected district.
                                </p>
                            )}

                            <AppCombobox
                                value={selectedVdcId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute"
                                disabled={!selectedDistrictId || vdcsLoading || Boolean(vdcsError) || (selectedMunicipalityId !== 0 && selectedMunicipalityId !== undefined)}
                                label="VDC"
                                name="vdcId"
                                form={form}
                                options={filteredVdc ?? []}
                                placeholder={vdcsLoading ? 'Loading VDCs...' : 'Select a VDC...'}
                                selected={
                                    filteredVdc?.find((g) => Number(g.Id) === Number(selectedVdcId)) || null
                                }
                                onSelect={() => form.setValue('municipalityId', 0, { shouldDirty: true })}
                                getLabel={(g) => g?.VdcNameInNepali ?? ''}
                                getValue={(g) => g?.Id ?? ''}
                            />
                            {vdcsError && (
                                <p role="alert" className="text-sm text-red-500">
                                    Could not load VDCs for the selected district.
                                </p>
                            )}

                            {householdId &&
                                (!selectedProvinceId ||
                                    !selectedDistrictId ||
                                    (!selectedMunicipalityId && !selectedVdcId) ||
                                    !selectedWaterTariffPlanId ||
                                    !selectedWaterRateSlabId) && (
                                    <p role="alert" className="text-sm text-amber-700">
                                        Some saved location or tariff IDs are missing. The household API must return provinceId, districtId, municipalityId or vdcId, waterTariffPlanId, and waterRateSlabId for edit selections to load.
                                    </p>
                                )}



                            <InputElement
                                label="Ward Number"
                                form={form}
                                name="wardNumber"
                                inputType="number"
                                placeholder="Enter Ward Number"
                            />


                            <AppCombobox
                                value={selectedWaterTariffPlanId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="WaterTariff Plan"
                                name="waterTariffPlanId"
                                form={form}
                                required
                                disabled={tariffPlansLoading || Boolean(tariffPlansError)}
                                placeholder={tariffPlansLoading ? 'Loading water tariff plans...' : 'Select a water tariff plan...'}
                                options={allwaterTariffPlan || []}
                                selected={
                                    allwaterTariffPlan?.find((g) => String(g.id) === String(selectedWaterTariffPlanId)) ||
                                    null
                                }
                                onSelect={(group) => {
                                    const id = group?.id ?? ''
                                    form.setValue('waterTariffPlanId', id, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    })
                                    if (id) form.clearErrors('waterTariffPlanId')
                                }}
                                getLabel={(g) => g?.name ?? ''}
                                getValue={(g) => g?.id ?? ''}
                            />
                            {tariffPlansError && (
                                <p role="alert" className="text-sm text-red-500">
                                    Could not load water tariff plans.
                                </p>
                            )}
                            <AppCombobox
                                value={selectedWaterRateSlabId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Water Rate Slab"
                                name="waterRateSlabId"
                                form={form}
                                required
                                options={waterRateSlabs ?? []}
                                selected={
                                    waterRateSlabs?.find(
                                        (slab) => String(slab.id) === String(selectedWaterRateSlabId),
                                    )
                                }
                                onSelect={(slab) =>
                                    form.setValue('waterRateSlabId', slab?.id ?? '', {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    })
                                }
                                getLabel={(slab) => slab.name}
                                getValue={(slab) => slab.id}
                                placeholder={
                                    waterRateSlabsLoading
                                        ? 'Loading water rate slabs...'
                                        : 'Select a water rate slab...'
                                }
                                disabled={waterRateSlabsLoading || Boolean(waterRateSlabsError)}
                            />
                            {waterRateSlabsError && (
                                <p className="text-sm text-red-500">
                                    Could not load water rate slabs. Please try again.
                                </p>
                            )}
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
