"use client";

import { TrainingRegistrationResponse } from '../types/ITrainingRegistration';
import AddTrainingRegistration from './Add';

interface Props {
  visible: boolean;
  onClose: () => void;
  trainingRegistration: TrainingRegistrationResponse | null;
}

const EditTrainingRegistration = ({
  visible,
  onClose,
  trainingRegistration,
}: Props) => {
  if (!trainingRegistration) return null;

  return (
    <AddTrainingRegistration
      visible={visible}
      onClose={onClose}
      trainingRegistration={trainingRegistration}
    />
  );
};

export default EditTrainingRegistration;
