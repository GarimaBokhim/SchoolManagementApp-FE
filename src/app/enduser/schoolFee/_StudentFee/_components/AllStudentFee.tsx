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
import { Filter, Plus, RotateCcw, Pencil } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useFilterStudentFeeByDate, useGetStudentFeeById, useGetClassById } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddStudentFee from "../pages/Add";
import EditStudentFee from "../pages/Edit";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { Eye, CreditCard, X } from "lucide-react";
import ViewStudentFeeForm from "./filterstudentsfeedetail";
import PaymentRecordForm from "./paymentrecords";

// ─── Row Component ───────────────────────────────────────────────────────────
type StudentFeeRowProps = {
  StudentFee: IStudentFee;
  index: number;
  getSerialNumber: (index: number) => number;
  getStudentName: (studentId: string) => string;
  canEdit: boolean;
  setPendingEditId: (id: string) => void;
  setSelectedStudentFee: (fee: IStudentFee) => void;
  setViewModal: (val: boolean) => void;
  setViewpaymentModal: (val: boolean) => void;
};

const StudentFeeRow = ({
  StudentFee,
  index,
  getSerialNumber,
  getStudentName,
  canEdit,
  setPendingEditId,
  setSelectedStudentFee,
  setViewModal,
  setViewpaymentModal,
}: StudentFeeRowProps) => {
  const { data: classData } = useGetClassById(StudentFee.classId);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100">
      <td className="py-3 px-4 text-center">{getSerialNumber(index)}</td>
      <td className="py-3 px-4">{getStudentName(StudentFee.studentId)}</td>
      <td className="py-3 px-4">{classData?.name || "-"}</td>
      <td className="py-3 px-4 text-right">
        {StudentFee.totalAmount !== undefined && StudentFee.totalAmount !== null
          ? StudentFee.totalAmount.toLocaleString()
          : "-"}
      </td>
      <td className="py-3 px-4 text-right">
        {StudentFee.dueAmount !== undefined && StudentFee.dueAmount !== null
          ? StudentFee.dueAmount.toLocaleString()
          : "-"}
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex justify-center gap-2 flex-wrap">
          {/* Edit button - now rendered unconditionally */}
          <ButtonElement
            text=""
            icon={<Pencil className="text-white" size={15} />}
            onClick={() => {
              const rowId = StudentFee.id ?? StudentFee.Id ?? "";
              setPendingEditId(rowId);
            }}
            className="!bg-blue-500 hover:!bg-blue-600"
          />
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
            className="!bg-purple-500 hover:!bg-purple-600"
          />
        </div>
      </td>
    </tr>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
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
  const [editModal, setEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState<(IStudentFee & { id: string }) | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [viewpaymentModal, setViewpaymentModal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd, canEdit } = useMenuPermissionData(menuStatus);
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");

  const { data: allStudent } = useGetAllStudents("?IsPagination=false");

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>("");
  const [selectedStudentFee, setSelectedStudentFee] = useState<IStudentFee | null>(null);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);

  const { data: fullEditRecord } = useGetStudentFeeById(pendingEditId ?? undefined);

  useEffect(() => {
    if (fullEditRecord && pendingEditId) {
      setEditRecord({ ...fullEditRecord, id: pendingEditId });
      setEditModal(true);
    }
  }, [fullEditRecord, pendingEditId]);

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

  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
    setSelectedStudentId("");
    form.reset();
  };

  const getStudentName = (studentId: string): string => {
    const student = allStudent?.Items?.find(
      (i) => i.id != null && String(i.id) === String(studentId)
    );
    if (!student) return "-";
    return [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(" ");
  };

  const getSerialNumber = (index: number): number => {
    return (paginationParams.pageIndex - 1) * paginationParams.pageSize + index + 1;
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Student Fees</h1>
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
                    getLabel={(g) =>
                      g
                        ? [g.firstName, g.middleName, g.lastName]
                          .filter(Boolean)
                          .join(" ")
                        : "-"
                    }
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
                  <th className="px-4 py-3 text-center">Class</th>
                  <th className="px-4 py-3 text-center">Total Amount</th>
                  <th className="px-4 py-3 text-center">Due Amount</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500 dark:text-gray-300">
                      Loading Student Fees...
                    </td>
                  </tr>
                ) : filteredStudentFee?.Items?.length ? (
                  filteredStudentFee.Items.map(
                    (StudentFee: IStudentFee, index: number) => (
                      <StudentFeeRow
                        key={String(StudentFee.id ?? StudentFee.Id ?? index)}
                        StudentFee={StudentFee}
                        index={index}
                        getSerialNumber={getSerialNumber}
                        getStudentName={getStudentName}
                        canEdit={canEdit}
                        setPendingEditId={setPendingEditId}
                        setSelectedStudentFee={setSelectedStudentFee}
                        setViewModal={setViewModal}
                        setViewpaymentModal={setViewpaymentModal}
                      />
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500 italic">
                      No Student Fees found.
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

        <EditStudentFee
          visible={editModal}
          editRecord={editRecord}
          onClose={() => {
            setEditModal(false);
            setEditRecord(null);
            refetch();
          }}
        />
      </div>

      {/* View Student Fee Modal */}
      {viewModal && selectedStudentFee && (
        <div className="fixed inset-0 ml-[16%] bg-white bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#353535] w-screen max-w-4xl h-screen max-h-[1000vh] max-w-[88vw] p-6 rounded-xl overflow-auto shadow-lg relative">
            <button
              className="absolute top-[-6px] right-1 w-10 h-10 flex items-center justify-center text-red-500 hover:text-gray-700"
              onClick={() => setViewModal(false)}
            >
              <X size={23} strokeWidth={2.5} />
            </button>
            <ViewStudentFeeForm
              studentId={selectedStudentFee.studentId}
              classId={selectedStudentFee.classId}
            />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {viewpaymentModal && selectedStudentFee && (
        <div className="fixed inset-0 ml-[16%] bg-white bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#353535] w-screen max-w-4xl h-screen max-h-[1000vh] max-w-[88vw] p-6 rounded-xl overflow-auto shadow-lg relative">
            <button
              className="absolute top-[-6px] right-1 w-10 h-10 flex items-center justify-center text-red-500 hover:text-gray-700"
              onClick={() => setViewpaymentModal(false)}
            >
              <X size={24} strokeWidth={2.5} />
            </button>
            <PaymentRecordForm
              studentid={selectedStudentFee?.studentId || ""}
              classid={selectedStudentFee?.classId || ""}
              onClose={() => setViewpaymentModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AllStudentFeeForm;