"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Filter, RotateCcw } from "lucide-react";

import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { InputElement } from "@/components/Input/InputElement";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";

import { IFilterStudentFee, IStudentFee } from "../types/IStudentFee";
import { useFilterStudentFeeByDate } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";

const ViewStudentFeeForm = () => {
  const { handleError, clearError } = useErrorHandler();
const { data: allStudents } = useGetAllStudents();
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [params, setParams] = useState("");

  const form = useForm<IFilterStudentFee>({
    defaultValues: {
      studentId: "",
      startDate: "",
      endDate: "",
    },
  });

  const {
    data: filteredStudentFee,
    refetch,
    isLoading,
  } = useFilterStudentFeeByDate(params);

  useEffect(() => {
    refetch();
  }, []);

  const onSubmit: SubmitHandler<IFilterStudentFee> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        formData.studentId
          ? `studentId=${encodeURIComponent(formData.studentId)}`
          : null,
          console.log("studentID",formData.studentId),
        formData.startDate
          ? `startDate=${encodeURIComponent(formData.startDate)}`
          : null,
        formData.endDate
          ? `endDate=${encodeURIComponent(formData.endDate)}`
          : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `?${queryParams}` : "";

      await toast.promise(
        (async () => {
          setParams(fullQuery);
          await refetch();
        })(),
        {
          loading: "Fetching data...",
          success: "Data fetched successfully!",
        }
      );
    } catch (error) {
      Toast.error(handleError(error));
    }
  };

  const onClear = () => {
    form.reset();
    setParams("");
    refetch();
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-white p-4 rounded-xl border mb-4">
      <form
  onSubmit={form.handleSubmit(onSubmit)}
  className="flex flex-wrap gap-4 items-end w-full"
>
  {/* Student Combobox */}
  <div className="flex-1 min-w-[200px]">
    <AppCombobox
      value={selectedStudentId}
      dropDownWidth="w-full"
      dropdownPositionClass="absolute"
      label="Student Name"
      name="studentId"
      form={form}
      required
      options={allStudents?.Items ?? []}
      selected={
        allStudents?.Items?.find((s) => s.id === selectedStudentId) ?? null
      }
      onSelect={(student) => {
        setSelectedStudentId(student?.id ?? "");
        if (student) setSelectedStudent(selectedStudent);
      }}
      getLabel={(s) => (s ? `${s.firstName} ${s.lastName}` : "-")}
      getValue={(s) => s?.id ?? ""}
    />
  </div>

  {/* Start Date */}
  <div className="flex-1 min-w-[150px]">
    <InputElement
      isReport
      layout="column"
      label="Start Date"
      inputType="date"
      name="startDate"
      form={form}
      className="w-full"
    />
  </div>

  {/* End Date */}
  <div className="flex-1 min-w-[150px]">
    <InputElement
      isReport
      layout="column"
      label="End Date"
      inputType="date"
      name="endDate"
      form={form}
      className="w-full"
    />
  </div>

  {/* Filter Button */}
  <div className="min-w-[120px]">
    <ButtonElement
      type="submit"
      text="Filter"
      icon={<Filter size={14} />}
      className="!bg-emerald-600 hover:!bg-emerald-700 w-full"
    />
  </div>

  {/* Clear Button */}
  <div className="min-w-[120px]">
    <ButtonElement
      type="button"
      text="Clear"
      icon={<RotateCcw size={14} />}
      onClick={onClear}
      className="!bg-gray-500 hover:!bg-gray-600 w-full"
    />
  </div>
</form>

      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3">S.N</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Total Amount</th>
              <th className="px-4 py-3">Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredStudentFee?.Items?.length ? (
              filteredStudentFee.Items.map(
                (fee: IStudentFee, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{fee.studentId}</td>
                    <td className="px-4 py-3">{fee.totalAmount}</td>
                    <td className="px-4 py-3">{fee.paidAmount}</td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ViewStudentFeeForm;
