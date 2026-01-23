"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Filter, RotateCcw, Trash } from "lucide-react";

import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { InputElement } from "@/components/Input/InputElement";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";

import { IFilterStudentFee, IStudentFee, Istudentfeesummary } from "../types/IStudentFee";
import { useGetStudentFeesummary } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";

interface ViewStudentFeeFormProps {
  studentId?: string;
}

const ViewStudentFeeForm = ({ studentId }: ViewStudentFeeFormProps) => {
  const { handleError, clearError } = useErrorHandler();
  const { data: allStudents } = useGetAllStudents();
  const {data: allClasses} = useGetAllClass();
 const { menuStatus } = usePermissions();
  const { canDelete } = useMenuPermissionData(menuStatus);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [params, setParams] = useState("");


  const form = useForm<IFilterStudentFee>({
    defaultValues: {
      studentId: "",
      startDate: "",
      endDate: "",
    },
  });

  const { setValue } = form;

  const {
    data: filteredStudentFee,
    refetch,
    isLoading,
  } = useGetStudentFeesummary(params);

  useEffect(() => {
    if (!studentId) return;

    setSelectedStudentId(studentId);
    setValue("studentId", studentId);

    const query = `?studentId=${encodeURIComponent(studentId)}`;
    setParams(query);
    refetch();
  }, [studentId]);

  const onSubmit: SubmitHandler<IFilterStudentFee> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        formData.studentId && `studentId=${formData.studentId}`,
        formData.startDate && `startDate=${formData.startDate}`,
        formData.endDate && `endDate=${formData.endDate}`,
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
  //  const handleDelete = async (id: string) => {
  //   try {
  //     await deleteFeeStructure.mutateAsync(id);
  //     toast.success("User deleted successfully!");
  //     refetch();
  //   } catch {
  //     toast.error("Error deleting user.");
  //   }
  // };

  const onClear = () => {
    form.reset();
    setSelectedStudentId("");
    setParams("");
    refetch();
  };
const getPaymentMethodLabel = (value: number) => {
  switch (value) {
    case 0: return "Cash";
    case 1: return "Credit Card";
    case 2: return "Debit Card";
    case 3: return "Bank Transfer";
    case 4: return "Mobile Payment";
    case 5: return "Cheque";
    default: return "Unknown";
  }
};

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-white p-5 rounded-xl border shadow-sm mb-4 flex justify-center">
        <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="flex items-start gap-3 w-full max-w-[900px] flex-wrap sm:flex-nowrap"
          >
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
              allStudents?.Items?.find((s) => s.id === selectedStudentId) ?? null
            }
            onSelect={(student) => {
              const id = student?.id ?? "";

              setSelectedStudentId(id);
              form.setValue("studentId", id);

              const query = id
                ? `?studentId=${encodeURIComponent(id)}`
                : "";

              setParams(query);
              refetch();
            }}
            getLabel={(s) => (s ? `${s.firstName} ${s.lastName}` : "-")}
            getValue={(s) => s?.id ?? ""}
            className="h-[42px]"
          />
        </div>


    <div className="flex-none w-[170px]">
      <InputElement
        label="Start Date"
        inputType="date"
        name="startDate"
        form={form}
        className="w-full h-[42px]"
      />
     
    </div>

    <div className="flex-none w-[170px]">
      <InputElement
        label="End Date"
        inputType="date"
        name="endDate"
        form={form}
        className="w-full h-[42px]"
      />
    
    </div>

    <div className="flex-none">
      <ButtonElement
        type="submit"
        text="Filter"
        icon={<Filter size={14} />}
        className="h-[42px] px-6 !bg-emerald-600 hover:!bg-emerald-700"
      />
    </div>

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
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">S.N</th>
              <th className="px-4 py-3">class</th>
              <th className="px-4 py-3">Paid Amount</th>
              <th className="px-4 py-3">paymentMethod</th>
              <th className="px-4 py-3">totalAmount</th>
              <th className="px-4 py-3">DueAmount</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={2} className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredStudentFee?.Items?.length ? (
              filteredStudentFee.Items.map(
                (fee: Istudentfeesummary, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{allClasses?.Items?.find((c) => c.id === fee.classId)?.name}</td>
                    <td className="px-4 py-3">{fee.paidAmount}</td>
                    <td className="px-4 py-3">
                      {getPaymentMethodLabel(fee.paymentMethod)}
                    </td>

                    <td className="px-4 py-3">{fee.totalAmount}</td>
                    <td className="px-4 py-3">{fee.dueAmount}</td>
                    {/* <td className="px-4 py-3">
                      {canDelete && (
                              <DeleteButton
                                onConfirm={() =>
                                  handleDelete(
                                    fee.classId ? fee.classId : ""
                                  )
                                }
                                headerText={<Trash />}
                                content="Are you sure you want to delete this FeeStructure?"
                              />
                            )}</td> */}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={2} className="py-6 text-center text-gray-500">
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
