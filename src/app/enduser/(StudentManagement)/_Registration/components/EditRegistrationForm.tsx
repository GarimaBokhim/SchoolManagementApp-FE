"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { IRegistration } from "../types/IRegistration";
import { useEditRegistration, useGetRegistrationById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllStudents } from "../../Student/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useGetAllFiscalYear } from "@/app/admin/Setup/School/hooks";
type Props = {
  form: UseFormReturn<IRegistration>;
  onClose: () => void;
  RegistrationId: string;
};
const EditRegistrationForm = ({ form, onClose, RegistrationId }: Props) => {
  const editRegistration = useEditRegistration();
  const { data: allStudents } = useGetAllStudents();
  const { data: allClasses } = useGetAllClass();
  const { data: allAcademicYears } = useGetAllFiscalYear();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<
    string | null
  >(null);
  const { handleError, clearError } = useErrorHandler();
  const { data: RegistrationData } = useGetRegistrationById(RegistrationId);
  const handleClose = () => {
    form.reset();
  };
  useEffect(() => {
    if (RegistrationData) {
      form.reset({
        studentId: RegistrationData?.studentId ?? "",
        classId: RegistrationData?.classId?? "",
        academicYearId: RegistrationData?.academicYearId?? "",
      });
    }
  }, [RegistrationData]);
  const onSubmit: SubmitHandler<IRegistration> = async (data) => {
    clearError();

    try {
      clearError();
      await toast.promise(
        editRegistration.mutateAsync({
          id: RegistrationId,
          data: data,
        }),
        {
          loading: "Submitting Data",
          success: "Successfully Edited Income",
        },
      );
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
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
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Update Registration
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
                  allAcademicYears?.Items?.find(
                    (g) => g.Id === selectedAcademicYearId,
                  ) || null
                }
                onSelect={(group) =>
                  setSelectedAcademicYearId(group?.Id ?? null)
                }
                getLabel={(g) => g?.FyName ?? ""}
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

export default EditRegistrationForm;
