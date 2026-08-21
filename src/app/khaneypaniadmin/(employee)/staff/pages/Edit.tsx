"use client";

import { StaffResponse } from "../types/IStaff";
import AddStaff from "./Add";

interface Props {
    visible: boolean;
    onClose: () => void;
    staff: StaffResponse | null;
}

const EditStaff = ({ visible, onClose, staff }: Props) => {
    if (!staff) return null;

    return <AddStaff visible={visible} onClose={onClose} staff={staff} />;
};

export default EditStaff;