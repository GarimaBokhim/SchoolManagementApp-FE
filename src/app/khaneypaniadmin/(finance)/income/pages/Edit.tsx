"use client";

import { WaterIncomeResponse } from "../types/IWaterIncome";
import AddWaterIncome from "./Add";

interface Props {
    visible: boolean;
    onClose: () => void;
    waterIncome: WaterIncomeResponse | null;
}

const EditWaterIncome = ({ visible, onClose, waterIncome }: Props) => {
    if (!waterIncome) return null;

    return (
        <AddWaterIncome
            visible={visible}
            onClose={onClose}
            waterIncome={waterIncome}
        />
    );
};

export default EditWaterIncome;