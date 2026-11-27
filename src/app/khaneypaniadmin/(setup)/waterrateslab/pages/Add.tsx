'use client'

import { useForm } from 'react-hook-form'
import AddWaterRateSlabForm from '../components/AddWaterRateSlabForm'
import {
    AddWaterRateSlabPayload,
} from '../types/IWaterRateSlab'

interface Props {
    visible: boolean
    onClose?: () => void
}

const AddWaterRateSlab = ({ visible, onClose }: Props) => {
    const form = useForm<AddWaterRateSlabPayload>({
        defaultValues: {
            waterTariffId: '',
            name: '',
            newRateSlabs: [{ toUnit: 0, ratePerUnit: 0 }],
        },
    })

    if (!visible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm md:items-center">
            <div className="h-full max-h-[92vh] w-full max-w-[95vw] overflow-auto rounded-lg bg-[#FBFBFB] p-6 shadow-lg dark:bg-[#27272a] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]">
                <AddWaterRateSlabForm
                    form={form}
                    onClose={() => onClose?.()}
                />
            </div>
        </div>
    )
}

export default AddWaterRateSlab
