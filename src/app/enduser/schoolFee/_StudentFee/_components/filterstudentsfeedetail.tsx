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

const ViewStudentFeeForm = () => {
  const { handleError, clearError } = useErrorHandler();

  const [params, setParams] = useState("");

  const form = useForm<IFilterStudentFee>({
    defaultValues: {
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
          className="flex flex-col lg:flex-row gap-4 items-end"
        >
          <InputElement
            isReport
            layout="column"
            label="Start Date"
            inputType="date"
            name="startDate"
            form={form}
          />

          <InputElement
            isReport
            layout="column"
            label="End Date"
            inputType="date"
            name="endDate"
            form={form}
          />

          <ButtonElement
            type="submit"
            text="Filter"
            icon={<Filter size={14} />}
            className="!bg-emerald-600 hover:!bg-emerald-700"
          />

          <ButtonElement
            type="button"
            text="Clear"
            icon={<RotateCcw size={14} />}
            onClick={onClear}
            className="!bg-gray-500 hover:!bg-gray-600"
          />
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
