"use client";

import { WaterBillingRuleSlabResponse } from "../types/IWaterBillingRuleSlab";
import AddWaterBillingRuleSlab from "./Add";

interface Props {
    visible: boolean;
    onClose: () => void;
    waterBillingRuleSlab: WaterBillingRuleSlabResponse | null;
}

const EditWaterBillingRuleSlab = ({ visible, onClose, waterBillingRuleSlab }: Props) => {
    if (!waterBillingRuleSlab) return null;

    return (
        <AddWaterBillingRuleSlab
            visible={visible}
            onClose={onClose}
            waterBillingRuleSlab={waterBillingRuleSlab}
        />
    );
};

export default EditWaterBillingRuleSlab;