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
    setSelectedStudentId("");
    setParams("");
    refetch();
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white p-5 rounded-xl border shadow-sm mb-4 flex justify-center">
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="flex items-start gap-3 w-full max-w-[900px] flex-wrap sm:flex-nowrap"
  >
    {/* Student Name */}
    <div className="flex-none w-[250px]">
      <AppCombobox
        value={selectedStudentId}
        dropDownWidth="w-full"
        dropdownPositionClass="absolute"
        label="Student Name"
        name="studentId"
        form={form}
        options={allStudents?.Items ?? []}
        selected={
          allStudents?.Items?.find((s) => s.id === selectedStudentId) ??
          null
        }
        onSelect={(student) => {
          setSelectedStudentId(student?.id ?? "");
        }}
        getLabel={(s) => (s ? `${s.firstName} ${s.lastName}` : "-")}
        getValue={(s) => s?.id ?? ""}
        className="h-[42px]"
      />
    </div>

    {/* Start Date */}
    <div className="flex-none w-[170px]">
      <InputElement
        label="Start Date"
        inputType="date"
        name="startDate"
        form={form}
        className="w-full h-[42px]"
      />
      <div className="text-xs text-teal-600 mt-1 h-4 leading-4">
        2082-09-22 (BS)
      </div>
    </div>

    {/* End Date */}
    <div className="flex-none w-[170px]">
      <InputElement
        label="End Date"
        inputType="date"
        name="endDate"
        form={form}
        className="w-full h-[42px]"
      />
      <div className="text-xs text-teal-600 mt-1 h-4 leading-4">
        2082-09-22 (BS)
      </div>
    </div>

    {/* Filter Button */}
    <div className="flex-none">
      <ButtonElement
        type="submit"
        text="Filter"
        icon={<Filter size={14} />}
        className="h-[42px] px-6 !bg-emerald-600 hover:!bg-emerald-700"
      />
    </div>

    {/* Clear Button */}
    <div className="flex-none">
      <ButtonElement
        type="button"
        text="Clear"
        icon={<RotateCcw size={14} />}
        onClick={onClear}
        className="h-[42px] px-6 !bg-gray-600 hover:!bg-gray-700"
      />
    </div>
  </form>
</div>


      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="border-b">
              <th className="px-4 py-3 text-left">S.N</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-center">Total Amount</th>
              <th className="px-4 py-3 text-center">Paid Amount</th>
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
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{fee.studentId}</td>
                    <td className="px-4 py-3 text-center">
                      {fee.totalAmount}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {fee.paidAmount}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-500"
                >
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
