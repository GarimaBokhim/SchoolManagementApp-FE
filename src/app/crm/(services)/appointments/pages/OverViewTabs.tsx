'use client'

import TextEditor from '@/components/Input/TextEditor'
import { Building2, BookOpen, Globe } from 'lucide-react'
import { AppointmentResponse, UpdateAppointmentPayload } from '../types/IAppointment'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAppointentById, useUpdateAppointment } from '../hooks'
import { useEffect } from 'react'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import toast from 'react-hot-toast'
import { Toast } from '@/components/Toast/toast'
import { ButtonElement } from '@/components/Buttons/ButtonElement'

export interface Country {
    id: string
    name: string
}

interface OverviewTabProps {
    detail: any
    form: any
    leadEnquiryDetails: any
    countryData: Country[]
    universityData: any[]
    courseData: any[]
    AppointmentId: string
}

const OverviewTabs = ({
    detail,
    form,
    leadEnquiryDetails,
    countryData,
    universityData,
    courseData,
    AppointmentId
}: OverviewTabProps) => {
    if (!detail) return null

    const editAppointment = useUpdateAppointment();
    const { handleError, clearError } = useErrorHandler();
    const { handleSubmit, reset, watch, setValue } = form;
    const notes = watch("notes");

    const { data: AppointmentData } = useAppointentById(AppointmentId);

    useEffect(() => {
        if (!AppointmentData) return;

        reset({
            id: AppointmentData.id ?? "",
            counselorId: AppointmentData.counselorId ?? "",
            leadId: AppointmentData.leadId ?? "",
            appointmentDate: AppointmentData.appointmentDate ?? "",
            appointmentStatus: AppointmentData.appointmentStatus ?? 0,
            notes: AppointmentData.notes ?? "",
        });
    }, [AppointmentData, reset]);


    const onSubmit: SubmitHandler<UpdateAppointmentPayload> =
        async (data) => {
            clearError();
            try {
                const promise = editAppointment.mutateAsync({
                    id: AppointmentId,
                    payload: data,
                });

                await toast.promise(
                    promise,
                    {
                        loading: "Updating...",
                        success: (res: any) => res?.message,
                        error: (err: any) => err?.response?.data?.message,
                    }
                );

            } catch (error) {
                const errorMsg = handleError(error);
                Toast.error(errorMsg);
            }
        };

    return (
        <div className="grid grid-cols-1 md:grid-cols-[67%_33%] gap-4">

            {/* NOTES */}

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">

                <div className="mb-1">
                    <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                        NOTES
                    </h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextEditor
                        content={notes || ""}
                        onChange={(value: string) =>
                            setValue("notes", value, {
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                        }
                    />

                    {/* SUBMIT */}
                    <div className="flex justify-center mt-6">
                        <ButtonElement type="submit" text="Update" />
                    </div>

                </form>


            </div>

            {/* INQUIRY DETAILS */}

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">

                <div className="mb-5">
                    <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                        INQUIRY DETAILS
                    </h2>

                    <p className="text-xs text-zinc-500 mt-0.5">
                        Country → University → Courses
                    </p>
                </div>

                {leadEnquiryDetails?.Countries?.map((country: any) => (

                    <div
                        key={country.countryId}
                        className="border-l-2 border-blue-500 pl-4 mb-6"
                    >

                        {/* COUNTRY */}

                        <div className="flex items-center gap-2 mb-3">

                            <p className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">

                                <Globe className="h-4 w-4 shrink-0" />

                                {
                                    countryData?.find(
                                        c => c.id === country.countryId
                                    )?.name
                                }

                            </p>

                        </div>

                        {/* UNIVERSITIES */}

                        {country.Universities?.map((uni: any) => (

                            <div
                                key={uni.universityId}
                                className="mb-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3"
                            >

                                <div className="flex items-center gap-2 mb-2">

                                    <p className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">

                                        <Building2 className="h-5 w-5 shrink-0" />

                                        {
                                            universityData?.find(
                                                c => c.id === uni.universityId
                                            )?.name
                                        }

                                    </p>

                                </div>

                                {/* COURSES */}

                                <div className="flex flex-wrap gap-2">

                                    {uni.CourseIds?.map((courseId: any) => (

                                        <span
                                            key={courseId}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20"
                                        >

                                            <BookOpen className="h-3.5 w-3.5 shrink-0" />

                                            {
                                                courseData?.find(
                                                    c => c.id === courseId
                                                )?.title
                                            }

                                        </span>

                                    ))}

                                </div>

                            </div>

                        ))}

                    </div>

                ))}

            </div>

        </div>
    )
}

export default OverviewTabs