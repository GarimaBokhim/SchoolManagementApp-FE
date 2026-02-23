/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { set, SubmitHandler, UseFormReturn } from "react-hook-form";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { IRegistration } from "../types/IRegistration";
import { useAddRegistration } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useEffect, useState } from "react";
import { useGetAllStudents } from "../../Student/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useGetAllAcademicYear } from "../hooks";
type Props = {
  form: UseFormReturn<IRegistration>;
  onClose: () => void;
  studentId?: string | null;
};
const AddRegistrationForm = ({ form, onClose, studentId }: Props) => {
  const addRegistration = useAddRegistration();
  const {data:allStudents}= useGetAllStudents()
  const {data:allClasses}= useGetAllClass();
  const {data:allAcademicYears}= useGetAllAcademicYear();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string | null>(null);
  const { handleError, clearError } = useErrorHandler();
  const handleClose = () => {
    form.reset();
    onClose()
  };
  const onSubmit: SubmitHandler<IRegistration> = async (data) => {
    clearError();
    try {
      await toast.promise(addRegistration.mutateAsync(data), {
        loading: "Adding Registration...",
        success: "Successfully added Registration",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  useEffect(()=>{
    if(studentId){
      setSelectedStudentId(studentId);
      form.setValue("studentId", studentId);
    }
  },[studentId])
  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Registration
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500 "
            >
              <X strokeWidth={3} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <AppCombobox
                value={selectedStudentId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Student Name"
                name="studentId"
                form={form}
                required
                options={allStudents?.Items}
                selected={
                  allStudents?.Items?.find((g) => g.id === selectedStudentId) ||
                  null
                }
                onSelect={(group) => setSelectedStudentId(group?.id ?? null)}
                getLabel={(g) => g?.firstName ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <AppCombobox
                value={selectedClassId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Class Name"
                name="classId"
                form={form}
                required
                options={allClasses?.Items}
                selected={
                  allClasses?.Items?.find((g) => g.id === selectedClassId) ||
                  null
                }
                onSelect={(group) => setSelectedClassId(group?.id ?? null)}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <AppCombobox
                value={selectedAcademicYearId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Academic Year"
                name="academicYearId"
                form={form}
                required
                options={allAcademicYears?.Items}
                selected={
                  allAcademicYears?.Items?.find((g) => g.Id === selectedAcademicYearId) ||
                  null
                }
                onSelect={(group) => setSelectedAcademicYearId(group?.Id ?? null)}
                getLabel={(g) => g?.Name ?? ""}
                getValue={(g) => g?.Id ?? ""}
              />
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={"Submit"} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddRegistrationForm;
