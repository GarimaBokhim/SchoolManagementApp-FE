"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X, Plus, Trash2 } from "lucide-react";
import { IStudentFee, IStudentFeeDetails } from "../types/IStudentFee";
import {
  useEditStudentFee,
  useGetFeeStructureByClassId,
} from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useGetAllFeeTypes } from "../../_FeeType/hooks";
import {
  useGetFeeStructureById,
  mapFeeStructureDTOsToDetails,
} from "../hooks/useGetFeeStructureById";
import { feeStructureIdToString } from "../utils/studentFeeForm";
import { useGetFeeStructureByStudent } from "../hooks/uae_feestructure_by_id";

const FEE_PAID_TYPE_OPTIONS = [
  { label: "One Time", value: 1 },
  { label: "Monthly", value: 2 },
  { label: "Quarterly", value: 3 },
  { label: "Yearly", value: 4 },
  { label: "Semester", value: 5 },
];

const getDefaultTimes = (feePaidType: number): number => {
  switch (feePaidType) {
    case 1: return 1;
    case 2: return 12;
    case 3: return 4;
    case 4: return 1;
    case 5: return 6;
    default: return 1;
  }
};

const calculateRowTotals = (
  row: IStudentFeeDetails,
  discountPercentage: number
): { discountAmount: number; totalAmount: number } => {
  const subtotal = row.amount * row.times;
  const discountAmount = subtotal * (discountPercentage / 100);
  const totalAmount = subtotal - discountAmount;
  return { discountAmount, totalAmount };
};

const createEmptyRow = (): IStudentFeeDetails => ({
  feeTypeId: "",
  feePaidType: 1,
  amount: 0,
  times: 1,
  discountAmount: 0,
  totalAmount: 0,
});

type Props = {
  form: UseFormReturn<IStudentFee>;
  onClose: () => void;
  editRecord: IStudentFee & { id: string };
};

const EditStudentFeeForm = ({ form, onClose, editRecord }: Props) => {
  const editStudentFee = useEditStudentFee();
  const { handleError, clearError } = useErrorHandler();

  const { data: allStudents } = useGetAllStudents();
  const { data: allClasses } = useGetAllClass();
  const { data: allFeeTypes } = useGetAllFeeTypes();

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState("");
  const [rows, setRows] = useState<IStudentFeeDetails[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Track if we're using the edit record's rows or if user selected a new fee structure
  const isUsingEditRecordRows = useRef(true);
  const lastHydratedEditIdRef = useRef<string | null>(null);

  const { data: feeStructuresByClass } = useGetFeeStructureByClassId(selectedClassId);
  const { data: feeStructureDetail, isLoading: isFeeStructureLoading } =
    useGetFeeStructureById(selectedFeeStructureId);
  const { data: feeStructureByStudent } = useGetFeeStructureByStudent(
    selectedStudentId || undefined
  );

  // ── Hydrate from editRecord once per record id ────────────────────────────
  useLayoutEffect(() => {
    if (!editRecord?.id) return;
    if (lastHydratedEditIdRef.current === editRecord.id) return;
    lastHydratedEditIdRef.current = editRecord.id;
    
    const fsId = feeStructureIdToString(editRecord.feeStructureId);
    setSelectedStudentId(editRecord.studentId);
    setSelectedClassId(editRecord.classId);
    setSelectedFeeStructureId(fsId);
    setDiscountPercentage(editRecord.discountPercentage ?? 0);
    form.setValue("discountPercentage", editRecord.discountPercentage ?? 0);

    const hydratedRows = (editRecord.studentFeeDetailsDTOs ?? []).map((d) => ({ ...d }));
    setRows(hydratedRows);
    // Mark that we're currently showing the edit record's rows
    isUsingEditRecordRows.current = true;
  }, [editRecord, form]);

  // ── Repopulate rows from fee structure detail when user selects a new fee structure ──
  useEffect(() => {
    // Only populate if:
    // 1. We have fee structure details
    // 2. We're NOT using the edit record's rows (i.e., user selected a new fee structure)
    // 3. OR we're populating for the first time and don't have rows yet
    if (!feeStructureDetail?.feeStructureDTOs?.length) return;
    
    // Don't overwrite if we're still using edit record rows AND we already have rows
    if (isUsingEditRecordRows.current && rows.length > 0) return;

    const populated = mapFeeStructureDTOsToDetails(
      feeStructureDetail.feeStructureDTOs,
      discountPercentage
    );
    setRows(populated);
    // After populating from fee structure, we're no longer using edit record rows
    isUsingEditRecordRows.current = false;
  }, [feeStructureDetail, discountPercentage, rows.length]);

  // ── Keep form in sync with rows ───────────────────────────────────────────
  useEffect(() => {
    form.setValue("studentFeeDetailsDTOs", rows);
  }, [rows, form]);

  // ── Recalculate all row totals when discount changes ──────────────────────
  useEffect(() => {
    setRows((prev) =>
      prev.map((row) => {
        const { discountAmount, totalAmount } = calculateRowTotals(row, discountPercentage);
        return { ...row, discountAmount, totalAmount };
      })
    );
  }, [discountPercentage]);

  // ── Row management ────────────────────────────────────────────────────────
  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
    isUsingEditRecordRows.current = false; // User added custom row, so we're no longer using edit record rows
  };

  const updateRow = (index: number, updates: Partial<IStudentFeeDetails>) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      if (updates.feePaidType !== undefined) {
        updated[index].times = getDefaultTimes(updates.feePaidType);
      }
      const { discountAmount, totalAmount } = calculateRowTotals(updated[index], discountPercentage);
      updated[index].discountAmount = discountAmount;
      updated[index].totalAmount = totalAmount;
      return updated;
    });
    isUsingEditRecordRows.current = false; // User modified row
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    isUsingEditRecordRows.current = false; // User removed row
  };

  // ── Discount change ───────────────────────────────────────────────────────
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setDiscountPercentage(value);
    form.setValue("discountPercentage", value);
  };

  const handleClose = () => {
    form.reset();
    setSelectedStudentId("");
    setSelectedClassId("");
    setSelectedFeeStructureId("");
    setRows([]);
    setDiscountPercentage(0);
    lastHydratedEditIdRef.current = null;
    isUsingEditRecordRows.current = true;
    onClose();
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<IStudentFee> = async (data) => {
    clearError();

    if (rows.length === 0) {
      toast.error("Please add at least one fee detail.");
      return;
    }
    const hasEmptyFeeType = rows.some((d) => !d.feeTypeId);
    if (hasEmptyFeeType) {
      toast.error("Please select a fee type for all rows.");
      return;
    }

    try {
      const fsId = feeStructureIdToString(data.feeStructureId as string | string[]);
      const finalData = {
        studentId: data.studentId,
        feeStructureId: fsId,
        classId: data.classId,
        discountPercentage,
        studentFeeDetailsDTOs: rows,
      };

      await toast.promise(
        editStudentFee.mutateAsync({ id: editRecord.id, data: finalData }),
        {
          loading: "Updating Student Fee...",
          success: "Successfully updated Student Fee",
        }
      );
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      toast.error(errorMsg);
    }
  };

  const grandTotal = rows.reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  // ── Display labels for locked fields ─────────────────────────────────────
  const studentLabel = (() => {
    const s = allStudents?.Items?.find((s) => s.id === selectedStudentId);
    if (!s) return "—";
    const cls = allClasses?.Items?.find((c) => c.id === s.classId)?.name ?? "";
    return `${s.firstName ?? ""} ${s.lastName ?? ""} - (${cls})`;
  })();

  const classLabel =
    allClasses?.Items?.find((c) => c.id === selectedClassId)?.name ?? "—";

  // ── Resolve selected fee structure for combobox ───────────────────────────
  const getSelectedFeeStructure = () => {
    const fromList = feeStructuresByClass?.Items?.find((f) => {
      const fid = f.id ?? (f as { Id?: string }).Id ?? "";
      return String(fid) === String(selectedFeeStructureId);
    });
    if (fromList) return fromList;

    // Fallback: synthesize from student fee structure API or feeStructureDetail
    const categoryName =
      feeStructureByStudent?.categoryName?.trim() ||
      feeStructureDetail?.feeCategoryName?.trim() ||
      (feeStructureDetail as unknown as { categoryName?: string })?.categoryName?.trim();

    if (selectedFeeStructureId && categoryName) {
      return {
        id: selectedFeeStructureId,
        feeCategoryName: categoryName,
      } as unknown as NonNullable<typeof feeStructuresByClass>["Items"][number];
    }

    return null;
  };

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full max-w-5xl h-[100%] bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Edit Student Fee
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-3xl hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Top Fields - All horizontally aligned */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

              {/* Student — locked, display only */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Student
                </label>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 min-h-[38px]">
                  {studentLabel}
                </div>
              </div>

              {/* Class — locked, display only */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Class
                </label>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 min-h-[38px]">
                  {classLabel}
                </div>
              </div>

              {/* Fee Structure - Now properly aligned horizontally */}
              <div className="flex flex-col gap-1">
                <AppCombobox
                  value={selectedFeeStructureId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Fee Structure (Optional)"
                  name="feeStructureId"
                  form={form}
                  options={feeStructuresByClass?.Items ?? []}
                  selected={getSelectedFeeStructure()}
                  onSelect={(f) => {
                    const id = f?.id ?? (f as { Id?: string }).Id ?? "";
                    setSelectedFeeStructureId(id);
                    form.setValue("feeStructureId", id, { shouldValidate: true });
                    // KEY: User selected a new fee structure, so we should NOT use edit record rows
                    isUsingEditRecordRows.current = false;
                    // Clear existing rows to show loading state or new data
                    setRows([]);
                  }}
                  getLabel={(f) => {
                    if (!f) return "";
                    return (
                      f.feeCategoryName?.trim() ||
                      (f as unknown as { categoryName?: string }).categoryName?.trim() ||
                      "Empty Fee Structure"
                    );
                  }}
                  getValue={(f) => f?.id ?? (f as { Id?: string }).Id ?? ""}
                />
              </div>
            </div>

            {/* Discount Field - Now on its own row for better layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <div className="flex flex-col gap-1">
                <InputElement
                  label="Discount (%)"
                  form={form}
                  name="discountPercentage"
                  placeholder="Enter Discount Percentage"
                  inputType="number"
                  onChange={handleDiscountChange}
                />
              </div>
            </div>

            {/* Fee Details Table */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Fee Details
                </h3>
                <div className="flex gap-2 items-center">
                  {isFeeStructureLoading && (
                    <span className="text-sm text-gray-400 animate-pulse">
                      Loading fee structure...
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow transition-all"
                  >
                    <Plus size={15} />
                    Add Row
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
                <table className="min-w-full bg-white dark:bg-gray-700 text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold w-12">S.N</th>
                      <th className="px-3 py-2 text-left font-semibold min-w-[150px]">Fee Type</th>
                      <th className="px-3 py-2 text-left font-semibold min-w-[120px]">Paid Type</th>
                      <th className="px-3 py-2 text-right font-semibold min-w-[100px]">Amount (Rs.)</th>
                      <th className="px-3 py-2 text-right font-semibold min-w-[80px]">Times</th>
                      <th className="px-3 py-2 text-right font-semibold min-w-[100px]">Discount (%)</th>
                      <th className="px-3 py-2 text-right font-semibold min-w-[120px]">Discount (Rs.)</th>
                      <th className="px-3 py-2 text-right font-semibold min-w-[120px]">Total (Rs.)</th>
                      <th className="px-3 py-2 text-center font-semibold w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFeeStructureLoading ? (
                      [1, 2, 3].map((i) => (
                        <tr key={i} className="border-t border-gray-100 dark:border-gray-600">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
                            <td key={j} className="px-3 py-3">
                              <div className="h-3 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : rows.length === 0 ? (
                      <tr className="border-t border-gray-100 dark:border-gray-600 text-gray-400 dark:text-gray-500">
                        <td colSpan={9} className="px-3 py-8 text-center">
                          No fee details. Select a fee structure or click "Add Row".
                        </td>
                      </tr>
                    ) : (
                      rows.map((detail, index) => (
                        <tr
                          key={index}
                          className="border-t border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors"
                        >
                          <td className="px-3 py-3 text-center text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </td>

                          {/* Fee Type */}
                          <td className="px-3 py-3">
                            <select
                              className="w-full border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                              value={detail.feeTypeId}
                              onChange={(e) => updateRow(index, { feeTypeId: e.target.value })}
                            >
                              <option value="">— Select —</option>
                              {allFeeTypes?.Items?.map((ft) => (
                                <option key={ft.id} value={ft.id}>
                                  {ft.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Paid Type */}
                          <td className="px-3 py-3">
                            <select
                              className="w-full border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                              value={detail.feePaidType}
                              onChange={(e) => updateRow(index, { feePaidType: Number(e.target.value) })}
                            >
                              {FEE_PAID_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Amount */}
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              className="w-24 border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm text-right bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 ml-auto block"
                              value={detail.amount}
                              onChange={(e) => updateRow(index, { amount: Number(e.target.value) })}
                            />
                          </td>

                          {/* Times */}
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              min={1}
                              className="w-16 border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm text-right bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 ml-auto block"
                              value={detail.times}
                              onChange={(e) => updateRow(index, { times: Number(e.target.value) })}
                            />
                          </td>

                          {/* Discount % */}
                          <td className="px-3 py-3 text-right text-blue-600 dark:text-blue-400 font-medium">
                            {discountPercentage}%
                          </td>

                          {/* Discount Rs. */}
                          <td className="px-3 py-3 text-right text-yellow-600 dark:text-yellow-400">
                            {detail.discountAmount?.toFixed(2) || "0.00"}
                          </td>

                          {/* Total */}
                          <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-white">
                            {detail.totalAmount?.toFixed(2) || "0.00"}
                          </td>

                          {/* Delete */}
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeRow(index)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              title="Remove row"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                  {rows.length > 0 && (
                    <tfoot className="bg-gray-50 dark:bg-gray-600 border-t-2 border-gray-200 dark:border-gray-500">
                      <tr>
                        <td colSpan={7} className="px-3 py-2 text-right font-bold text-gray-700 dark:text-gray-200 text-base">
                          Grand Total:
                        </td>
                        <td colSpan={2} className="px-3 py-2 text-right font-bold text-gray-900 dark:text-white text-base">
                          Rs. {grandTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <ButtonElement
                type="submit"
                text="Update"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default EditStudentFeeForm;