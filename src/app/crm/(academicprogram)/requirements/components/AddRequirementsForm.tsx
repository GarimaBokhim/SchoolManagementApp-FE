'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddRequirementsPayload } from '../types/IRequirements'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddRequirements, useGetAllCountry, useGetCourseByUniversity, useGetUniversityByCountry, useGetAllDocumentType } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddRequirementsPayload>;
    onClose: () => void;
};
const AddRequirementsForm = ({ form, onClose }: Props) => {
    const addRequirements = useAddRequirements();
    const { handleError, clearError } = useErrorHandler();
    const { data: country } = useGetAllCountry();
    const { data: documentType } = useGetAllDocumentType();

    const [sellecteDocumentsTypeId, setSelectedDocumentsTypeId] = useState<string | null>("");



    const [selecteduniversityId, setSelectedUniversityId] = useState<string | null>("");
    const [sellectedCountryId, setSelectedCountryId] = useState<string | null>("");
    const [sellecteCourseId, setSelectedCourseId] = useState<string | null>("");



    const { data: universityByCountry } = useGetUniversityByCountry(sellectedCountryId);
    const { data: courseByUniversity } = useGetCourseByUniversity(selecteduniversityId);

    const handleClose = () => {
        form.reset({
            title: "",
            descriptions: "",
            universityId: "",
            countryId: "",
            courseId: "",
            documentsCheckListDTOs: [
                {
                    documenteTypeId: ""
                }
            ]
        });
        setSelectedCountryId(null)
        setSelectedCourseId(null)
        setSelectedUniversityId(null)
        setSelectedDocumentsTypeId(null)
        onClose()
    };

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'documentsCheckListDTOs',
    })

    const onSubmit: SubmitHandler<AddRequirementsPayload> = async () => {
        clearError();
        const values = form.getValues();

        const payload = {
            title: values.title,
            descriptions: values.descriptions,
            universityId: values.universityId,
            countryId: values.countryId,
            courseId: values.courseId,
            documentsCheckListDTOs: (values.documentsCheckListDTOs ?? []).map(item => ({
                documenteTypeId: item.documenteTypeId,
            })),
        };

        await addRequirements.mutateAsync(payload);
        handleClose();
        onClose();
    };


    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add Requirements
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
                                label="Title"
                                form={form}
                                name="title"
                                placeholder="Enter Title"
                                required
                            />

                            <InputElement
                                label="Descriptions"
                                form={form}
                                name="descriptions"
                                placeholder="Enter descriptions"
                                required
                            />

                            <AppCombobox
                                value={sellectedCountryId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Country"
                                name="countryId"
                                form={form}
                                required
                                options={country || []}
                                selected={
                                    country?.find(
                                        (item) => item.id === sellectedCountryId
                                    ) || null
                                }
                                onSelect={(item) => {
                                    const countryId = item?.id ?? "";

                                    setSelectedCountryId(countryId || null);
                                    setSelectedUniversityId(null);

                                    form.setValue("countryId", countryId, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });

                                }}
                                getLabel={(item) => item?.name ?? ""}
                                getValue={(item) => item?.id ?? ""}
                            />


                            <AppCombobox
                                value={selecteduniversityId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="University"
                                name="universityId"
                                form={form}
                                required
                                options={universityByCountry || []}
                                selected={
                                    universityByCountry?.find(
                                        (item) => item.id === selecteduniversityId
                                    ) || null
                                }
                                onSelect={(item) => {
                                    const universityId = item?.id ?? "";

                                    setSelectedUniversityId(universityId || null);
                                    setSelectedCourseId(null);


                                    form.setValue("universityId", universityId, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });



                                }}
                                getLabel={(item) => item?.name ?? ""}
                                getValue={(item) => item?.id ?? ""}
                            />



                            <AppCombobox
                                value={sellecteCourseId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Course"
                                name="courseId"
                                form={form}
                                required
                                options={courseByUniversity || []}
                                selected={
                                    courseByUniversity?.find(
                                        (g) => g.id === selecteduniversityId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const courseId = group.id ?? "";

                                        setSelectedCourseId(courseId || null);
                                        setSelectedDocumentsTypeId(null)

                                        form.setValue("courseId", courseId, {
                                            shouldValidate: true,
                                        });
                                    } else {
                                        setSelectedCourseId(null);


                                        form.setValue("courseId", "", {
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                getLabel={(g) => g?.title ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />

                        </div>


                        {/* ITEMS */}
                        <div className="mt-8">
                            <h2 className="font-semibold mb-4">DocType Items</h2>

                            {fields.length === 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            documenteTypeId: ""
                                        })
                                    }
                                    className="px-4 py-2 bg-black text-white rounded"
                                >
                                    Add Item
                                </button>
                            )}

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="border p-4 rounded mb-4"
                                >
                                    <div className="flex justify-between mb-2">
                                        <span>Item {index + 1}</span>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    append({
                                                        documenteTypeId: ""
                                                    })
                                                }
                                            >
                                                <Plus />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">

                                        <AppCombobox
                                            value={sellecteDocumentsTypeId}
                                            dropDownWidth="w-full"
                                            dropdownPositionClass="absolute z-20"
                                            label="Document Type"
                                            name={`documentsCheckListDTOs.${index}.documenteTypeId`}
                                            form={form}
                                            required
                                            options={documentType || []}
                                            selected={
                                                documentType?.find(
                                                    (g) => g.id === sellecteDocumentsTypeId
                                                ) || null
                                            }
                                            onSelect={(group) => {
                                                if (group) {
                                                    const id = group.id ?? "";

                                                    setSelectedDocumentsTypeId(id);

                                                    form.setValue(
                                                        `documentsCheckListDTOs.${index}.documenteTypeId`,
                                                        id,
                                                        {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                        }
                                                    );
                                                } else {
                                                    setSelectedDocumentsTypeId(null);

                                                    form.setValue(
                                                        `documentsCheckListDTOs.${index}.documenteTypeId`,
                                                        "",
                                                        {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                        }
                                                    );
                                                }
                                            }}
                                            getLabel={(g) => g?.name ?? ""}
                                            getValue={(g) => g?.id ?? ""}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className="flex justify-center mt-6">
                            <ButtonElement type="submit" text={"Submit"} />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default AddRequirementsForm;
