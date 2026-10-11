"use client";

import { ClassResponse } from '../types/IClass';
import AddClasses from './Add';

interface Props {
  visible: boolean;
  onClose: () => void;
  classItem: ClassResponse | null;
}

const EditClass = ({ visible, onClose, classItem }: Props) => {
  if (!classItem) return null;

  return <AddClasses visible={visible} onClose={onClose} classItem={classItem} />;
};

export default EditClass;
