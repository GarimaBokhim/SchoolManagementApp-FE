'use client'

import { useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { SubmitHandler, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import { useGetWaterRateSlab, useUpdateWaterRateSlab } from '../hooks'
import { UpdateWaterRateSlabPayload, WaterRateSlabResponse } from '../types/IWaterRateSlab'

type Props = {
    waterRateSlab: WaterRateSlabResponse
    onClose: () => void
}

const EditWaterRateSlabForm = ({ waterRateSlab, onClose }: Props) => {
    const form = useForm<UpdateWaterRateSlabPayload>({
        defaultValues: { name: waterRateSlab.name, slabs: [] },
    })
    const { fields, append, remove, update } = useFieldArray({ control: form.control, name: 'slabs' })
    const slabValues = useWatch({ control: form.control, name: 'slabs' }) ?? []
    const { data: slabs, isLoading, error } = useGetWaterRateSlab(waterRateSlab.id)
    const updateWaterRateSlab = useUpdateWaterRateSlab()
    const { handleError } = useErrorHandler()

    useEffect(() => {
        if (!slabs) return
        form.reset({
            name: waterRateSlab.name,
            slabs: slabs.map((slab) => ({
                slabNo: slab.SlabNumber,
                toUnit: slab.ToUnit,
                ratePerUnit: slab.RatePerUnit,
            })),
        })
    }, [form, slabs, waterRateSlab.name])

    const onSubmit: SubmitHandler<UpdateWaterRateSlabPayload> = async (payload) => {
        try {
            await updateWaterRateSlab.mutateAsync({
                id: waterRateSlab.id,
                payload,
            })
            onClose()
        } catch (submitError) {
            Toast.error(handleError(submitError))
        }
    }

    const removeSlab = (index: number) => {
        if (fields.length <= 1) return
        if (index === fields.length - 1) {
            const previousIndex = index - 1
            const previousSlab = slabValues[previousIndex]
            if (previousSlab) {
                update(previousIndex, { ...previousSlab, toUnit: null })
            }
        }
        remove(index)
    }

    const addSlab = () => {
        const lastIndex = fields.length - 1
        const lastSlab = slabValues[lastIndex]
        if (!lastSlab) return

        const lastFromUnit = slabs?.[lastIndex]?.FromUnit ?? 1
        const nextFromUnit = lastSlab.toUnit ?? lastFromUnit + 9

        update(lastIndex, { ...lastSlab, toUnit: nextFromUnit })
        append({
            slabNo: Math.max(...slabValues.map((slab) => slab.slabNo)) + 1,
            toUnit: null,
            ratePerUnit: 0,
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-[95vw] overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-[#27272a] md:max-w-[85vw] lg:max-w-[75vw]">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                        Edit Water Rate Slab
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-red-400 hover:text-red-500"
                        aria-label="Close"
                    >
                        <X strokeWidth={3} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
                    </div>
                ) : error ? (
                    <p className="py-8 text-center text-red-500">
                        {error instanceof Error ? error.message : 'Could not load slab details.'}
                    </p>
                ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Rate slab name
                            <input
                                {...form.register('name', { required: 'Enter a slab name.' })}
                                className="mt-1 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-gray-800 dark:bg-[#353535] dark:text-white"
                            />
                        </label>

                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-[#353535]">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Slab</th>
                                        <th className="px-4 py-3 text-left">Units from – to</th>
                                        <th className="px-4 py-3 text-left">Rate per unit</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((field, index) => {
                                        const previousEnd = index > 0
                                            ? slabValues[index - 1]?.toUnit
                                            : null
                                        const fromUnit = index > 0
                                            ? (previousEnd ?? 0) + 1
                                            : slabs?.[index]?.FromUnit ?? 0
                                        const isLast = index === fields.length - 1
                                        return (
                                            <tr key={field.id} className="border-t border-gray-200 dark:border-gray-700">
                                                <td className="px-4 py-3 font-medium">Slab {index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span>{fromUnit} –</span>
                                                        {isLast ? (
                                                            <span className="font-medium">and above</span>
                                                        ) : (
                                                            <input
                                                                type="number"
                                                                min={fromUnit}
                                                                {...form.register(`slabs.${index}.toUnit`, {
                                                                    valueAsNumber: true,
                                                                    required: true,
                                                                    min: fromUnit,
                                                                })}
                                                                className="w-36 rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-[#353535]"
                                                                aria-label={`Slab ${index + 1} ending unit`}
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex w-44 items-center rounded-md border border-gray-300 px-3 dark:border-gray-600">
                                                        <span>रु</span>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            step="any"
                                                            {...form.register(`slabs.${index}.ratePerUnit`, {
                                                                valueAsNumber: true,
                                                                required: true,
                                                                min: 0,
                                                            })}
                                                            className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none"
                                                            aria-label={`Slab ${index + 1} rate per unit`}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="relative mx-auto h-9 w-20">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSlab(index)}
                                                            disabled={fields.length === 1}
                                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-gray-700"
                                                            aria-label={`Remove slab ${index + 1}`}
                                                            title="Remove slab"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                        {isLast && (
                                                            <button
                                                                type="button"
                                                                onClick={addSlab}
                                                                className="absolute right-0 top-1/2 -translate-y-1/2 rounded p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
                                                                aria-label="Add slab row"
                                                                title="Add slab"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                            <ButtonElement type="button" text="Cancel" onClick={onClose} />
                            <ButtonElement
                                type="submit"
                                text="Update"
                                disabled={updateWaterRateSlab.isPending || fields.length === 0}
                            />
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default EditWaterRateSlabForm
