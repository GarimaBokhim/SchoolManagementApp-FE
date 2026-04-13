'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { IRequirementFormData } from '../types/IRequirement';
import { AddRequirementForm } from '../components/AddRequirementForm';
import { useCourses } from '../../courses/hooks/useCourses';

interface AddRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddRequirementModal: React.FC<AddRequirementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { allCourses } = useCourses();

  const form = useForm<IRequirementFormData>({
    defaultValues: {
      descriptions: '',
      countryId: '',
      courseId: '',
      documentsCheckListDTOs: [],
    },
  });

  const handleOnClose = () => {
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={handleOnClose}
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a]
                   w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
                   max-h-[95vh] md:max-h-[92vh]
                   rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <AddRequirementForm
          form={form}
          courses={allCourses}
          onClose={handleOnClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

export default AddRequirementModal;