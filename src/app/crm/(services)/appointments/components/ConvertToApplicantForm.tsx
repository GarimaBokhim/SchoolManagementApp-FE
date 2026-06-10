'use client'

import { useState } from 'react'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { AppCombobox } from '@/components/Input/ComboBox'
import {
    useConvertToApplicant,
    useGetAllCountry,
    useGetCourseByUniversity,
    useGetUniversityByCountry
} from '../hooks'
import { ConvertToApplicantPayload } from '../types/IAppointment'
import useErrorHandler from '@/components/helpers/ErrorHandling'

type Props = {
    form: UseFormReturn<ConvertToApplicantPayload>
    userId: string
}

const ConvertToApplicantForm = ({ form, userId }: Props) => {
    const convertToApplicant = useConvertToApplicant();
    const { handleError, clearError } = useErrorHandler();
    const { data: country } = useGetAllCountry();


    const [selecteduniversityId, setSelectedUniversityId] = useState<string | null>("");
    const [sellectedCountryId, setSelectedCountryId] = useState<string | null>("");
    const [sellecteCourseId, setSelectedCourseId] = useState<string | null>("");



    const { data: universityByCountry } = useGetUniversityByCountry(sellectedCountryId);
    const { data: courseByUniversity } = useGetCourseByUniversity(selecteduniversityId);


    const handleClose = () => {
        form.reset({
            userId: "",
            passportNo: "",
            countryId: "",
            universityId: "",
            courseId: ""

        });
        setSelectedCountryId(null)
        setSelectedCourseId(null)
        setSelectedUniversityId(null)
    };


    const onSubmit: SubmitHandler<ConvertToApplicantPayload> = async () => {
        clearError();
        const values = form.getValues();

        const payload = {
            userId: userId,
            passportNo: values.passportNo,
            countryId: values.countryId,
            universityId: values.universityId,
            courseId: values.courseId
        };

        await convertToApplicant.mutateAsync(payload);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">
                Convert To Applicant
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

                    <InputElement
                        label="PassportNo"
                        form={form}
                        name="passportNo"
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

                                setSelectedCourseId(courseId || null)


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

        </div>
    )
}

export default ConvertToApplicantForm