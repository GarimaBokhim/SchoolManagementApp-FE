'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AddIntakePayload } from '../types/IIntake'
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddIntake, useGetAllCountry, useGetCourseByUniversity, useGetAllIntake, useGetUniversityByCountry } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddIntakePayload>;
    onClose: () => void;
};
const AddIntakeForm = ({ form, onClose }: Props) => {
    const addIntake = useAddIntake();
    const { handleError, clearError } = useErrorHandler();
    const { data: country } = useGetAllCountry();
    const [sellectedCountryId, setSelectedCountryId] = useState<string | null>("");
    const [sellectedUniversityId, setSelectedUniversityId] = useState<string | null>("");
    const [sellectedCourseId, setSelectedCourseId] = useState<string | null>("");
    const { data: universityByCountry } = useGetUniversityByCountry(sellectedCountryId);
    const { data: courseByUniversity } = useGetCourseByUniversity(sellectedUniversityId);
    const [isOpen, setIsOpen] = useState(true);

    const [month, setMonth] = useState<number | null>(null);

    const handleClose = () => {
        form.reset({
            month: 0,
            deadline: "",
            isOpen: true,
            countryId: "",
            universityId: "",
            courseId: ""

        });
        setSelectedCountryId(null)
        setSelectedUniversityId(null)
        setSelectedCourseId(null)
        onClose()
    };

    const onSubmit: SubmitHandler<AddIntakePayload> = async (data) => {
        clearError();
        try {
            await addIntake.mutateAsync({
                month: data.month,
                deadline: data.deadline,
                isOpen: data.isOpen,
                countryId: data.countryId,
                universityId: data.universityId,
                courseId: data.courseId,
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
                            Add Intake
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
                                    setMonth(option?.id ?? null);
                                    form.setValue('month', option?.id ?? 0);
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
                                onClick={() => setIsOpen(!isOpen)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isOpen ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${isOpen ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>


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
                                value={sellectedUniversityId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="University"
                                name="universityId"
                                form={form}
                                required
                                options={universityByCountry || []}
                                selected={
                                    universityByCountry?.find(
                                        (item) => item.id === sellectedUniversityId
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
                                value={sellectedCourseId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Course"
                                name="courseId"
                                form={form}
                                required
                                options={courseByUniversity || []}
                                selected={
                                    courseByUniversity?.find(
                                        (g) => g.id === sellectedCourseId
                                    ) || null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const courseId = group.id ?? "";

                                        setSelectedCourseId(courseId || null);

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
                        <div className="flex justify-center mt-6">
                            <ButtonElement type="submit" text={"Submit"} />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default AddIntakeForm;
