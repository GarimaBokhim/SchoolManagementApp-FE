'use client'
import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddCoursePayload } from '../types/ICourse'
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddCourse, useGetAllUniversity } from "../hooks";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";

type Props = {
    form: UseFormReturn<AddCoursePayload>;
    onClose: () => void;
    UniversityId: string | null
};
const AddCourseForm = ({ form, onClose, UniversityId }: Props) => {
    const addCourse = useAddCourse();
    const { handleError, clearError } = useErrorHandler();
    const { data: university } = useGetAllUniversity();
    const [sellectedUniversityId, setSelectedUniversityId] = useState<string | null>("");

    const [studyLevel, setStudyLevel] = useState<number | null>(null);


    const handleClose = () => {
        form.reset({
            title: "",
            studyLevel: 0,
            tuationFee: 0,
            currency: "",
            universityId: ""
        });
        setSelectedUniversityId(null)
        onClose()
    };


    const onSubmit: SubmitHandler<AddCoursePayload> = async () => {
        clearError();
        const values = form.getValues();

        const payload = {
            title: values.title,
            studyLevel: values.studyLevel,
            tuationFee: values.tuationFee,
            currency: values.currency,
            universityId: UniversityId?.trim() ? UniversityId : values.universityId,

        };

        await addCourse.mutateAsync(payload);
        handleClose();
        onClose();
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add Course
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
                                required
                            />

                            <AppCombobox
                                label="StudyLevel"
                                dropdownPositionClass="absolute"
                                name="studyLevel"
                                form={form}
                                value={studyLevel}
                                options={[
                                    { id: 1, name: 'Bachelor' },
                                    { id: 2, name: 'Undergraduate' },
                                    { id: 3, name: 'Masters' },
                                    { id: 4, name: 'PhD' }
                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 1, name: 'Bachelor' },
                                        { id: 2, name: 'Undergraduate' },
                                        { id: 3, name: 'Masters' },
                                        { id: 4, name: 'PhD' }
                                    ].find((g) => g.id === studyLevel) || null
                                }
                                onSelect={(option) => {
                                    setStudyLevel(option?.id ?? null);
                                    form.setValue('studyLevel', option?.id ?? 0);
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
                            />

                            <InputElement
                                label="Currency"
                                form={form}
                                name="currency"
                                required
                            />

                            <InputElement
                                label="TuationFee"
                                form={form}
                                name="tuationFee"
                                required
                            />



                            {!UniversityId &&
                                <AppCombobox
                                    value={sellectedUniversityId}
                                    dropDownWidth="w-full"
                                    dropdownPositionClass="absolute z-20"
                                    label="University"
                                    name="universityId"
                                    form={form}
                                    required
                                    options={university || []}
                                    selected={
                                        university?.find(
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
                            }



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

export default AddCourseForm;
