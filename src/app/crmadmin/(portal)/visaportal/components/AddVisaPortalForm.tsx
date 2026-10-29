"use client"

import { SubmitHandler, UseFormReturn } from "react-hook-form"
import { InputElement } from "@/components/Input/InputElement"
import { ButtonElement } from "@/components/Buttons/ButtonElement"
import { AppCombobox } from "@/components/Input/ComboBox"
import {
    useAddVisaPortal,
    useGetVisaPortalCountries,
    useGetVisaPortalUniversities,
    useUpdateVisaPortal,
} from "../hooks"
import {
    AddVisaPortalPayload,
    VisaPortalFormPayload,
} from "../types/IVisaPortal"

type Props = {
    form: UseFormReturn<VisaPortalFormPayload>
    onClose: () => void
    visaPortalId?: string
}

const AddVisaPortalForm = ({ form, onClose, visaPortalId }: Props) => {
    const addVisaPortal = useAddVisaPortal()
    const updateVisaPortal = useUpdateVisaPortal()
    const isEditing = Boolean(visaPortalId)
    const countryId = form.watch("countryId")
    const universityId = form.watch("universityId")
    const { data: countries } = useGetVisaPortalCountries()
    const { data: universities } = useGetVisaPortalUniversities(countryId)

    const handleClose = () => {
        form.reset({
            name: "",
            countryId: "",
            universityId: "",
            url: "",
            processingTimeInDays: 0,
            note: "",
        })
        onClose()
    }

    const onSubmit: SubmitHandler<VisaPortalFormPayload> = (values) => {
        const payload: AddVisaPortalPayload = {
            name: values.name,
            countryId: values.countryId,
            universityId: values.universityId,
            url: values.url,
            processingTimeInDays: Number(values.processingTimeInDays),
            note: values.note,
        }

        if (visaPortalId) {
            updateVisaPortal.mutate(
                {
                    id: visaPortalId,
                    payload,
                },
                { onSuccess: handleClose }
            )
        } else {
            addVisaPortal.mutate(payload, { onSuccess: handleClose })
        }
    }

    const isPending = addVisaPortal.isPending || updateVisaPortal.isPending

    return (
        <div className="relative h-full w-full overflow-auto bg-white p-4 dark:bg-[#27272a]">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold">
                    {isEditing ? "Update Visa Portal" : "Add Visa Portal"}
                </h1>
                <button type="button" onClick={handleClose} className="text-red-500" aria-label="Close">
                    ×
                </button>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <InputElement label="Name" form={form} name="name" required />
                    <AppCombobox
                        value={countryId}
                        name="countryId"
                        label="Country"
                        form={form}
                        options={countries ?? []}
                        selected={countries?.find((country) => country.id === countryId) ?? null}
                        onSelect={(country) => {
                            form.setValue("countryId", country?.id ?? "", {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                            form.setValue("universityId", "", {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                        }}
                        getLabel={(country) => country?.name ?? ""}
                        getValue={(country) => country?.id ?? ""}
                    />
                    <AppCombobox
                        value={universityId}
                        name="universityId"
                        label="University"
                        form={form}
                        options={universities ?? []}
                        selected={universities?.find((university) => university.id === universityId) ?? null}
                        onSelect={(university) =>
                            form.setValue("universityId", university?.id ?? "", {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                        }
                        getLabel={(university) => university?.name ?? ""}
                        getValue={(university) => university?.id ?? ""}
                    />
                    <InputElement
                        label="URL"
                        form={form}
                        name="url"
                        inputType="text"
                        placeholder="https://example.com"
                        required
                    />
                    <InputElement
                        label="Processing Time (Days)"
                        form={form}
                        name="processingTimeInDays"
                        inputType="number"
                        min={1}
                        required
                    />
                    <InputElement label="Note" form={form} name="note" required />
                </div>

                <div className="mt-6 flex justify-center">
                    <ButtonElement
                        type="submit"
                        text={isPending ? "Saving..." : isEditing ? "Update Visa Portal" : "Add Visa Portal"}
                        disabled={isPending}
                    />
                </div>
            </form>
        </div>
    )
}

export default AddVisaPortalForm
