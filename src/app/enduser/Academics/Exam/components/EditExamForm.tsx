"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useEffect } from "react";
import { X } from "lucide-react";
import { IExam } from "../types/IExams";
import { useEditExam, useGetExamById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
type Props = {
  form: UseFormReturn<IExam>;
  onClose: () => void;
  ExamId: string;
};
const EditExamForm = ({ form, onClose, ExamId }: Props) => {
  const editExam = useEditExam();
  const { handleError, clearError } = useErrorHandler();
  const { data: ExamData } = useGetExamById(ExamId);
  const handleClose = () => {
    form.reset();
  };
  const { watch, setValue } = form;
  const isChecked = watch("isfinalExam", false);
  const handleCheckBoxChange = () => {
    setValue("isfinalExam", !isChecked);
  };
  useEffect(() => {
    if (ExamData) {
      form.reset({
        name: ExamData?.name ?? "",
        examDate: ExamData?.examDate ?? new Date(),
        totalMarks: ExamData?.totalMarks ?? 0,
        passingMarks: ExamData?.passingMarks ?? 0,
        isfinalExam: ExamData?.isfinalExam ?? true,
      });
    }
  }, [ExamData]);
  const onSubmit: SubmitHandler<IExam> = async (data) => {
    clearError();

    try {
      clearError();
      await toast.promise(
        editExam.mutateAsync({
          id: ExamId,
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
              Update Exam
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
              <div className="mb-6 relative flex items-center">
                <label className="pl-2 test-slate-500 pr-2">
                  {"Is Final Exam"}
                </label>
                <InputElement
                  layout="row"
                  form={form}
                  checked={isChecked}
                  onChange={handleCheckBoxChange}
                  name="isfinalExam"
                  inputTypeCheckBox="checkbox"
                  customStyle="!border-0 after:!content-none"
                />
              </div>
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

export default EditExamForm;
