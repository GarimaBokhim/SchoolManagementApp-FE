"use client";
import { SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { IExam, IExamSubjects } from "../types/IExams";
import { useAddExam } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllClass } from "../../Class/hooks";
import {  useGetSubjectByClassId } from "../../Subject/hooks";


type Props = {
  form: UseFormReturn<IExam>;
  onClose: () => void;
};

const AddExamForm = ({ form, onClose }: Props) => {
  const addExam = useAddExam();
  const { handleError, clearError } = useErrorHandler();
  const { data: allClass } = useGetAllClass();

  const [selectedClass, setSelectedClass] = useState<string | undefined>("");
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<{
    [key: number]: string | null;
  }>({});
    const [selectedFullMarks, setSelectedFullMarks] = useState<{
    [key: number]: number;
  }>({});
 const { data: allSubjects } = useGetSubjectByClassId(selectedClass);

  const { fields, append, remove } = useFieldArray({
    name: "examSubjects",
    control: form.control,
  });

  const handleClose = () => {
    form.reset();
    onClose();
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
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-[100%] bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset>
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
                label="Exam Date"
                form={form}
                name="examDate"
                placeholder="Enter Exam Date"
                inputType="date"
              />
             <AppCombobox
                dropDownWidth="w-[20rem]"
                label="Class"
                name="classId"
                form={form}
                dropdownPositionClass="absolute"
                value={selectedClass}
                options={allClass?.Items ?? []}
                selected={allClass?.Items?.find((e) => e.id === selectedClass) || null}
                onSelect={(exam) => {
                  const id = exam?.id ?? "";
                  setSelectedClass(id);
                  form.setValue("classId", id);
                  form.setValue("examSubjects", []);
                }}
                getLabel={(e) => e?.name ?? ""}
                getValue={(e) => e?.id ?? ""}
              />

            </div>

            <div className="mt-6">
              <h2 className="font-semibold mb-2">Exam Subjects</h2>
              {fields.map((field, index) => (
             <div
                key={field.id}
               className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 items-start mb-2">

               <AppCombobox
                    dropDownWidth="w-[25rem]"
                    label="Subject"
                    name={`marksObtained.${index}.subjectId`}
                    form={form}
                    dropdownPositionClass="absolute"
                    value={selectedSubjectIds[index] ?? ""}
                    options={(allSubjects ?? []).filter((subj) => {
                      const currentId = selectedSubjectIds[index];
                      const selectedIds = Object.values(selectedSubjectIds);

                      return (
                        subj.id === currentId || !selectedIds.includes(subj.id)
                      );
                    })}
                    selected={
                      allSubjects?.find(
                        (subj) => subj.id === selectedSubjectIds[index]
                      ) || null
                    }
                    onSelect={(subject) => {
                      const id = subject?.id ?? "";
                      form.setValue(`examSubjects.${index}.subjectId`, id, {
                        shouldValidate: true,
                      });
                      setSelectedFullMarks((prev) => ({
                        ...prev,
                        [index]: subject?.fullMarks || 100,
                      }));
                      setSelectedSubjectIds((prev) => ({
                        ...prev,
                        [index]: id,
                      }));
                    }}
                    getLabel={(s) => s?.subjectName ?? ""}
                    getValue={(s) => s?.id ?? ""}
                  />

           <InputElement
                  label="Full Marks"
                  form={form}
                  name={`examSubjects.${index}.fullMarks`}
                  type="number"
                  required
                />

                <InputElement
                  label="Pass Marks"
                  form={form}
                  name={`examSubjects.${index}.passMarks`}
                  type="number"
                  required
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 h-10 self-end"
                >
                  Remove
                </button>
              </div>

              ))}
              <button
                type="button"
                onClick={() => append({ subjectId: "", fullMarks: 0, passMarks: 0 })}
                className="mt-2 px-3 py-1 bg-teal-500 text-white rounded"
              >
                Add Subject
              </button>
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
