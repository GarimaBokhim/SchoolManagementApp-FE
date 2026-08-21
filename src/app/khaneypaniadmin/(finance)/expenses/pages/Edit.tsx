"use client";

import { WaterExpensesResponse } from "../types/IWaterExpenses";
import AddWaterExpenses from "./Add";

interface Props {
    visible: boolean;
    onClose: () => void;
    waterExpenses: WaterExpensesResponse | null;
}

const EditWaterExpenses = ({ visible, onClose, waterExpenses }: Props) => {
    if (!waterExpenses) return null;

    return (
        <AddWaterExpenses
            visible={visible}
            onClose={onClose}
            waterExpenses={waterExpenses}
        />
    );
};

export default EditWaterExpenses;