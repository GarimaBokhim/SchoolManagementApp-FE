"use client";

import { WaterBillingSetUpResponse } from "../types/IWaterBillingSetup";
import AddWaterBillingSetUp from "./Add";

interface Props {
    visible: boolean;
    onClose: () => void;
    waterBillingSetUp: WaterBillingSetUpResponse | null;
}

const EditWaterBillingSetUp = ({ visible, onClose, waterBillingSetUp }: Props) => {
    if (!waterBillingSetUp) return null;

    return (
        <AddWaterBillingSetUp
            visible={visible}
            onClose={onClose}
            waterBillingSetUp={waterBillingSetUp}
        />
    );
};

export default EditWaterBillingSetUp;