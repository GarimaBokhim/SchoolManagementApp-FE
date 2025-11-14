"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ISubject } from "../types/ISubjects";
import { useEditSubject, useGetSubjectById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllClass } from "../../Class/hooks";
type Props = {
  form: UseFormReturn<ISubject>;
  onClose: () => void;
  SubjectId: string;
};
const EditSubjectForm = ({ form, onClose, SubjectId }: Props) => {
  const editSubject = useEditSubject();
  const { handleError, clearError } = useErrorHandler();
  const { data: SubjectData } = useGetSubjectById(SubjectId);
  const { data: allClass } = useGetAllClass();
  const handleClose = () => {
    form.reset();
  };
  const [selectedClassId, setSelectedClassId] = useState<string | null>("");
  useEffect(() => {
    if (SubjectData) {
      form.reset({
        name: SubjectData?.name ?? "",
        code: SubjectData?.code ?? "",
        creditHours: SubjectData?.creditHours ?? 0,
        description: SubjectData?.description ?? "",
        classId: SubjectData?.classId ?? "",
      });
      setSelectedClassId(SubjectData.classId);
    }
  }, [SubjectData]);
  const onSubmit: SubmitHandler<ISubject> = async (data) => {
    clearError();

    try {
      clearError();
      await toast.promise(
        editSubject.mutateAsync({
          id: SubjectId,
          data: data,
        }),
        {
          loading: "Submitting Data",
          success: "Successfully Edited Income",
        }
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
              Update Subject
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
              <InputElement
                label="Subject Name"
                form={form}
                name="name"
                placeholder="Enter Name"
                required
              />

              <InputElement
                label="Subject Code"
                form={form}
                name="code"
                placeholder="Enter Subject code"
                required
              />
              <InputElement
                label="Credit Hours"
                form={form}
                name="creditHours"
                type="number"
                placeholder="Enter Credit Hours"
                required
              />
              <InputElement
                label="Description"
                form={form}
                name="description"
                placeholder="Enter Description"
                required
              />
              <AppCombobox
                value={selectedClassId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Class"
                name="classId"
                form={form}
                required
                options={allClass?.Items}
                selected={
                  allClass?.Items?.find((g) => g.classId === selectedClassId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedClassId(group.classId || null);
                  } else {
                    setSelectedClassId(null);
                  }
                }}
                getLabel={(g) => g?.name ?? ""}
                getValue={(g) => g?.classId ?? ""}
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

export default EditSubjectForm;
