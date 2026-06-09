'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { SubmitHandler, useFieldArray, UseFormReturn } from 'react-hook-form';
import { AddRequirementsPayload } from '../types/IRequirements';
import { InputElement } from '@/components/Input/InputElement';
import { ButtonElement } from '@/components/Buttons/ButtonElement';
import { AppCombobox } from '@/components/Input/ComboBox';

import {
    useAddRequirements,
    useGetAllCountry,
    useGetCourseByUniversity,
    useGetUniversityByCountry,
    useGetAllDocumentType,
} from '../hooks';

import useErrorHandler from '@/components/helpers/ErrorHandling';

type Props = {
    form: UseFormReturn<AddRequirementsPayload>;
    onClose: () => void;
};

const AddRequirementsForm = ({ form, onClose }: Props) => {
    const addRequirements = useAddRequirements();
    const { handleError, clearError } = useErrorHandler();

    const { data: country } = useGetAllCountry();
    const { data: documentType } = useGetAllDocumentType();

    const countryId = form.watch('countryId');
    const universityId = form.watch('universityId');
    const courseId = form.watch('courseId');

    const { data: universityByCountry } = useGetUniversityByCountry(countryId);
    const { data: courseByUniversity } = useGetCourseByUniversity(universityId);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'documentsCheckListDTOs',
    });

    const handleClose = () => {
        form.reset({
            title: '',
            descriptions: '',
            universityId: '',
            countryId: '',
            courseId: '',
            documentsCheckListDTOs: [{ documenteTypeId: '' }],
        });
        onClose();
    };

    const onSubmit: SubmitHandler<AddRequirementsPayload> = async () => {
        clearError();
        const values = form.getValues();

        const payload = {
            title: values.title,
            descriptions: values.descriptions,
            universityId: values.universityId,
            countryId: values.countryId,
            courseId: values.courseId,
            documentsCheckListDTOs: (values.documentsCheckListDTOs ?? []).map(
                (item) => ({
                    documenteTypeId: item.documenteTypeId,
                })
            ),
        };

        await addRequirements.mutateAsync(payload);
        handleClose();
    };

    return (
        <div className="w-full h-full bg-white dark:bg-[#27272a] p-4 overflow-auto relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Add Requirements</h1>

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

                    <InputElement
                        label="Title"
                        form={form}
                        name="title"
                        required
                    />

                    <InputElement
                        label="Descriptions"
                        form={form}
                        name="descriptions"
                        required
                    />

                    {/* COUNTRY */}
                    <AppCombobox
                        value={countryId}
                        name="countryId"
                        label="Country"
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

                {/* DOCUMENTS */}
                <div className="mt-8">
                    <h2 className="font-semibold mb-4">DocType Items</h2>

                    {fields.length === 0 && (
                        <button
                            type="button"
                            onClick={() =>
                                append({ documenteTypeId: '' })
                            }
                            className="px-4 py-2 bg-black text-white rounded"
                        >
                            Add Item
                        </button>
                    )}

                    {fields.map((field, index) => {
                        const docValue = form.watch(
                            `documentsCheckListDTOs.${index}.documenteTypeId`
                        );

                        return (
                            <div
                                key={field.id}
                                className="border p-4 rounded mb-4"
                            >
                                <div className="flex justify-between mb-3">
                                    <span>Item {index + 1}</span>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                append({
                                                    documenteTypeId: '',
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

                                <AppCombobox
                                    value={docValue}
                                    label="DocumentsType"
                                    name={`documentsCheckListDTOs.${index}.documenteTypeId`}
                                    form={form}
                                    options={documentType || []}
                                    selected={
                                        documentType?.find(
                                            (x) => x.id === docValue
                                        ) || null
                                    }
                                    onSelect={(item) => {
                                        form.setValue(
                                            `documentsCheckListDTOs.${index}.documenteTypeId`,
                                            item?.id ?? '',
                                            {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            }
                                        );
                                    }}
                                    getLabel={(i) => i?.name ?? ''}
                                    getValue={(i) => i?.id ?? ''}
                                />
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

export default AddRequirementsForm;