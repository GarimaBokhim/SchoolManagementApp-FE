'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { SubmitHandler, useFieldArray, UseFormReturn } from 'react-hook-form';
import { AddVisaRequirementPayload } from '../types/IVisaRequirements';
import { InputElement } from '@/components/Input/InputElement';
import { ButtonElement } from '@/components/Buttons/ButtonElement';
import { AppCombobox } from '@/components/Input/ComboBox';

import {
    useAddVisaRequirement,
    useGetAllCountry,
    useGetAllVisaStatus,
    useGetCourseByUniversity,
    useGetUniversityByCountry
} from '../hooks';

import useErrorHandler from '@/components/helpers/ErrorHandling';
import { useState } from 'react';

type Props = {
    form: UseFormReturn<AddVisaRequirementPayload>;
    onClose: () => void;
};

const AddVisaRequirementForm = ({ form, onClose }: Props) => {
    const addVisaRequirement = useAddVisaRequirement();
    const { handleError, clearError } = useErrorHandler();

    const [visaRequirementStatus, setVisaRequirementStatus] = useState<number | null>(
        null
    )

    const { data: country } = useGetAllCountry();
    const { data: visaStatus } = useGetAllVisaStatus();

    const countryId = form.watch('countryId');
    const universityId = form.watch('universityId');
    const courseId = form.watch('courseId');

    const { data: universityByCountry } = useGetUniversityByCountry(countryId);
    const { data: courseByUniversity } = useGetCourseByUniversity(universityId);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'visaRequirementsDetailsDTOs',
    });

    const handleClose = () => {
        form.reset({
            countryId: '',
            universityId: '',
            courseId: '',
            visaRequirementsDetailsDTOs: [
                {
                    step: 0,
                    visaStatusId: '',
                    visaRequirementStatus: 0
                }
            ],
        });
        onClose();
    };

    const onSubmit: SubmitHandler<AddVisaRequirementPayload> = async () => {
        clearError();
        const values = form.getValues();

        const payload = {
            countryId: values.countryId,
            universityId: values.universityId,
            courseId: values.courseId,
            visaRequirementsDetailsDTOs: (values.visaRequirementsDetailsDTOs ?? []).map(
                (item) => ({
                    step: item.step,
                    visaStatusId: item.visaStatusId,
                    visaRequirementStatus: item.visaRequirementStatus
                })
            ),
        };

        await addVisaRequirement.mutateAsync(payload);
        handleClose();
    };

    return (
        <div className="w-full h-full bg-white dark:bg-[#27272a] p-4 overflow-auto relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Add VisaRequirement</h1>

                <button
                    type="button"
                    onClick={handleClose}
                    className="text-red-500"
                >
                    <X />
                </button>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">


                    {/* COUNTRY */}
                    <AppCombobox
                        value={countryId}
                        name="countryId"
                        label="Country"
                        dropdownPositionClass="absolute z-50 w-full"
                        form={form}
                        options={country || []}
                        selected={
                            country?.find((x) => x.id === countryId) ||
                            null
                        }
                        onSelect={(item) => {
                            const id = item?.id ?? '';

                            form.setValue('countryId', id, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });

                            form.setValue('universityId', '');
                            form.setValue('courseId', '');
                        }}
                        getLabel={(i) => i?.name ?? ''}
                        getValue={(i) => i?.id ?? ''}
                    />

                    {/* UNIVERSITY */}
                    <AppCombobox
                        value={universityId}
                        name="universityId"
                        label="University"
                        dropdownPositionClass="absolute z-50 w-full"
                        form={form}
                        options={universityByCountry || []}
                        selected={
                            universityByCountry?.find(
                                (x) => x.id === universityId
                            ) || null
                        }
                        onSelect={(item) => {
                            const id = item?.id ?? '';

                            form.setValue('universityId', id, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });

                            form.setValue('courseId', '');
                        }}
                        getLabel={(i) => i?.name ?? ''}
                        getValue={(i) => i?.id ?? ''}
                    />

                    {/* COURSE */}
                    <AppCombobox
                        value={courseId}
                        name="courseId"
                        label="Course"
                        dropdownPositionClass="absolute z-50 w-full"
                        form={form}
                        options={courseByUniversity || []}
                        selected={
                            courseByUniversity?.find(
                                (x) => x.id === courseId
                            ) || null
                        }
                        onSelect={(item) => {
                            form.setValue('courseId', item?.id ?? '', {
                                shouldValidate: true,
                            });
                        }}
                        getLabel={(i) => i?.title ?? ''}
                        getValue={(i) => i?.id ?? ''}
                    />
                </div>

                {/* VISA REQUIREMENTS DETAILS */}
                <div className="mt-8">
                    <h2 className="font-semibold mb-4">Visa Requirements Details</h2>

                    {fields.length === 0 && (
                        <button
                            type="button"
                            onClick={() =>
                                append({
                                    step: 0,
                                    visaStatusId: "",
                                    visaRequirementStatus: 0,
                                })
                            }
                            className="px-4 py-2 bg-black text-white rounded"
                        >
                            Add Item
                        </button>
                    )}

                    {fields.map((field, index) => {
                        const visaStatusValue = form.watch(
                            `visaRequirementsDetailsDTOs.${index}.visaStatusId`
                        );

                        return (
                            <div
                                key={field.id}
                                className="border p-4 rounded mb-4 relative"
                            >
                                {/* HEADER */}
                                <div className="flex justify-between items-center mb-3">
                                    <span>Item {index + 1}</span>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                append({
                                                    step: 0,
                                                    visaStatusId: "",
                                                    visaRequirementStatus: 0,
                                                })
                                            }
                                        >
                                            <Plus size={18} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* SINGLE ROW FIELDS */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                    <InputElement
                                        label="Step"
                                        name={`visaRequirementsDetailsDTOs.${index}.step`}
                                        form={form}
                                    />

                                    <div className='relative'>
                                        <AppCombobox
                                            value={visaStatusValue}
                                            label="Visa Status"
                                            dropdownPositionClass="absolute z-50"
                                            name={`visaRequirementsDetailsDTOs.${index}.visaStatusId`}
                                            form={form}
                                            options={visaStatus || []}
                                            selected={
                                                visaStatus?.find(
                                                    (x) => x.id === visaStatusValue
                                                ) || null
                                            }
                                            onSelect={(item) => {
                                                form.setValue(
                                                    `visaRequirementsDetailsDTOs.${index}.visaStatusId`,
                                                    item?.id ?? "",
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    }
                                                );
                                            }}
                                            getLabel={(i) => i?.name ?? ""}
                                            getValue={(i) => i?.id ?? ""}
                                        />
                                    </div>



                                    <AppCombobox
                                        label="Status"
                                        dropdownPositionClass="absolute"
                                        name={`visaRequirementsDetailsDTOs.${index}.visaRequirementStatus`}
                                        form={form}
                                        options={[
                                            { id: 1, name: "Completed" },
                                            { id: 2, name: "Pending" },
                                            { id: 3, name: "Rejected" },
                                            { id: 4, name: "ActionRequired" },
                                        ]}
                                        dropDownWidth="w-full"
                                        selected={
                                            [
                                                { id: 1, name: "Completed" },
                                                { id: 2, name: "Pending" },
                                                { id: 3, name: "Rejected" },
                                                { id: 4, name: "ActionRequired" },
                                            ].find((x) => x.id === visaRequirementStatus) ?? null
                                        }
                                        onSelect={(option) => {
                                            form.setValue(
                                                `visaRequirementsDetailsDTOs.${index}.visaRequirementStatus`,
                                                option?.id ?? 0,
                                                {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                }
                                            );
                                        }}
                                        getLabel={(o) => o?.name ?? ""}
                                        getValue={(o) => o?.id ?? ""}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center mt-6">
                    <ButtonElement type="submit" text="Submit" />
                </div>
            </form>
        </div>
    );
};

export default AddVisaRequirementForm;