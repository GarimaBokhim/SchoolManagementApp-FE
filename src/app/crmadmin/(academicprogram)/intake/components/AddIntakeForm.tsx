'use client'

import { X } from 'lucide-react'
import { AddIntakePayload, UpdateIntakePayload } from '../types/IIntake'
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddIntake, useGetAllCountry, useGetCourseByUniversity, useGetUniversityByCountry, useUpdateIntake } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<UpdateIntakePayload>;
    onClose: () => void;
    intakeId?: string;
};
const AddIntakeForm = ({ form, onClose, intakeId }: Props) => {
    const addIntake = useAddIntake();
    const updateIntake = useUpdateIntake();
    const { handleError, clearError } = useErrorHandler();
    const { data: country } = useGetAllCountry();
    const countryId = form.watch("countryId");
    const universityId = form.watch("universityId");
    const courseId = form.watch("courseId");
    const month = Number(form.watch("month") ?? 0);
    const isOpen = form.watch("isOpen");
    const { data: universityByCountry } = useGetUniversityByCountry(countryId || null);
    const { data: courseByUniversity } = useGetCourseByUniversity(universityId || null);
    const isEditing = Boolean(intakeId);

    const handleClose = () => {
        form.reset({
            id: "",
            intakeName: "",
            month: 0,
            deadline: "",
            isOpen: true,
            countryId: "",
            universityId: "",
            courseId: ""

        });
        onClose()
    };

    const onSubmit: SubmitHandler<UpdateIntakePayload> = async (data) => {
        clearError();
        try {
            const payload = {
                id: intakeId ?? "",
                intakeName: data.intakeName,
                month: data.month,
                deadline: data.deadline,
                isOpen: data.isOpen,
                countryId: data.countryId,
                universityId: data.universityId,
                courseId: data.courseId,
            };

            if (intakeId) {
                await updateIntake.mutateAsync({ id: intakeId, payload });
            } else {
                const addPayload: AddIntakePayload = {
                    intakeName: payload.intakeName,
                    month: payload.month,
                    deadline: payload.deadline,
                    isOpen: payload.isOpen,
                    countryId: payload.countryId,
                    universityId: payload.universityId,
                    courseId: payload.courseId,
                };
                await addIntake.mutateAsync(addPayload);
            }

            handleClose()
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
                            {isEditing ? "Update Intake" : "Add Intake"}
                        </h1>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-red-400 text-2xl hover:text-red-500"
                            aria-label="Close"
                        >
                            <X strokeWidth={3} />
                        </button>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

                            <InputElement
                                label="Name"
                                form={form}
                                name="intakeName"
                                required
                            />

                            <AppCombobox
                                label="Month"
                                dropdownPositionClass="absolute"
                                name="month"
                                form={form}
                                value={month}
                                options={[
                                    { id: 1, name: 'January' },
                                    { id: 2, name: 'February' },
                                    { id: 3, name: 'March' },
                                    { id: 4, name: 'April' },
                                    { id: 5, name: 'May' },
                                    { id: 6, name: 'June' },
                                    { id: 7, name: 'July' },
                                    { id: 8, name: 'August' },
                                    { id: 9, name: 'September' },
                                    { id: 10, name: 'October' },
                                    { id: 11, name: 'November' },
                                    { id: 12, name: 'December' }
                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 1, name: 'January' },
                                        { id: 2, name: 'February' },
                                        { id: 3, name: 'March' },
                                        { id: 4, name: 'April' },
                                        { id: 5, name: 'May' },
                                        { id: 6, name: 'June' },
                                        { id: 7, name: 'July' },
                                        { id: 8, name: 'August' },
                                        { id: 9, name: 'September' },
                                        { id: 10, name: 'October' },
                                        { id: 11, name: 'November' },
                                        { id: 12, name: 'December' }
                                    ].find((g) => g.id === month) || null
                                }
                                onSelect={(option) => {
                                    form.setValue('month', option?.id ?? 0, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
                            />

                            <InputElement
                                label="Deadline"
                                form={form}
                                name="deadline"
                                inputType="date"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => form.setValue("isOpen", !isOpen, {
                                    shouldDirty: true,
                                })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isOpen ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${isOpen ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>


                            <AppCombobox
                                value={countryId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Country"
                                name="countryId"
                                form={form}
                                required
                                options={country || []}
                                selected={
                                    country?.find(
                                        (item) => item.id === countryId
                                    ) || null
                                }
                                onSelect={(item) => {
                                    const selectedCountryId = item?.id ?? "";
                                    form.setValue("countryId", selectedCountryId, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                    form.setValue("universityId", "", { shouldDirty: true });
                                    form.setValue("courseId", "", { shouldDirty: true });
                                }}
                                getLabel={(item) => item?.name ?? ""}
                                getValue={(item) => item?.id ?? ""}
                            />


                            <AppCombobox
                                value={universityId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="University"
                                name="universityId"
                                form={form}
                                required
                                options={universityByCountry || []}
                                selected={
                                    universityByCountry?.find(
                                        (item) => item.id === universityId
                                    ) || null
                                }
                                onSelect={(item) => {
                                    const selectedUniversityId = item?.id ?? "";
                                    form.setValue("universityId", selectedUniversityId, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                    form.setValue("courseId", "", { shouldDirty: true });



                                }}
                                getLabel={(item) => item?.name ?? ""}
                                getValue={(item) => item?.id ?? ""}
                            />



                            <AppCombobox
                                value={courseId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Course"
                                name="courseId"
                                form={form}
                                required
                                options={courseByUniversity || []}
                                selected={
                                    courseByUniversity?.find(
                                        (g) => g.id === courseId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        form.setValue("courseId", group.id ?? "", {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });
                                    } else {
                                        form.setValue("courseId", "", {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });
                                    }
                                }}
                                getLabel={(g) => g?.title ?? ""}
                                getValue={(g) => g?.id ?? ""}
                            />




                        </div>
                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={isEditing ? "Update Intake" : "Submit"}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default AddIntakeForm;
