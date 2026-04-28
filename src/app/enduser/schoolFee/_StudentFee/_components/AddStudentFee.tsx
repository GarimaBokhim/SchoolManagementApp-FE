"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X, Plus, Trash2, AlertCircle, Info } from "lucide-react";
import { IStudentFee, IStudentFeeDetails } from "../types/IStudentFee";
import {
  useAddStudentFee,
  useEditStudentFee,
} from "../hooks";
import { useGetAllFeeStructure } from "../../_FeeStructure/hooks";
import { IFeeStructure } from "../../_FeeStructure/types/IFeeStructure";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useGetAllStudentsV2 } from "@/app/enduser/(StudentManagement)/Student/hooks";
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

const createEmptyManualRow = (): IStudentFeeDetails => ({
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
  editRecord?: IStudentFee & { id: string };
};

const AddStudentFeeForm = ({ form, onClose, editRecord }: Props) => {
  const addStudentFee = useAddStudentFee();
  const editStudentFee = useEditStudentFee();
  const { handleError, clearError } = useErrorHandler();
  const isEditMode = Boolean(editRecord?.id);

  const { data: allStudents } = useGetAllStudentsV2();
  const { data: allClasses } = useGetAllClass();
  const { data: allFeeTypes } = useGetAllFeeTypes();

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState("");
  const [autoRows, setAutoRows] = useState<IStudentFeeDetails[]>([]);
  const [manualRows, setManualRows] = useState<IStudentFeeDetails[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const prevStudentIdRef = useRef<string | null>(null);
  const lastHydratedEditIdRef = useRef<string | null>(null);

  const { data: allFeeStructures } = useGetAllFeeStructure();

  const {
    data: feeStructureByStudent,
    isLoading: isFeeStructureByStudentLoading,
  } = useGetFeeStructureByStudent(
    !isEditMode && selectedStudentId ? selectedStudentId : undefined
  );

  const studentHasNoFeeStructure =
    !isEditMode &&
    !!selectedStudentId &&
    !isFeeStructureByStudentLoading &&
    feeStructureByStudent &&
    !feeStructureByStudent.feeStructureId?.trim();

  const studentFeeStructureCategoryName =
    feeStructureByStudent?.categoryName?.trim() || "";

  const watchedDiscount = form.watch("discountPercentage");

  useEffect(() => {
    if (watchedDiscount !== undefined && watchedDiscount !== discountPercentage) {
      setDiscountPercentage(watchedDiscount || 0);
    }
  }, [watchedDiscount]);

  const { data: feeStructureDetail, isLoading: isFeeStructureLoading } =
    useGetFeeStructureById(selectedFeeStructureId);

  useEffect(() => {
    if (isEditMode) return;
    if (!feeStructureDetail?.feeStructureDTOs?.length) {
      setAutoRows([]);
      return;
    }
    const autoPopulated = mapFeeStructureDTOsToDetails(
      feeStructureDetail.feeStructureDTOs,
      0
    );
    setAutoRows(autoPopulated);
  }, [feeStructureDetail, isEditMode]);

  useEffect(() => {
    if (isEditMode) return;
    if (!feeStructureByStudent) return;

    const fsId = feeStructureByStudent.feeStructureId?.trim();
    if (fsId) {
      setSelectedFeeStructureId(fsId);
      form.setValue("feeStructureId", fsId, { shouldValidate: true });
    } else {
      setSelectedFeeStructureId("");
      form.setValue("feeStructureId", "");
    }
  }, [feeStructureByStudent, isEditMode, form]);

  useEffect(() => {
    setManualRows((prev) =>
      prev.map((row) => {
        const { discountAmount, totalAmount } = calculateRowTotals(row, discountPercentage);
        return { ...row, discountAmount, totalAmount };
      })
    );
  }, [discountPercentage]);

  const handleClose = () => {
    form.reset();
    setSelectedStudentId("");
    setSelectedClassId("");
    setSelectedFeeStructureId("");
    setAutoRows([]);
    setManualRows([]);
    setDiscountPercentage(0);
    lastHydratedEditIdRef.current = null;
    onClose();
  };

  useLayoutEffect(() => {
    if (!editRecord?.id) {
      lastHydratedEditIdRef.current = null;
      return;
    }
    if (lastHydratedEditIdRef.current === editRecord.id) return;
    lastHydratedEditIdRef.current = editRecord.id;

    const fsId = feeStructureIdToString(editRecord.feeStructureId);
    setSelectedStudentId(editRecord.studentId);
    setSelectedClassId(editRecord.classId);
    setSelectedFeeStructureId(fsId);
    setDiscountPercentage(editRecord.discountPercentage ?? 0);
    prevStudentIdRef.current = editRecord.studentId;
    setAutoRows([]);
    setManualRows(
      (editRecord.studentFeeDetailsDTOs ?? []).map((d) => ({ ...d }))
    );
  }, [editRecord]);

  useEffect(() => {
    if (isEditMode) return;
    if (!selectedStudentId) {
      prevStudentIdRef.current = null;
      return;
    }
    const student = allStudents?.Items?.find(
      (s) => s.id != null && String(s.id) === String(selectedStudentId)
    );
    if (!student) return;

    setSelectedClassId(student.classId ?? "");

    if (prevStudentIdRef.current === selectedStudentId) return;
    prevStudentIdRef.current = selectedStudentId;

    setSelectedFeeStructureId("");
    setAutoRows([]);
    setManualRows([]);
    setDiscountPercentage(0);
    form.setValue("feeStructureId", "");
    form.setValue("discountPercentage", 0);
    form.setValue("studentFeeDetailsDTOs", []);
  }, [selectedStudentId, allStudents, form, isEditMode]);

  useEffect(() => {
    form.setValue("classId", selectedClassId);
  }, [selectedClassId, form]);

  useEffect(() => {
    if (isEditMode) return;
    if (!selectedFeeStructureId) {
      setAutoRows([]);
      form.setValue("studentFeeDetailsDTOs", []);
    }
  }, [selectedFeeStructureId, form, isEditMode]);

  const addManualRow = () => {
    setManualRows((prev) => [...prev, createEmptyManualRow()]);
  };

  const updateManualRow = (index: number, updates: Partial<IStudentFeeDetails>) => {
    setManualRows((prev) => {
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
  };

  const removeManualRow = (index: number) => {
    setManualRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setDiscountPercentage(value);
    form.setValue("discountPercentage", value);
  };

  useEffect(() => {
    const allDetails = [...autoRows, ...manualRows];
    form.setValue("studentFeeDetailsDTOs", allDetails);
  }, [autoRows, manualRows, form]);

  const onSubmit: SubmitHandler<IStudentFee> = async (data) => {
    clearError();

    const allDetails = [...autoRows, ...manualRows];

    if (allDetails.length === 0) {
      toast.error("Please add at least one fee detail.");
      return;
    }

    const hasEmptyFeeType = manualRows.some((d) => !d.feeTypeId);
    if (hasEmptyFeeType) {
      toast.error("Please select a fee type for all custom rows.");
      return;
    }

    try {
      const fsId = feeStructureIdToString(data.feeStructureId as string | string[]);
      const finalData = {
        studentId: data.studentId,
        feeStructureId: fsId,
        classId: data.classId,
        discountPercentage,
        studentFeeDetailsDTOs: allDetails,
      };

      if (isEditMode && editRecord?.id) {
        await toast.promise(
          editStudentFee.mutateAsync({ id: editRecord.id, data: finalData }),
          {
            loading: "Updating Student Fee...",
            success: "Successfully updated Student Fee",
          }
        );
      } else {
        await toast.promise(addStudentFee.mutateAsync(finalData), {
          loading: "Adding Student Fee...",
          success: "Successfully added Student Fee",
        });
      }
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      toast.error(errorMsg);
    }
  };

  const autoRowsTotal = autoRows.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
  const manualRowsTotal = manualRows.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
  const grandTotal = autoRowsTotal + manualRowsTotal;

  // ── FIXED: getFeeStructureLabel now handles categoryName from student API ────
  const getFeeStructureLabel = (f: IFeeStructure | null): string => {
    if (!f) return "";
    return (
      f.feeCategoryName?.trim() ||
      (f as unknown as { categoryName?: string }).categoryName?.trim() ||
      "Empty Name"
    );
  };

  // ── FIXED: selected falls back to synthesized object using student API data ──
  const getSelectedFeeStructure = () => {
    // First try to find in the full list
    const found = allFeeStructures?.Items?.find((f) => {
      const fid = f.id ?? (f as { Id?: string }).Id ?? "";
      return String(fid) === String(selectedFeeStructureId);
    });

    if (found) return found;

    // Fallback: synthesize object from student fee structure API response
    if (selectedFeeStructureId && studentFeeStructureCategoryName) {
      return {
        id: selectedFeeStructureId,
        feeCategoryName: studentFeeStructureCategoryName,
      } as unknown as IFeeStructure;
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
              {isEditMode ? "Edit Student Fee" : "Add Student Fee"}
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

            {/* Top Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

              {/* Student */}
              <AppCombobox
                value={selectedStudentId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Student"
                name="studentId"
                form={form}
                required
                disabled={isEditMode}
                options={allStudents?.Items}
                selected={allStudents?.Items?.find((s) => s.id === selectedStudentId) || null}
                onSelect={(s) => {
                  setSelectedStudentId(s?.id ?? "");
                  form.setValue("studentId", s?.id ?? "");
                }}
                getLabel={(s) => {
                  const className =
                    allClasses?.Items?.find((c) => c.id === s?.classId)?.name ?? "";
                  return `${s?.firstName ?? ""} ${s?.lastName ?? ""} - (${className})`;
                }}
                getValue={(s) => s?.id ?? ""}
              />

              {/* Class (read-only display) */}
              <InputElement
                label="Class"
                inputType="text"
                form={form}
                name="classDisplay"
                value={allClasses?.Items?.find((c) => c.id === selectedClassId)?.name ?? ""}
                disabled
              />

              <input type="hidden" {...form.register("classId")} value={selectedClassId} />

              {/* Fee Structure */}
              <div className="space-y-1">
                <AppCombobox
                  value={selectedFeeStructureId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Fee Structure (Optional)"
                  name="feeStructureId"
                  form={form}
                  options={allFeeStructures?.Items ?? []}
                  // ── FIXED: uses getSelectedFeeStructure() ──
                  selected={getSelectedFeeStructure()}
                  onSelect={(f) => {
                    const id = f?.id ?? (f as { Id?: string }).Id ?? "";
                    setSelectedFeeStructureId(id);
                    form.setValue("feeStructureId", id, { shouldValidate: true });
                    setManualRows([]);
                    form.setValue("studentFeeDetailsDTOs", []);
                    setAutoRows([]);
                  }}
                  getLabel={getFeeStructureLabel}
                  getValue={(f) => f?.id ?? (f as { Id?: string }).Id ?? ""}
                />

                {/* Loading indicator */}
                {!isEditMode && selectedStudentId && isFeeStructureByStudentLoading && (
                  <p className="flex items-center gap-1.5 text-xs text-gray-400 animate-pulse px-1">
                    <Info size={12} />
                    Fetching fee structure for student...
                  </p>
                )}

                {/* No fee structure assigned warning */}
                {studentHasNoFeeStructure && (
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2 mt-1">
                    <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-tight">
                      No fee structure is assigned to this student. You can still add custom fee rows below.
                    </p>
                  </div>
                )}
              </div>

              {/* Discount Percentage */}
              <InputElement
                label="Discount (%) for Custom Rows"
                form={form}
                name="discountPercentage"
                placeholder="Enter Discount Percentage"
                inputType="number"
                onChange={handleDiscountChange}
              />
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
                    onClick={addManualRow}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow transition-all"
                  >
                    <Plus size={15} />
                    Add Custom Row
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
                    ) : (
                      <>
                        {/* Auto-populated Rows (Read-only) */}
                        {autoRows.map((detail, index) => {
                          const feeTypeName =
                            allFeeTypes?.Items?.find((ft) => ft.id === detail.feeTypeId)?.name ??
                            (detail.feeTypeId || "—");
                          const paidTypeLabel =
                            FEE_PAID_TYPE_OPTIONS.find((o) => o.value === detail.feePaidType)?.label ?? "—";

                          return (
                            <tr
                              key={`auto-${index}`}
                              className="border-t border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-750"
                            >
                              <td className="px-3 py-3 text-center text-gray-500 dark:text-gray-400">
                                {index + 1}
                              </td>
                              <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-100">
                                {feeTypeName}
                              </td>
                              <td className="px-3 py-3 text-gray-600 dark:text-gray-300">
                                {paidTypeLabel}
                              </td>
                              <td className="px-3 py-3 text-right text-gray-800 dark:text-gray-100">
                                {detail.amount.toFixed(2)}
                              </td>
                              <td className="px-3 py-3 text-right text-gray-800 dark:text-gray-100">
                                {detail.times}
                              </td>
                              <td className="px-3 py-3 text-right text-gray-400">—</td>
                              <td className="px-3 py-3 text-right text-gray-400">—</td>
                              <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                {detail.totalAmount.toFixed(2)}
                              </td>
                              <td className="px-3 py-3 text-center" />
                            </tr>
                          );
                        })}

                        {/* Custom Rows (Editable) */}
                        {manualRows.map((detail, index) => {
                          const actualIndex = autoRows.length + index;
                          return (
                            <tr
                              key={`manual-${index}`}
                              className="border-t border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors"
                            >
                              <td className="px-3 py-3 text-center text-gray-500 dark:text-gray-400">
                                {actualIndex + 1}
                              </td>

                              <td className="px-3 py-3">
                                <select
                                  className="w-full border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                                  value={detail.feeTypeId}
                                  onChange={(e) => updateManualRow(index, { feeTypeId: e.target.value })}
                                >
                                  <option value="">— Select —</option>
                                  {allFeeTypes?.Items?.map((ft) => (
                                    <option key={ft.id} value={ft.id}>
                                      {ft.name}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td className="px-3 py-3">
                                <select
                                  className="w-full border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                                  value={detail.feePaidType}
                                  onChange={(e) => updateManualRow(index, { feePaidType: Number(e.target.value) })}
                                >
                                  {FEE_PAID_TYPE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td className="px-3 py-3">
                                <input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  className="w-24 border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm text-right bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 ml-auto block"
                                  value={detail.amount}
                                  onChange={(e) => updateManualRow(index, { amount: Number(e.target.value) })}
                                />
                              </td>

                              <td className="px-3 py-3">
                                <input
                                  type="number"
                                  min={1}
                                  className="w-16 border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm text-right bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 ml-auto block"
                                  value={detail.times}
                                  onChange={(e) => updateManualRow(index, { times: Number(e.target.value) })}
                                />
                              </td>

                              <td className="px-3 py-3 text-right text-blue-600 dark:text-blue-400 font-medium">
                                {discountPercentage}%
                              </td>

                              <td className="px-3 py-3 text-right text-yellow-600 dark:text-yellow-400">
                                {detail.discountAmount?.toFixed(2) || "0.00"}
                              </td>

                              <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                {detail.totalAmount?.toFixed(2) || "0.00"}
                              </td>

                              <td className="px-3 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeManualRow(index)}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                  title="Remove row"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                        {/* Empty state */}
                        {autoRows.length === 0 && manualRows.length === 0 && (
                          <tr className="border-t border-gray-100 dark:border-gray-600">
                            <td colSpan={9} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">
                              {studentHasNoFeeStructure
                                ? "This student has no fee structure assigned. Add custom rows using the button above."
                                : "No fee details added. Please select a fee structure or add custom rows."}
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>

                  {(autoRows.length > 0 || manualRows.length > 0) && (
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
                text="Submit"
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddStudentFeeForm;