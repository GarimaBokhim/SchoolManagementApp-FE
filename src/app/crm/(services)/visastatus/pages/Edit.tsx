"use client";

import { UpdateVisaStatusResponse } from '../types/IVisaStatus';
import AddVisaStatus from './Add';

interface Props {
  visible: boolean;
  onClose: () => void;
  visaStatus: UpdateVisaStatusResponse | null;
}

const EditVisaStatus = ({ visible, onClose, visaStatus }: Props) => {
  if (!visaStatus) return null;

  return (
    <AddVisaStatus
      visible={visible}
      onClose={onClose}
      visaStatus={visaStatus}
    />
  );
};

export default EditVisaStatus;
