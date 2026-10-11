"use client";

import { VisaApplicationResponse } from "../types/IVisaApplication";
import AddVisaApplication from "./Add";

interface Props {
    visible: boolean;
    onClose: () => void;
    visaApplication: VisaApplicationResponse | null;
}

const EditVisaApplication = ({ visible, onClose, visaApplication }: Props) => {
    if (!visaApplication) return null;

    return (
        <AddVisaApplication
            visible={visible}
            onClose={onClose}
            visaApplication={visaApplication}
        />
    );
};

export default EditVisaApplication;
