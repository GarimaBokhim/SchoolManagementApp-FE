'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddVisaApplicationPayload } from '../types/IVisaApplication'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddVisaApplication, useGetAllApplicants, useGetAllCountry, useGetAllCourse, useGetAllIntake, useGetAllUniversity, useGetAllVisaStatus } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';

type Props = {
    form: UseFormReturn<AddVisaApplicationPayload>;
    onClose: () => void;
};
const AddVisaApplicationForm = ({ form, onClose }: Props) => {
    const addVisaApplication = useAddVisaApplication();
    const { handleError, clearError } = useErrorHandler();
    const { data: allapplicant } = useGetAllApplicants();
    const { data: allCountry } = useGetAllCountry();
    const { data: allUniversity } = useGetAllUniversity();
    const { data: allCourse } = useGetAllCourse();
    const { data: allintake = [] } = useGetAllIntake();
    const { data: allVisaStatus } = useGetAllVisaStatus();

    const emailSent = form.watch('emailSent')


    const [sellectedApplicantId, setSelectedApplicantId] = useState<string | null>("");
    const [sellectedCountryId, setSelectedCountryId] = useState<string | null>("");
    const [sellectedUniversityId, setSelectedUniversityId] = useState<string | null>("");
    const [sellectedCourseId, setSelectedCourseId] = useState<string | null>("");
    const [sellectedIntakeId, setSelectedIntakeId] = useState<string | null>("");
    const [sellectedVisaStatusId, setSelectedVisaStatusId] = useState<string | null>("");

    const handleClose = () => {
        form.reset({
            applicantId: "",
            countryId: "",
            universityId: "",
            courseId: "",
            intakeId: "",
            appliedDate: "",
            visaStatusId: "",
            visaDetails: "",
            emailSent: false,
            emailContent: "",
            visaApplicationDocumentsDTOs: [
                {
                    documentTypeId: "",
                    documentStatus: 0,
                    docLink: "",
                },
            ],

        });
        setSelectedApplicantId(null);
    };

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: 'visaApplicationDocumentsDTOs',
    })





    const onSubmit: SubmitHandler<AddVisaApplicationPayload> = async (data) => {
        clearError();
        const applicantId = String(data.applicantId ?? "").trim();
        if (!applicantId) {
            Toast.error("Please select applicant");
            return;
        }


        const countryId = String(data.countryId ?? "").trim();
        if (!countryId) {
            Toast.error("Please select countryId");
            return;
        }


        const universityId = String(data.universityId ?? "").trim();
        if (!universityId) {
            Toast.error("Please select universityId");
            return;
        }



        const courseId = String(data.courseId ?? "").trim();
        if (!courseId) {
            Toast.error("Please select courseId");
            return;
        }


        const intakeId = String(data.intakeId ?? "").trim();
        if (!intakeId) {
            Toast.error("Please select intakeId");
            return;
        }


        const visaStatusId = String(data.visaStatusId ?? "").trim();
        if (!visaStatusId) {
            Toast.error("Please select visaStatusId");
            return;
        }
        try {
            await addVisaApplication.mutateAsync({
                applicantId,
                countryId,
                universityId,
                courseId,
                intakeId,
                appliedDate: data.appliedDate,
                visaStatusId,
                emailSent: data.emailSent,
                visaDetails: data.visaDetails,
                emailContent: data.emailContent,
                visaApplicationDocumentsDTOs:
                    data.visaApplicationDocumentsDTOs ?? [],
            })

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
                            Add Visa Application
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



                            <AppCombobox
                                value={sellectedApplicantId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Applicant"
                                name="applicantId"
                                form={form}
                                required
                                options={allapplicant || []}
                                selected={
                                    allapplicant?.find(
                                        (g) => g.id === sellectedApplicantId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? "";

                                        setSelectedApplicantId(id || null);

                                        form.setValue("applicantId", id, {
                                            shouldValidate: true,
                                        });
                                    } else {
                                        setSelectedApplicantId(null);

                                        form.setValue("applicantId", "", {
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                getLabel={(g) => g?.fullName ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />


                            <AppCombobox
                                value={sellectedCountryId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Country"
                                name="countryId"
                                form={form}
                                required
                                options={allCountry || []}
                                selected={
                                    allCountry?.find(
                                        (g) => g.id === sellectedCountryId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? "";

                                        setSelectedCountryId(id || null);

                                        form.setValue("countryId", id, {
                                            shouldValidate: true,
                                        });
                                    } else {
                                        setSelectedCountryId(null);

                                        form.setValue("countryId", "", {
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                getLabel={(g) => g?.name ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />



                            <AppCombobox
                                value={sellectedUniversityId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="University"
                                name="universityId"
                                form={form}
                                required
                                options={allUniversity || []}
                                selected={
                                    allUniversity?.find(
                                        (g) => g.id === sellectedUniversityId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? "";

                                        setSelectedUniversityId(id || null);

                                        form.setValue("universityId", id, {
                                            shouldValidate: true,
                                        });
                                    } else {
                                        setSelectedUniversityId(null);

                                        form.setValue("universityId", "", {
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                getLabel={(g) => g?.name ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />

                            <AppCombobox
                                value={sellectedCourseId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Course"
                                name="courseId"
                                form={form}
                                required
                                options={allCourse || []}
                                selected={
                                    allCourse?.find(
                                        (g) => g.id === sellectedCourseId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? "";

                                        setSelectedCourseId(id || null);

                                        form.setValue("courseId", id, {
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

                            <AppCombobox
                                label="Intake"
                                dropdownPositionClass="absolute"
                                name="intakeId"
                                form={form}
                                value={sellectedIntakeId}
                                options={
                                    allintake.map((item) => ({
                                        id: item.id,
                                        name:
                                            item.month === 1 ? 'January' :
                                                item.month === 2 ? 'February' :
                                                    item.month === 3 ? 'March' :
                                                        item.month === 4 ? 'April' :
                                                            item.month === 5 ? 'May' :
                                                                item.month === 6 ? 'June' :
                                                                    item.month === 7 ? 'July' :
                                                                        item.month === 8 ? 'August' :
                                                                            item.month === 9 ? 'September' :
                                                                                item.month === 10 ? 'October' :
                                                                                    item.month === 11 ? 'November' :
                                                                                        item.month === 12 ? 'December' :
                                                                                            ''
                                    }))
                                }
                                dropDownWidth="w-full"
                                selected={
                                    allintake
                                        .map((item) => ({
                                            id: item.id,
                                            name:
                                                item.month === 1 ? 'January' :
                                                    item.month === 2 ? 'February' :
                                                        item.month === 3 ? 'March' :
                                                            item.month === 4 ? 'April' :
                                                                item.month === 5 ? 'May' :
                                                                    item.month === 6 ? 'June' :
                                                                        item.month === 7 ? 'July' :
                                                                            item.month === 8 ? 'August' :
                                                                                item.month === 9 ? 'September' :
                                                                                    item.month === 10 ? 'October' :
                                                                                        item.month === 11 ? 'November' :
                                                                                            item.month === 12 ? 'December' :
                                                                                                ''
                                        }))
                                        .find((g) => g.id === sellectedIntakeId) || null
                                }
                                onSelect={(option) => {
                                    setSelectedIntakeId(option?.id ?? null);
                                    form.setValue('intakeId', option?.id ?? '');
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id || ''}
                            />



                            <AppCombobox
                                value={sellectedVisaStatusId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Visa Status"
                                name="visaStatusId"
                                form={form}
                                required
                                options={allVisaStatus || []}
                                selected={
                                    allVisaStatus?.find(
                                        (g) => g.id === sellectedVisaStatusId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? "";

                                        setSelectedVisaStatusId(id || null);

                                        form.setValue("visaStatusId", id, {
                                            shouldValidate: true,
                                        });
                                    } else {
                                        setSelectedVisaStatusId(null);

                                        form.setValue("visaStatusId", "", {
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                getLabel={(g) => g?.name ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />



                            <InputElement
                                label="AppliedDate"
                                form={form}
                                name="appliedDate"
                                inputType="date"
                                placeholder="Enter Applied Date"
                                required
                            />



                            <div className="flex flex-col gap-2">

                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Email Sent
                                </label>

                                <Controller
                                    control={form.control}
                                    name="emailSent"
                                    render={({ field }) => {
                                        const value = Boolean(field.value)

                                        return (
                                            <button
                                                type="button"
                                                onClick={() => field.onChange(!value)}
                                                className={`relative flex items-center h-7 w-14 rounded-full px-1 transition-colors duration-300 ${value
                                                    ? 'bg-green-500 justify-end'
                                                    : 'bg-gray-300 dark:bg-gray-600 justify-start'
                                                    }`}
                                            >
                                                <span className="h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300" />
                                            </button>
                                        )
                                    }}
                                />

                            </div>



                        </div>
                        {emailSent && (
                            <div className="mt-6">
                                <h2 className="text-sm font-medium mb-2">Email Content</h2>
                                <TextEditor
                                    content={form.watch('emailContent') || ''}
                                    onChange={(content) =>
                                        form.setValue('emailContent', content)
                                    }
                                />
                            </div>
                        )}

                        <div className="mt-6">
                            <h2 className="text-sm font-medium mb-2">Visa Details</h2>
                            <TextEditor
                                content={form.watch('visaDetails') || ''}
                                onChange={(content) =>
                                    form.setValue('visaDetails', content)
                                }
                            />
                        </div>


                        {/* ITEMS */}
                        <div className="mt-8">
                            <h2 className="font-semibold mb-4">Invoice Items</h2>

                            {fields.length === 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            description: "",
                                            quantity: 0,
                                            amount: 0,
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
                                                        documentTypeId: '',
                                                        documentStatus: 0,
                                                        docLink: '',
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
                                        <InputElement
                                            label="Document Type Id"
                                            form={form}
                                            name={`visaApplicationDocumentsDTOs.${index}.documentTypeId`}
                                            placeholder="Enter document type"
                                            required
                                        />

                                        <InputElement
                                            label="Document Status"
                                            form={form}
                                            name={`visaApplicationDocumentsDTOs.${index}.documentStatus`}
                                            inputType="number"
                                            placeholder="Enter status"
                                            required
                                        />

                                        <InputElement
                                            label="Document Link"
                                            form={form}
                                            name={`visaApplicationDocumentsDTOs.${index}.docLink`}
                                            placeholder="Enter document link"
                                            required
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
        </div >
    );
};

export default AddVisaApplicationForm;
