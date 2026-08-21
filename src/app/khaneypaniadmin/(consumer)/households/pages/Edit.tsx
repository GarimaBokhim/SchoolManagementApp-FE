"use client";

import { HouseHoldsResponse } from "../types/IHouseHolds";
import AddHouseHolds from "./Add";

interface Props {
    visible: boolean;
    onClose: () => void;
    household: HouseHoldsResponse | null;
}

const EditHouseHolds = ({ visible, onClose, household }: Props) => {
    if (!household) return null;

    return (
        <AddHouseHolds
            visible={visible}
            onClose={onClose}
            household={household}
        />
    );
};

export default EditHouseHolds;