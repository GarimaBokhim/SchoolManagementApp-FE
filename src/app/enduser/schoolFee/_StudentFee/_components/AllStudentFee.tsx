"use client";
import { useEffect, useRef, useState } from "react";
import { IFilterStudentFee, IStudentFee } from "../types/IStudentFee";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Filter, Plus, RotateCcw, Trash } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useFilterStudentFeeByDate } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddStudentFee from "../pages/Add";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetAllFeeStructure } from "../../_FeeStructure/hooks";
import { Eye } from "lucide-react";
import { CreditCard } from "lucide-react";
import { X } from "lucide-react";
import ViewStudentFeeForm from "./filterstudentsfeedetail";
import PaymentRecordForm from "./paymentrecords";
const AllStudentFeeForm = () => {
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewpaymentModal, setViewpaymentModal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");
  const { data: allStudent } = useGetAllStudents();
  const { data: allFeeStructure } = useGetAllFeeStructure();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>("");
  const [selectedStudentFee, setSelectedStudentFee] = useState<IStudentFee | null>(null);

  const fullQuery = query + (params || "");

  const {
    data: filteredStudentFee,
    refetch,
    isLoading,
  } = useFilterStudentFeeByDate(fullQuery);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const form = useForm<IFilterStudentFee>({
    defaultValues: {
      studentId: "",
      startDate: "",
      endDate: "",
    },
  });

  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
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
      const fullQuery = queryParams ? `&${queryParams}` : "";
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
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
      console.error("Error during form submission:", error);
    }
  };
  const refForInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refForInput.current?.focus();
  }, []);
  const formRef = useRef<DateRangeFilterRef>(null);
  // const deleteStudentFee = useRemoveStudentFee();
  // const handleDelete = async (id: string) => {
  //   try {
  //     await deleteStudentFee.mutateAsync(id);
  //     toast.success("User deleted successfully!");
  //     refetch();
  //   } catch {
  //     toast.error("Error deleting user.");
  //   }
  // };
  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
    setSelectedStudentId("");
    form.reset();
  };
  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className=" text-xl font-semibold ">All StudentFees</h1>
            <div className="flex flex-wrap gap-2 justify-end">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={18} />}
                  type="button"
                  text="Add New"
                  onClick={() => setAddModal(true)}
                  className="!font-semibold"
                />
              )}
            </div>
          </div>
          {openFilter && (
            <div className="bg-white dark:bg-[#2c2c2c] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col lg:flex-row lg:flex-wrap gap-4"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />
                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedStudentId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Student"
                    name="studentId"
                    form={form}
                    options={allStudent?.Items}
                    selected={
                      allStudent?.Items?.find(
                        (g) => g.id === selectedStudentId
                      ) || null
                    }
                    onSelect={(group) => {
                      setSelectedStudentId(group?.id ?? null);
                    }}
                    getLabel={(g) => g?.firstName ?? ""}
                    getValue={(g) => g?.id ?? ""}
                  />
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0 lg:ml-auto">
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
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600"
                  />
                </div>
              </form>
            </div>
          )}
          <div className="overflow-x-auto bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#80878c] text-gray-700 dark:text-white uppercase font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-center">S.N</th>
                  <th className="px-4 py-3 text-center">Student</th>
                  <th className="px-4 py-3 text-center">Fee Structure</th>
                  {/* <th className="px-4 py-3 text-center">Total Amount</th>
                  <th className="px-4 py-3 text-center">Paid Amount</th> */}
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-4 text-center text-gray-500 dark:text-gray-300"
                    >
                      Loading StudentFees...
                    </td>
                  </tr>
                ) : filteredStudentFee?.Items?.length ? (
                  filteredStudentFee.Items.map(
                    (StudentFee: IStudentFee, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          {
                            allStudent?.Items?.find(
                              (i) => i.id === StudentFee.studentId
                            )?.firstName
                          }
                        </td>
                       <td className="py-3 px-4">
                          {StudentFee.feeStructureId?.map((fee, idx) => (
                            <div key={idx}>{fee}</div>
                          )) ?? "-"}
                        </td>

                        {/* <td className="py-3 px-4 hidden md:table-cell">
                          {StudentFee.totalAmount}
                        </td>
                        
                        <td className="py-3 px-4 hidden lg:table-cell">
                          {StudentFee.paidAmount}
                        </td> */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <ButtonElement
                            text=""
                            icon={<Eye className="text-white" size={15} />}
                            onClick={() => {
                              setSelectedStudentFee(StudentFee);
                              setViewModal(true);
                            }}
                            className="!bg-teal-500 hover:!bg-teal-600"
                          />

                         <ButtonElement
                            text=""
                            icon={<CreditCard className="text-white" size={15} />}
                            onClick={() => {
                              setSelectedStudentFee(StudentFee); 
                              setViewpaymentModal(true);
                            }}
                          />

                        </div>
                      </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No StudentFees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {filteredStudentFee && filteredStudentFee?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: filteredStudentFee?.PageIndex ?? 1,
                firstPage: filteredStudentFee?.FirstPage ?? 1,
                lastPage: filteredStudentFee?.LastPage ?? 1,
                nextPage: filteredStudentFee?.NextPage ?? 1,
                previousPage: filteredStudentFee?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
        <AddStudentFee visible={addModal} onClose={() => setAddModal(false)} />
      </div>
      {viewModal && selectedStudentFee && (
  <div className="fixed inset-0 ml-[16%] bg-white bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-[#353535] w-screen max-w-4xl h-screen max-h-[1000vh] max-w-[88vw] p-6 rounded-xl overflow-auto shadow-lg relative">
      <button
        className="absolute top-[-6px] right-1
                   w-10 h-10
                   flex items-center justify-center
                   text-red-500 hover:text-gray-700"
        onClick={() => setViewModal(false)}
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      <ViewStudentFeeForm
        studentId={selectedStudentFee.studentId}
      />
    </div>
  </div>
)}

    {viewpaymentModal && selectedStudentFee && (
  <div className="fixed inset-0 ml-[16%] bg-white bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#353535] w-screen max-w-4xl h-screen max-h-[1000vh] max-w-[88vw] p-6 rounded-xl overflow-auto shadow-lg relative">
                 <button  className="absolute top-[-6px] right-1
                            w-10 h-10
                            flex items-center justify-center
                            text-red-500 hover:text-gray-700"
        onClick={() => setViewpaymentModal(false)}
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      <PaymentRecordForm
        studentfeeId={selectedStudentFee?.studentId || ""} 
        onClose={() => setViewpaymentModal(false)}
      />
    </div>
  </div>
)}



    </>
  );
};

export default AllStudentFeeForm;
