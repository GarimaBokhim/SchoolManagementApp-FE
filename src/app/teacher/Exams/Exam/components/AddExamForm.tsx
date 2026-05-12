"use client";
import { SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X, Plus, Trash2 } from "lucide-react";
import { IExam } from "../types/IExams";
import { useAddExam } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";

type Props = {
  form: UseFormReturn<IExam>;
  onClose: () => void;
};

const AddExamForm = ({ form, onClose }: Props) => {
  const addExam = useAddExam();
  const { handleError, clearError } = useErrorHandler();

  const { watch, setValue, control } = form;
  const isChecked = watch("isfinalExam", false);

  // Dynamic examSubjects array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "examSubjects",
  });

  const handleClose = () => {
    form.reset();
  };

  const handleCheckBoxChange = () => {
    setValue("isfinalExam", !isChecked);
  };

  const onSubmit: SubmitHandler<IExam> = async (data) => {
    clearError();
    try {
      await toast.promise(addExam.mutateAsync(data), {
        loading: "Adding Exam...",
        success: "Successfully added Exam",
      });
      handleClose();
      onClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Exam
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* ── Basic Info ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <InputElement
                label="Exam Name"
                form={form}
                name="name"
                placeholder="Enter Name"
                required
              />

              <InputElement
                label="Exam Date"
                form={form}
                name="examDate"
                type="date"
                required
              />

              <InputElement
                label="Class ID"
                form={form}
                name="classId"
                placeholder="Enter Class ID"
                required
              />

              <div className="mb-6 relative flex items-center">
                <label className="pl-2 text-slate-500 pr-2">
                  Is Final Exam
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

            {/* ── Exam Subjects ── */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  Exam Subjects
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      subjectId: "",
                      passMarksPr: 0,
                      fullMarksPr: 0,
                      passMarksTh: 0,
                      fullMarksTh: 0,
                    })
                  }
                  className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Add Subject
                </button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                  No subjects added yet. Click "Add Subject" to begin.
                </p>
              )}

              <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-200 dark:border-zinc-600 rounded-lg p-4 relative"
                  >
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>

                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Subject {index + 1}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                      <InputElement
                        label="Subject ID"
                        form={form}
                        name={`examSubjects.${index}.subjectId`}
                        placeholder="Enter Subject ID"
                        required
                      />
                      <InputElement
                        label="Full Marks (Practical)"
                        form={form}
                        name={`examSubjects.${index}.fullMarksPr`}
                        type="number"
                        placeholder="0"
                      />
                      <InputElement
                        label="Pass Marks (Practical)"
                        form={form}
                        name={`examSubjects.${index}.passMarksPr`}
                        type="number"
                        placeholder="0"
                      />
                      <InputElement
                        label="Full Marks (Theory)"
                        form={form}
                        name={`examSubjects.${index}.fullMarksTh`}
                        type="number"
                        placeholder="0"
                      />
                      <InputElement
                        label="Pass Marks (Theory)"
                        form={form}
                        name={`examSubjects.${index}.passMarksTh`}
                        type="number"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text="Submit" />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddExamForm;