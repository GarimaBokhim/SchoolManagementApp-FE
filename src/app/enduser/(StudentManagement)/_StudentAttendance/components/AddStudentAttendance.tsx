"use client";

import { SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { useAddStudentAttendance } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { IStudentAttendance } from "../types/IStudentAttendance";
import { useGetAllAcademicTeams } from "@/app/enduser/(Staff)/AcademicStaff/hooks";

type Props = {
  form: UseFormReturn<IStudentAttendance>;
  onClose: () => void;
};

const AddStudentAttendanceForm = ({ form, onClose }: Props) => {
  const addStudentAttendance = useAddStudentAttendance();
  const { handleError, clearError } = useErrorHandler();

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "studentAttendances",
  });

  const [selectedAcademicTeam, setSelectedAcademicTeam] = useState<
    string | null
  >(null);

  const [status, setStatus] = useState<{
    [key: number]: number | null;
  }>({});
  const [selectedStudentId, setSelectedStudentId] = useState<{
    [key: number]: string | null;
  }>({});
  const { data: allStudent } = useGetAllStudents();
  const { data: allAcademicTeam } = useGetAllAcademicTeams();
  const handleClose = () => {
    form.reset();
    setSelectedStudentId("");
    setSelectedAcademicTeam("");
    onClose();
  };
  const onSubmit: SubmitHandler<IStudentAttendance> = async (data) => {
    clearError();
    try {
      await toast.promise(addStudentAttendance.mutateAsync(data), {
        loading: "Adding Attendance...",
        success: "Successfully added Attendance",
      });

      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-full bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Student Attendance
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
                label="Academic Team"
                name="academicTeamId"
                form={form}
                dropdownPositionClass="absolute"
                value={selectedAcademicTeam}
                options={allAcademicTeam?.Items ?? []}
                selected={
                  allAcademicTeam?.Items?.find(
                    (e) => e.id === selectedAcademicTeam
                  ) || null
                }
                onSelect={(academicTeam) => {
                  const id = academicTeam?.id ?? "";
                  setSelectedAcademicTeam(id);
                  form.setValue("academicTeamId", id);
                }}
                getLabel={(e) => e?.fullName ?? ""}
                getValue={(e) => e?.id ?? ""}
              />
              <InputElement
                label="Attendance Date"
                form={form}
                name="attendanceDate"
                inputType="date"
                placeholder="Enter Date"
              />
            </div>
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-3">Students</h2>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md mb-4 relative"
                >
                  <AppCombobox
                    dropDownWidth="w-[25rem]"
                    label="Student"
                    name={`studentAttendances.${index}.studentId`}
                    form={form}
                    dropdownPositionClass="absolute"
                    value={selectedStudentId[index] ?? ""}
                    options={allStudent?.Items ?? []}
                    selected={
                      allStudent?.Items?.find(
                        (std) => std.id === selectedStudentId[index]
                      ) || null
                    }
                    onSelect={(subject) => {
                      const id = subject?.id ?? "";
                      form.setValue(
                        `studentAttendances.${index}.studentId`,
                        id,
                        {
                          shouldValidate: true,
                        }
                      );
                      setSelectedStudentId((prev) => ({
                        ...prev,
                        [index]: id,
                      }));
                    }}
                    getLabel={(s) => s?.firstName ?? ""}
                    getValue={(s) => s?.id ?? ""}
                  />
                  <AppCombobox
                    label="Status"
                    name={`studentAttendances.${index}.status`}
                    dropdownPositionClass="absolute"
                    value={status[index]}
                    dropDownWidth="w-full"
                    options={[
                      { id: 0, name: "Present" },
                      { id: 1, name: "Absent" },
                    ]}
                    selected={
                      [
                        { id: 0, name: "Present" },
                        { id: 1, name: "Absent" },
                      ].find((stat) => stat.id === status[index]) || null
                    }
                    onSelect={(subject) => {
                      const id = subject?.id ?? 0;
                      form.setValue(`studentAttendances.${index}.status`, id, {
                        shouldValidate: true,
                      });
                      setStatus((prev) => ({
                        ...prev,
                        [index]: id,
                      }));
                    }}
                    getLabel={(o) => o?.name || ""}
                    getValue={(o) => o?.id ?? ""}
                  />
                  <InputElement
                    label="Remarks"
                    form={form}
                    name={`studentAttendances.${index}.remarks`}
                    type="string"
                    placeholder="Enter Remarks"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      setSelectedStudentId((prev) => {
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
                text="Add Student"
                onClick={() =>
                  append({
                    studentId: "",
                    status: 0,
                    remarks: "",
                  })
                }
              />
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

export default AddStudentAttendanceForm;
