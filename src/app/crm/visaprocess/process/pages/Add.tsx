'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { IVisaApplication } from '../types/Ivisaapplication'
import AddVisaApplicationForm from '../component/AddvisaApplication'

type Props = {
    isOpen: boolean
    onClose: () => void
    refetch: () => void
}

export const AddVisaApplicationModal = ({
    isOpen,
    onClose,
    refetch,
}: Props) => {
    const form = useForm<IVisaApplication>({
        defaultValues: {
            applicantId: '',
            countryId: '',
            universityId: '',
            courseId: '',
            intakeId: '',
            appliedDate: '',
            visaStatusId: '',
            visaDetails: '',
            emailSent: false,
            emailContent: '',
        },
    })

    // ✅ safer reset
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => form.reset(), 200)
        }
    }, [isOpen, form])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BACKDROP */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* MODAL CARD */}
            <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto bg-white dark:bg-[#2b2b2b] rounded-2xl shadow-2xl z-50">

                <AddVisaApplicationForm
                    form={form}
                    onClose={() => {
                        form.reset()
                        onClose()
                        refetch()
                    }}
                />

            </div>
        </div>
    )
}