"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { IExam } from "../types/IExams";
import { useAddExam } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllClass } from "../../Class/hooks";
type Props = {
  form: UseFormReturn<IExam>;
  onClose: () => void;
};
const AddExamForm = ({ form, onClose }: Props) => {
  const addExam = useAddExam();
  const { handleError, clearError } = useErrorHandler();
  const { data: allClass } = useGetAllClass();
  const [selectedClass, setSelectedClass] = useState<string | undefined>("");
  const handleClose = () => {
    form.reset();
  };
  const onSubmit: SubmitHandler<IExam> = async (data) => {
    clearError();
    try {
      await toast.promise(addExam.mutateAsync(data), {
        loading: "Adding Exam...",
        success: "Successfully added Exam",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Exam
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
                label="Exam Name"
                form={form}
                name="name"
                placeholder="Enter Name"
                required
              />

              <InputElement
                label="Total mark"
                form={form}
                name="totalMarks"
                type="number"
                placeholder="Enter totalMarks"
              />
              <InputElement
                label="Passing mark"
                form={form}
                name="passingMarks"
                type="number"
                placeholder="Enter passingMark"
              />
              <AppCombobox
                dropDownWidth="w-[25rem]"
                label="Class"
                name="classId"
                form={form}
                dropdownPositionClass="absolute"
                value={selectedClass}
                options={allClass?.Items ?? []}
                selected={
                  allClass?.Items?.find((e) => e.id === selectedClass) || null
                }
                onSelect={(exam) => {
                  const id = exam?.id ?? "";
                  setSelectedClass(id);
                  form.setValue("classId", id);
                }}
                getLabel={(e) => e?.name ?? ""}
                getValue={(e) => e?.id ?? ""}
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

export default AddExamForm;
