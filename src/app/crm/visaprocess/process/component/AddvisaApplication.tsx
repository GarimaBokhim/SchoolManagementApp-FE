/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { useEffect } from 'react'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { X } from 'lucide-react'
import { useAddVisaApplication } from '../hooks'
import toast from 'react-hot-toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { AppCombobox } from '@/components/Input/ComboBox'

import {
    UseFilterIntakes,
    Usefiltervisastatus,
    useGetAllCountries,
    useGetAllCourses,
    useGetUniversities,
} from '@/app/crm/university/_university/hooks'

import { useGetAllApplicants } from '@/app/crm/documents/hooks'
import { IVisaApplication } from '../types/Ivisaapplication'
import TextEditor from '@/components/Input/TextEditor'

type Props = {
    form: UseFormReturn<IVisaApplication>
    onClose: () => void
}

const AddVisaApplicationForm = ({ form, onClose }: Props) => {
    const addVisaApplication = useAddVisaApplication()
    const { handleError, clearError } = useErrorHandler()

    const { data: applicants } = useGetAllApplicants()
    const { data: countries } = useGetAllCountries()
    const { data: universities } = useGetUniversities()
    const { data: courses } = useGetAllCourses()
    const { data: intakes } = UseFilterIntakes()
    const { data: visaStatuses } = Usefiltervisastatus()

    const emailSent = form.watch('emailSent')

    useEffect(() => {
        form.register('emailContent')
        form.register('visaDetails')
    }, [form])

    const handleClose = () => {
        form.reset()
        onClose()
    }
    useEffect(() => {
        if (intakes?.length && !form.getValues('intakeId')) {
            const firstIntake = intakes[0]

            if (firstIntake) {
                form.setValue('intakeId', firstIntake.id, {
                    shouldDirty: true,
                    shouldValidate: true,
                })
            }
        }
    }, [intakes])

    const onSubmit: SubmitHandler<IVisaApplication> = async (data) => {
        clearError()

        console.log('FINAL DATA:', data)

        try {
            await toast.promise(
                addVisaApplication.mutateAsync({
                    ...data,
                    emailContent: data.emailSent ? data.emailContent : '',
                    visaDetails: data.visaDetails,
                }),
                {
                    loading: 'Adding Visa Application...',
                    success: 'Successfully added Visa Application',
                    error: 'Failed to add Visa Application',
                }
            )

            handleClose()
        } catch (error) {
            const errorMsg = handleError(error)
            toast.error(errorMsg)
        }
    }

    return (
        <div className="fixed inset-0 z-50 ml-[17%] bg-white dark:bg-[#27272a] overflow-y-auto">

            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-[#27272a] dark:border-gray-700">
                <h1 className="text-xl font-semibold">
                    Add Visa Application
                </h1>

                <button
                    onClick={handleClose}
                    className="text-red-500 hover:text-red-600"
                >
                    <X size={22} />
                </button>
            </div>

            {/* CONTENT */}
            <div className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    {/* ROW 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AppCombobox
                            label="Applicant"
                            name="applicantId"
                            form={form}
                            options={applicants ?? []}
                            dropdownPositionClass="absolute"
                            selected={
                                applicants?.find(
                                    (a: any) => a.id === form.watch('applicantId')
                                ) || null
                            }
                            onSelect={(a: any) =>
                                form.setValue('applicantId', a?.id ?? '')
                            }
                            getLabel={(a: any) => a?.name ?? ''}
                            getValue={(a: any) => a?.id ?? ''}
                        />

                        <AppCombobox
                            label="Country"
                            name="countryId"
                            form={form}
                            options={countries ?? []}
                            dropdownPositionClass="absolute"
                            selected={
                                countries?.find(
                                    (c: any) => c.id === form.watch('countryId')
                                ) || null
                            }
                            onSelect={(c: any) =>
                                form.setValue('countryId', c?.id ?? '')
                            }
                            getLabel={(c: any) => c?.name ?? ''}
                            getValue={(c: any) => c?.id ?? ''}
                        />

                        <AppCombobox
                            label="University"
                            name="universityId"
                            form={form}
                            options={universities ?? []}
                            dropdownPositionClass="absolute"
                            selected={
                                universities?.find(
                                    (u: any) => u.id === form.watch('universityId')
                                ) || null
                            }
                            onSelect={(u: any) =>
                                form.setValue('universityId', u?.id ?? '')
                            }
                            getLabel={(u: any) => u?.name ?? ''}
                            getValue={(u: any) => u?.id ?? ''}
                        />

                        <AppCombobox
                            label="Course"
                            name="courseId"
                            form={form}
                            options={courses ?? []}
                            dropdownPositionClass="absolute"
                            selected={
                                courses?.find(
                                    (c: any) => c.id === form.watch('courseId')
                                ) || null
                            }
                            onSelect={(c: any) =>
                                form.setValue('courseId', c?.id ?? '')
                            }
                            getLabel={(c: any) => c?.title ?? ''}
                            getValue={(c: any) => c?.id ?? ''}
                        />
                    </div>

                    {/* ROW 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <AppCombobox
                            label="Intake"
                            name="intakeId"
                            form={form}
                            options={intakes ?? []}
                            dropdownPositionClass="absolute"
                            selected={
                                intakes?.find(
                                    (i: any) => i.id === form.watch('intakeId')
                                ) || null
                            }
                            onSelect={(i: any) =>
                                form.setValue('intakeId', i?.id ?? '')
                            }
                            getLabel={(i: any) => i?.name ?? ''}
                            getValue={(i: any) => i?.id ?? ''}
                        />

                        <AppCombobox
                            label="Visa Status"
                            name="visaStatusId"
                            form={form}
                            options={visaStatuses ?? []}
                            dropdownPositionClass="absolute"
                            selected={
                                visaStatuses?.find(
                                    (v: any) => v.id === form.watch('visaStatusId')
                                ) || null
                            }
                            onSelect={(v: any) =>
                                form.setValue('visaStatusId', v?.id ?? '')
                            }
                            getLabel={(v: any) => v?.name ?? ''}
                            getValue={(v: any) => v?.id ?? ''}
                        />

                        <InputElement
                            label="Applied Date"
                            name="appliedDate"
                            inputType="date"
                            form={form}
                        />
                        <div className="flex items-center gap-3 mt-[-4%]">
                            <input
                                type="checkbox"
                                {...form.register('emailSent')}
                                onChange={(e) => {
                                    const checked = e.target.checked
                                    form.setValue('emailSent', checked)

                                    if (!checked) {
                                        form.setValue('emailContent', '')
                                    }
                                }}
                            />
                            <label className="text-sm">
                                Send Email to Applicant
                            </label>
                        </div>
                    </div>

                    {/* VISA DETAILS EDITOR */}
                    <div className="mt-6">
                        <h2 className="text-sm font-medium mb-2">Visa Details</h2>
                        <TextEditor
                            content={form.watch('visaDetails') || ''}
                            onChange={(content) =>
                                form.setValue('visaDetails', content)
                            }
                        />
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

                    {/* SUBMIT */}
                    <div className="flex justify-center mt-8">
                        <ButtonElement type="submit" text="Submit" />
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddVisaApplicationForm