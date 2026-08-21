"use client";

import { WaterBillingRuleResponse } from "../types/IWaterBillingRule";
import AddWaterBillingRule from "./Add";

interface Props {
    visible: boolean;
    onClose: () => void;
    waterBillingRule: WaterBillingRuleResponse | null;
}

const EditWaterBillingRule = ({ visible, onClose, waterBillingRule }: Props) => {
    if (!waterBillingRule) return null;

    return (
        <AddWaterBillingRule
            visible={visible}
            onClose={onClose}
            waterBillingRule={waterBillingRule}
        />
    );
};

export default EditWaterBillingRule;