"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import AddVisaPortalForm from "../components/AddVisaPortalForm"
import { useVisaPortalById } from "../hooks"
import { VisaPortalFormPayload } from "../types/IVisaPortal"
import { VisaPortalSchema } from "../valuators/visaPortal.schema"

type Props = {
    visible: boolean
    onClose: () => void
    visaPortalId: string | null
}

const EditVisaPortal = ({ visible, onClose, visaPortalId }: Props) => {
    const { data: portal, isLoading, error } = useVisaPortalById(visible ? visaPortalId : null)
    const form = useForm<VisaPortalFormPayload>({
        defaultValues: {
            name: "",
            countryId: "",
            universityId: "",
            url: "",
            processingTimeInDays: 0,
            note: "",
        },
        resolver: yupResolver(VisaPortalSchema),
        mode: "onChange",
    })
    const { reset } = form

    useEffect(() => {
        if (!portal) return
        reset({
            name: portal.name ?? "",
            countryId: portal.countryId ?? "",
            universityId: portal.universityId ?? "",
            url: portal.url ?? "",
            processingTimeInDays: portal.processingTimeInDays ?? 0,
            note: portal.note ?? "",
        })
    }, [portal, reset])

    if (!visible) return null


    return (
        <div
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
        >
            <div
                className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[85vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
            >
                {isLoading ? (
                    <p className="p-6">Loading visa portal...</p>
                ) : error || !portal ? (
                    <div className="p-6">
                        <p className="mb-4">Unable to load visa portal details.</p>
                        <button type="button" onClick={onClose} className="text-blue-600">Close</button>
                    </div>
                ) : (
                    <AddVisaPortalForm
                        form={form}
                        onClose={onClose}
                        visaPortalId={visaPortalId ?? undefined}
                    />
                )}
            </div>
        </div>
    )
}

export default EditVisaPortal
