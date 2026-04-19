"use client";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import EditStudentFeeForm from "../_components/EditFeeStudentFeeForm";
import { IStudentFee } from "../types/IStudentFee";
import {
  feeStructureIdToString,
  normalizeStudentFeeRowForEdit,
} from "../utils/studentFeeForm";

interface Props {
  visible: boolean;
  onClose?: () => void;
  editRecord: (IStudentFee & { id: string }) | null;
}

const EditStudentFee = ({ visible, onClose, editRecord }: Props) => {
  const form = useForm<IStudentFee>({
    defaultValues: {
      studentId: "",
      feeStructureId: "",
      classId: "",
      discountPercentage: 0,
      studentFeeDetailsDTOs: [],
    },
  });

  const editRecordRef = useRef(editRecord);
  editRecordRef.current = editRecord;

  useEffect(() => {
    const row = editRecordRef.current;
    if (!row?.id) return;
    const n = normalizeStudentFeeRowForEdit(row);
    form.reset({
      studentId: n.studentId,
      feeStructureId: feeStructureIdToString(n.feeStructureId),
      classId: n.classId,
      discountPercentage: n.discountPercentage ?? 0,
      studentFeeDetailsDTOs: n.studentFeeDetailsDTOs ?? [],
    });
  }, [editRecord?.id, form]);

  const handleOnClose = () => {
    onClose?.();
  };

  if (!visible || !editRecord?.id) return null;

  const normalized = normalizeStudentFeeRowForEdit(editRecord);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
      >
        {/* ← Now uses EditStudentFeeForm, not AddStudentFeeForm */}
        <EditStudentFeeForm
          form={form}
          onClose={handleOnClose}
          editRecord={normalized}
        />
      </div>
    </div>
  );
};

export default EditStudentFee;