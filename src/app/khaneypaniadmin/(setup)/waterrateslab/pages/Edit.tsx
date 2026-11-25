'use client'

import { WaterRateSlabResponse } from '../types/IWaterRateSlab'
import EditWaterRateSlabForm from '../components/EditWaterRateSlabForm'

interface Props {
    visible: boolean
    onClose: () => void
    waterRateSlab: WaterRateSlabResponse | null
}

const EditWaterRateSlab = ({ visible, onClose, waterRateSlab }: Props) => {
    if (!visible || !waterRateSlab) return null

    return (
        <EditWaterRateSlabForm key={waterRateSlab.id} onClose={onClose} waterRateSlab={waterRateSlab} />
    )
}

export default EditWaterRateSlab
