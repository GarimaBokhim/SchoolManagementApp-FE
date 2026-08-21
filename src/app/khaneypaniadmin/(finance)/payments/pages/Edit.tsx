"use client";

import { WaterPaymentsResponse } from "../types/IWaterPayments";
import AddWaterPayments from "./Add";

interface Props {
    visible: boolean;
    onClose: () => void;
    waterPayment: WaterPaymentsResponse | null;
}

const EditWaterPayments = ({ visible, onClose, waterPayment }: Props) => {
    if (!waterPayment) return null;

    return (
        <AddWaterPayments
            visible={visible}
            onClose={onClose}
            waterPayment={waterPayment}
        />
    );
};

export default EditWaterPayments;