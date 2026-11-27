'use client'

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { SubmitHandler, UseFormReturn, useFieldArray } from 'react-hook-form'
import { AppCombobox } from '@/components/Input/ComboBox'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import {
    useAddWaterRateSlab,
    useGetAssignedWaterTariffIds,
    useGetWaterTariffs,
} from '../hooks'
import {
    AddWaterRateSlabPayload,
} from '../types/IWaterRateSlab'

type Props = {
    form: UseFormReturn<AddWaterRateSlabPayload>
    onClose: () => void
}

const AddWaterRateSlabForm = ({ form, onClose }: Props) => {
    const addWaterRateSlab = useAddWaterRateSlab()
    const { handleError, clearError } = useErrorHandler()
    const { data: tariffs, isLoading: tariffsLoading, error: tariffsError } = useGetWaterTariffs()
    const {
        data: assignedTariffIds,
        isLoading: assignedTariffsLoading,
        error: assignedTariffsError,
    } = useGetAssignedWaterTariffIds()
    const [selectedTariffId, setSelectedTariffId] = useState<string>(
        form.getValues('waterTariffId') ?? '',
    )
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'newRateSlabs',
    })
    const selectedTariff = useMemo(
        () => tariffs?.find((tariff) => tariff.id === selectedTariffId),
        [selectedTariffId, tariffs],
    )
    const assignedTariffIdSet = useMemo(
        () => new Set(assignedTariffIds ?? []),
        [assignedTariffIds],
    )

    const handleClose = () => {
        form.reset({
            waterTariffId: '',
            name: '',
            newRateSlabs: [{ toUnit: 0, ratePerUnit: 0 }],
        })
        setSelectedTariffId('')
        onClose()
    }

    const onSubmit: SubmitHandler<AddWaterRateSlabPayload> = async (data) => {
        clearError()
        try {
            if (assignedTariffsLoading) {
                Toast.error('Still checking existing rate slab assignments.')
                return
            }
            if (assignedTariffsError) {
                Toast.error('Could not verify which tariffs already have rate slabs.')
                return
            }
            if (!selectedTariff) {
                form.setError('waterTariffId', {
                    type: 'required',
                    message: 'Select a water tariff.',
                })
                return
            }
            if (assignedTariffIdSet.has(selectedTariff.id)) {
                form.setError('waterTariffId', {
                    type: 'validate',
                    message: 'A rate slab is already assigned to this tariff.',
                })
                setSelectedTariffId('')
                form.setValue('waterTariffId', '')
                return
            }
            if (data.newRateSlabs.length === 0) {
                form.setError('newRateSlabs', {
                    type: 'required',
                    message: 'Add at least one rate slab.',
                })
                return
            }
            if (data.newRateSlabs.some((slab) => slab.ratePerUnit < 0)) {
                form.setError('newRateSlabs', {
                    type: 'validate',
                    message: 'Slab rates cannot be negative.',
                })
                return
            }
            const startingUnit = selectedTariff.minUnits + 1
            const invalidUnitRange = data.newRateSlabs.some((slab, index) => {
                if (index === data.newRateSlabs.length - 1) return false
                const fromUnit = index === 0
                    ? startingUnit
                    : data.newRateSlabs[index - 1].toUnit + 1
                return slab.toUnit < fromUnit
            })
            if (invalidUnitRange) {
                form.setError('newRateSlabs', {
                    type: 'validate',
                    message: 'Each slab end unit must be greater than its start unit.',
                })
                return
            }
            await addWaterRateSlab.mutateAsync(data)
            handleClose()
        } catch (error) {
            const errorMessage = handleError(error)
            Toast.error(errorMessage)
        }
    }

    return (
        <div className="inset-0 flex h-full w-full items-center justify-center">
            <div className="relative h-full w-full overflow-auto bg-white p-4 text-gray-800 dark:bg-[#27272a] dark:text-white">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                        Add Water Rate Slab
                    </h1>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-2xl text-red-400 hover:text-red-500"
                        aria-label="Close"
                    >
                        <X strokeWidth={3} />
                    </button>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <AppCombobox
                                    value={selectedTariffId}
                                    label="Water tariff"
                                    name="waterTariffId"
                                    form={form}
                                    required
                                    options={tariffs ?? []}
                                    selected={selectedTariff}
                                    isOptionDisabled={(tariff) => assignedTariffIdSet.has(tariff.id)}
                                    renderOptionExtra={(tariff) => (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {assignedTariffIdSet.has(tariff.id) ? 'Already assigned' : ''}
                                        </span>
                                    )}
                                    onSelect={(tariff) => {
                                        const id = tariff?.id ?? ''
                                        setSelectedTariffId(id)
                                        form.setValue('waterTariffId', id, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        })
                                        if (
                                            tariff &&
                                            form.getValues('newRateSlabs.0.toUnit') === 0
                                        ) {
                                            form.setValue(
                                                'newRateSlabs.0.toUnit',
                                                tariff.minUnits + 10,
                                            )
                                        }
                                        form.clearErrors('waterTariffId')
                                    }}
                                    getLabel={(tariff) =>
                                        `${tariff.name}${tariff.effectiveFrom ? ` (${tariff.effectiveFrom})` : ''}`
                                    }
                                    getValue={(tariff) => tariff.id}
                                    placeholder={
                                        tariffsLoading
                                            ? 'Loading tariffs...'
                                            : assignedTariffsLoading
                                              ? 'Checking assigned tariffs...'
                                              : 'Search tariffs...'
                                    }
                                    disabled={tariffsLoading || assignedTariffsLoading || Boolean(assignedTariffsError)}
                                    dropDownWidth="w-full"
                                    dropdownPositionClass="absolute z-20"
                                />
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Rate slab name
                                    <input
                                        {...form.register('name', { required: 'Enter a slab name.' })}
                                        className="mt-1 w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-gray-800 outline-none focus:border-[#4788CD] dark:bg-[#353535] dark:text-white"
                                        placeholder="Enter slab name"
                                    />
                                </label>
                            </div>
                            {tariffsError && (
                                <p className="text-sm text-red-500">
                                    Could not load water tariffs. Please try again.
                                </p>
                            )}
                            {assignedTariffsError && (
                                <p className="text-sm text-red-500">
                                    Could not check existing rate slab assignments. Reload the page and try again.
                                </p>
                            )}
                            {form.formState.errors.name?.message && (
                                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                            )}

                            {selectedTariff && (
                                <section className="space-y-3">
                                    <div>
                                        <h2 className="font-semibold">Rate slabs</h2>
                                        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                                            Slabs continue from the preceding end unit. The last slab is open-ended.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-[72px_1fr_1fr_auto] items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <span>Slab</span>
                                        <span>Units from – to</span>
                                        <span>Charge</span>
                                        <span />
                                    </div>

                                    <div className="grid grid-cols-[72px_1fr_1fr_auto] items-center gap-3">
                                        <strong className="text-sm">Minimum</strong>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            1 – {selectedTariff.minUnits} units
                                        </span>
                                        <span className="rounded-md border border-gray-300 bg-white px-3 py-3 text-sm dark:border-gray-600 dark:bg-[#353535]">
                                            रु {selectedTariff.minCharges}
                                            <span className="ml-2 text-gray-500 dark:text-gray-400">flat</span>
                                        </span>
                                        <span />
                                    </div>

                                    {fields.map((field, index) => {
                                        const fromUnit = index === 0
                                            ? selectedTariff.minUnits + 1
                                            : (form.watch(`newRateSlabs.${index - 1}.toUnit`) || 0) + 1
                                        return (
                                            <div
                                                key={field.id}
                                                className="grid grid-cols-[72px_1fr_1fr_auto] items-center gap-3"
                                            >
                                                <strong className="text-sm">Slab {index + 1}</strong>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                    <span>{fromUnit} –</span>
                                                    {index === fields.length - 1 ? (
                                                        <>
                                                            <span className="flex-1 font-medium text-gray-800 dark:text-white">and above</span>
                                                            <input
                                                                type="hidden"
                                                                {...form.register(`newRateSlabs.${index}.toUnit`, {
                                                                    valueAsNumber: true,
                                                                })}
                                                            />
                                                        </>
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            min={fromUnit}
                                                            {...form.register(`newRateSlabs.${index}.toUnit`, {
                                                                valueAsNumber: true,
                                                                required: true,
                                                                min: fromUnit,
                                                            })}
                                                            className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-3 text-gray-800 outline-none focus:border-[#4788CD] dark:border-gray-600 dark:bg-[#353535] dark:text-white"
                                                            aria-label={`Slab ${index + 1} ending unit`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 dark:border-gray-600 dark:bg-[#353535]">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">रु</span>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step="any"
                                                        {...form.register(`newRateSlabs.${index}.ratePerUnit`, {
                                                            valueAsNumber: true,
                                                            required: true,
                                                            min: 0,
                                                        })}
                                                        className="min-w-0 flex-1 bg-transparent px-2 py-3 text-gray-800 outline-none dark:text-white"
                                                        aria-label={`Slab ${index + 1} rate per unit`}
                                                    />
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">/unit</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                    className="p-2 text-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:text-white"
                                                    aria-label={`Remove slab ${index + 1}`}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )
                                    })}

                                    {form.formState.errors.newRateSlabs?.message && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.newRateSlabs.message}
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const previousToUnit =
                                                form.getValues(`newRateSlabs.${fields.length - 1}.toUnit`) || selectedTariff.minUnits
                                            append({
                                                toUnit: previousToUnit + 10,
                                                ratePerUnit: 0,
                                            })
                                        }}
                                        className="w-full rounded-lg border border-dashed border-gray-400 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        + Add slab
                                    </button>
                                </section>
                            )}
                    </>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div className="flex gap-2">
                            <ButtonElement
                                type="submit"
                                text="Save tariff"
                                disabled={addWaterRateSlab.isPending}
                            />
                            <ButtonElement
                                type="button"
                                text="Reset"
                                onClick={() => {
                                    form.reset({
                                        waterTariffId: '',
                                        name: '',
                                        newRateSlabs: [{ toUnit: 0, ratePerUnit: 0 }],
                                    })
                                    setSelectedTariffId('')
                                }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddWaterRateSlabForm
