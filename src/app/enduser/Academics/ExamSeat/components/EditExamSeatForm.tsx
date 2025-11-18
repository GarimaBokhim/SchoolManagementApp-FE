"use client";
import { SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { IExamSeat } from "../types/IExamSeat";
import { useEditExamSeat, useGetExamSeatById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllExams } from "../../Exam/hooks";
import { useGetAllStudents } from "@/app/enduser/StudentManagement/Student/hooks";
import { useGetAllSubjects } from "../../Subject/hooks";

type Props = {
  form: UseFormReturn<IExamSeat>;
  onClose: () => void;
  ExamSeatId: string;
};

const EditExamSeatForm = ({ form, onClose, ExamSeatId }: Props) => {
  const editExamSeat = useEditExamSeat();
  const { handleError, clearError } = useErrorHandler();

  const { control, handleSubmit, reset, setValue } = form;

  const { data: ExamSeatData } = useGetExamSeatById(ExamSeatId);

  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  const { data: allExam } = useGetAllExams();
  const { data: allStudents } = useGetAllStudents();
  const { data: allSubject } = useGetAllSubjects();
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<{
    [key: number]: string | null;
  }>({});
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "marksObtained",
  });

  useEffect(() => {
    if (!ExamSeatData) return;

    reset({
      examId: ExamSeatData.examId,
      studentId: ExamSeatData.studentId,
      remarks: ExamSeatData.remarks,
      marksObtained: ExamSeatData.marksObtained ?? [],
    });

    setSelectedExamId(ExamSeatData.examId);
    setSelectedStudentId(ExamSeatData.studentId);

    replace(ExamSeatData.marksObtained ?? []);
  }, [ExamSeatData]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<IExamSeat> = async (data) => {
    clearError();

    try {
      await toast.promise(
        editExamSeat.mutateAsync({
          id: ExamSeatId,
          data,
        }),
        {
          loading: "Updating Exam Result...",
          success: "Successfully Updated Exam Result",
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
                      w-full max-w-[90vw] max-h-[95vh] rounded-lg
                      overflow-auto p-6 shadow-lg"
      >
        <fieldset>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold dark:text-gray-50">
              Edit Exam Result
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AppCombobox
                dropDownWidth="w-[25rem]"
                label="Exam"
                name="examId"
                form={form}
                dropdownPositionClass="fixed"
                value={selectedExamId}
                options={allExam?.Items ?? []}
                selected={
                  allExam?.Items?.find((e) => e.id === selectedExamId) || null
                }
                onSelect={(exam) => {
                  const id = exam?.id ?? "";
                  setSelectedExamId(id);
                  form.setValue("examId", id);
                }}
                getLabel={(e) => e?.name ?? ""}
                getValue={(e) => e?.id ?? ""}
              />
              <AppCombobox
                dropDownWidth="w-[25rem]"
                label="Student Name"
                name="studentId"
                form={form}
                dropdownPositionClass="fixed"
                value={selectedStudentId}
                options={allStudents?.Items ?? []}
                selected={
                  allStudents?.Items?.find((s) => s.id === selectedStudentId) ||
                  null
                }
                onSelect={(student) => {
                  const id = student?.id ?? "";
                  setSelectedStudentId(id);
                  form.setValue("studentId", id);
                }}
                getLabel={(s) => s?.firstName ?? ""}
                getValue={(s) => s?.id ?? ""}
              />
              <InputElement
                label="Remark"
                form={form}
                name="remarks"
                type="string"
                placeholder="Enter remark"
              />
            </div>
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-3">Subject Marks</h2>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md mb-4 relative"
                >
                  <AppCombobox
                    dropDownWidth="w-[25rem]"
                    label="Subject"
                    name={`marksObtained.${index}.subjectId`}
                    form={form}
                    dropdownPositionClass="fixed"
                    value={selectedSubjectIds[index] ?? ""}
                    options={allSubject?.Items ?? []}
                    selected={
                      allSubject?.Items?.find(
                        (subj) => subj.Id === selectedSubjectIds[index]
                      ) || null
                    }
                    onSelect={(subject) => {
                      const id = subject?.Id ?? "";
                      form.setValue(`marksObtained.${index}.subjectId`, id, {
                        shouldValidate: true,
                      });
                      setSelectedSubjectIds((prev) => ({
                        ...prev,
                        [index]: id,
                      }));
                    }}
                    getLabel={(s) => s?.name ?? ""}
                    getValue={(s) => s?.Id ?? ""}
                  />

                  {/* MARKS */}
                  <InputElement
                    label="Marks Obtained"
                    form={form}
                    name={`marksObtained.${index}.marksObtained`}
                    type="number"
                    placeholder="Enter marks"
                  />

                  {/* REMOVE ROW */}
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      setSelectedSubjectIds((prev) => {
                        const updated = { ...prev };
                        delete updated[index];
                        return updated;
                      });
                    }}
                    className="absolute right-2 top-2 text-red-400 hover:text-red-600"
                  >
                    <X />
                  </button>
                </div>
              ))}
              <ButtonElement
                type="button"
                text="Add Subject"
                onClick={() =>
                  append({
                    subjectId: "",
                    marksObtained: 0,
                  })
                }
              />
            </div>

            {/* SUBMIT */}
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text="Submit" />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default EditExamSeatForm;
