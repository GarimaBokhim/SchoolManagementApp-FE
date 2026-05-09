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
import { Filter, Plus, RotateCcw, Pencil, FileText, Printer } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import {
  useFilterStudentFeeByDate,
  useGetStudentFeeById,
  useGetClassById,
  useGetDueSlip,
  IDueSlipItem,
} from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddStudentFee from "../pages/Add";
import EditStudentFee from "../pages/Edit";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { Eye, CreditCard, X } from "lucide-react";
import ViewStudentFeeForm from "./filterstudentsfeedetail";
import PaymentRecordForm from "./paymentrecords";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";

// ─── Due Slip Modal ───────────────────────────────────────────────────────────
type DueSlipModalProps = {
  classId: string;
  className: string;
  onClose: () => void;
};

const DueSlipModal = ({ classId, className, onClose }: DueSlipModalProps) => {
  const { data: dueSlipData, isLoading } = useGetDueSlip(classId);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Due Slip - ${className}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1 { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 4px; }
            h2 { font-size: 14px; font-weight: normal; text-align: center; margin-bottom: 2px; color: #555; }
            .meta { text-align: center; font-size: 12px; color: #777; margin-bottom: 20px; }
            .divider { border-top: 2px solid #111; margin: 12px 0; }
            .divider-light { border-top: 1px solid #ddd; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            thead tr { background: #f3f4f6; }
            th { padding: 8px 10px; text-align: left; font-weight: 600; border-bottom: 1px solid #ccc; }
            td { padding: 7px 10px; border-bottom: 1px solid #eee; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .summary { margin-top: 20px; display: flex; justify-content: flex-end; }
            .summary-box { border: 1px solid #ccc; padding: 12px 20px; font-size: 13px; min-width: 240px; }
            .summary-row { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 6px; }
            .summary-row.total { font-weight: bold; border-top: 1px solid #ccc; padding-top: 6px; margin-top: 4px; }
            .badge-due { color: #dc2626; font-weight: 600; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const totalAmount = dueSlipData?.Items?.reduce((s, i) => s + (i.totalAmount ?? 0), 0) ?? 0;
  const totalPaid = dueSlipData?.Items?.reduce((s, i) => s + (i.paidAmount ?? 0), 0) ?? 0;
  const totalDue = totalAmount - totalPaid;

  return (
    <div className="fixed inset-0 ml-[16%] bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#353535] w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Due Slip — <span className="text-blue-600">{className}</span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Printer size={15} />
              Print
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading due slip...</div>
          ) : !dueSlipData?.Items?.length ? (
            <div className="text-center py-12 text-gray-500 italic">No due slip data found for this class.</div>
          ) : (
            <div ref={printRef}>
              {/* ── Printable Header ── */}
              <h1>Fee Due Slip</h1>
              <h2>{className}</h2>
              <p className="meta">
                Generated: {new Date().toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
              <div className="divider" />

              {/* ── Table ── */}
              <table>
                <thead>
                  <tr>
                    <th className="text-center">S.N</th>
                    <th>Student Name</th>
                    <th>Address</th>
                    <th className="text-right">Total Amount</th>
                    <th className="text-right">Paid Amount</th>
                    <th className="text-right">Due Amount</th>
                    <th className="text-right">Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {dueSlipData.Items.map((item: IDueSlipItem, idx: number) => {
                    const due = item.totalAmount - item.paidAmount;
                    return (
                      <tr key={idx}>
                        <td className="text-center">{idx + 1}</td>
                        <td>{item.studentName || "-"}</td>
                        <td>{item.address || "-"}</td>
                        <td className="text-right">{item.totalAmount.toLocaleString()}</td>
                        <td className="text-right">{item.paidAmount.toLocaleString()}</td>
                        <td className="text-right">
                          <span className={due > 0 ? "badge-due" : ""}>
                            {due.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-right">{item.discount.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* ── Summary ── */}
              <div className="summary">
                <div className="summary-box">
                  <div className="summary-row">
                    <span>Total Amount:</span>
                    <span>{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Total Paid:</span>
                    <span>{totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Due:</span>
                    <span className="badge-due">{totalDue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [dueSlipModal, setDueSlipModal] = useState(false); // ── NEW

  const { menuStatus } = usePermissions();
  const { canAdd, canEdit } = useMenuPermissionData(menuStatus);
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");

  const { data: allStudent } = useGetAllStudents("?IsPagination=false");
  const { data: allClasses } = useGetAllClass("?IsPagination=false");

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");  // ── NEW
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

  // ── Client-side class filter ──
  const clientFilteredItems = selectedClassId
    ? filteredStudentFee?.Items?.filter((fee) => fee.classId === selectedClassId)
    : filteredStudentFee?.Items;

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const form = useForm<IFilterStudentFee>({
    defaultValues: {
      studentId: "",
      startDate: "",
      endDate: "",
      classId: "",
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
    setSelectedClassId(null);
    setSelectedClassName("");
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

  // ── UPDATED: also store class name for the modal title ──
  const handleClassFilter = (classId: string | null, className: string = "") => {
    setSelectedClassId(classId);
    setSelectedClassName(className);
    setPaginationParams((prev) => ({ ...prev, pageIndex: 1 }));
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="flex w-full justify-between p-3 px-4 pt-4 items-start gap-3 flex-wrap">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <h1 className="text-xl font-semibold">All Student Fees</h1>

              {/* ── Class filter pill buttons ── */}
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => handleClassFilter(null, "")}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                    ${selectedClassId === null
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-[#444] text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-[#555]"
                    }`}
                >
                  All
                </button>

                {allClasses?.Items?.map((cls) => {
                  const id = cls.id ?? (cls as any).Id ?? "";
                  const isActive = selectedClassId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleClassFilter(id, cls.name)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                        ${isActive
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-[#444] text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-[#555]"
                        }`}
                    >
                      {cls.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end items-start">
              {/* ── Due Slip Button — disabled when no class selected ── */}
              <button
                type="button"
                disabled={!selectedClassId}
                onClick={() => setDueSlipModal(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors
                  ${selectedClassId
                    ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500 cursor-pointer"
                    : "bg-gray-100 dark:bg-[#444] text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed"
                  }`}
                title={!selectedClassId ? "Select a class to view due slip" : `View due slip for ${selectedClassName}`}
              >
                <FileText size={14} />
                Due Slip
              </button>

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
                ) : clientFilteredItems?.length ? (
                  clientFilteredItems.map(
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

        {clientFilteredItems && clientFilteredItems.length > 0 && (
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

      {/* Due Slip Modal */}
      {dueSlipModal && selectedClassId && (
        <DueSlipModal
          classId={selectedClassId}
          className={selectedClassName}
          onClose={() => setDueSlipModal(false)}
        />
      )}
    </>
  );
};

export default AllStudentFeeForm;