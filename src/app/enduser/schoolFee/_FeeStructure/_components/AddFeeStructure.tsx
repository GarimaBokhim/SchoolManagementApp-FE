"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X, Plus, Trash2 } from "lucide-react";
import { IFeeStructure, IFeeStructureDTO } from "../types/IFeeStructure";
import { useAddFeeStructure } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useGetAllFeeTypes } from "../../_FeeType/hooks";
import { useFilterFeeCategoryByDate } from "../../_FeeCategory/hooks";

// ── Constants ────────────────────────────────────────────────────────────────
const FEE_PAID_TYPE_OPTIONS = [
  { label: "One Time", value: 1 },
  { label: "Monthly", value: 2 },
  { label: "Quarterly", value: 3 },
  { label: "Yearly", value: 4 },
  { label: "Semester", value: 5 },
];

// Helper function to get default times based on feePaidType
const getDefaultTimes = (feePaidType: number): number => {
  switch (feePaidType) {
    case 1: // One Time
      return 1;
    case 2: // Monthly
      return 12;
    case 3: // Quarterly
      return 4;
    case 4: // Yearly
      return 1;
    case 5: // Semester
      return 6;
    default:
      return 1;
  }
};

const emptyRow = (): IFeeStructureDTO => ({
  feeTypeId: "",
  amount: 0,
  discountAmount: 0,
  times: 1,
  totalAmount: 0,
  feePaidType: 1,
  discountPercentage: 0, // Add percentage field
});

// Calculate discount amount based on percentage
const calcDiscountAmount = (amount: number, times: number, percentage: number): number => {
  const subtotal = amount * times;
  return (subtotal * percentage) / 100;
};

// Calculate total amount after discount
const calcTotalAmount = (amount: number, times: number, discountAmount: number): number => {
  return amount * times - discountAmount;
};

// ── Props ────────────────────────────────────────────────────────────────────
type Props = {
  form: UseFormReturn<IFeeStructure>;
  onClose: () => void;
};

const AddFeeStructureForm = ({ form, onClose }: Props) => {
  const addFeeStructure = useAddFeeStructure();
  const { handleError, clearError } = useErrorHandler();

  const { data: allClass } = useGetAllClass("?IsPagination=false");
  const { data: allFeeType } = useGetAllFeeTypes("?IsPagination=false");
  const { data: allFeeCategory } = useFilterFeeCategoryByDate("?IsPagination=false");

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedFeeCategoryId, setSelectedFeeCategoryId] = useState("");
  const [rows, setRows] = useState<IFeeStructureDTO[]>([emptyRow()]);

  const handleClose = () => {
    form.reset();
    setSelectedClassId("");
    setSelectedFeeCategoryId("");
    setRows([emptyRow()]);
    onClose();
  };

  // ── Row helpers ──────────────────────────────────────────────────────────────
  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index: number) => {
    if (rows.length === 1) return; // keep at least one row
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, fields: Partial<IFeeStructureDTO>) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const updated = { ...row, ...fields };
        
        // If feePaidType is being updated, auto-update the times field
        if (fields.feePaidType !== undefined) {
          updated.times = getDefaultTimes(fields.feePaidType);
        }
        
        // Calculate discount amount based on percentage if percentage or amount or times changed
        if (fields.discountPercentage !== undefined || fields.amount !== undefined || fields.times !== undefined) {
          const discountAmount = calcDiscountAmount(
            updated.amount,
            updated.times,
            updated.discountPercentage || 0
          );
          updated.discountAmount = discountAmount;
        }
        
        // If discount amount is manually set, calculate percentage from it
        if (fields.discountAmount !== undefined) {
          const subtotal = updated.amount * updated.times;
          if (subtotal > 0) {
            updated.discountPercentage = (updated.discountAmount / subtotal) * 100;
          } else {
            updated.discountPercentage = 0;
          }
        }
        
        updated.totalAmount = calcTotalAmount(updated.amount, updated.times, updated.discountAmount);
        return updated;
      })
    );
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<IFeeStructure> = async () => {
    clearError();

    if (!selectedClassId) {
      toast.error("Please select a class.");
      return;
    }
    if (!selectedFeeCategoryId) {
      toast.error("Please select a fee category.");
      return;
    }
    const hasEmptyFeeType = rows.some((r) => !r.feeTypeId);
    if (hasEmptyFeeType) {
      toast.error("Please select a fee type for every row.");
      return;
    }

    const payload = {
      classId: selectedClassId,
      feeCategoryId: selectedFeeCategoryId,
      feeStructureDTOs: rows.map((r) => ({
        feeTypeId: r.feeTypeId,
        amount: Number(r.amount),
        discountAmount: Number(r.discountAmount),
        times: Number(r.times),
        totalAmount: calcTotalAmount(r.amount, r.times, r.discountAmount),
        feePaidType: r.feePaidType,
        discountPercentage: Number(r.discountPercentage || 0),
      })),
    };

    try {
      await toast.promise(addFeeStructure.mutateAsync(payload), {
        loading: "Adding Fee Structure...",
        success: "Successfully added Fee Structure",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  const grandTotal = rows.reduce((sum, r) => sum + calcTotalAmount(r.amount, r.times, r.discountAmount), 0);

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-[100%] bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Add Fee Structure
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-3xl hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <X strokeWidth={4} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Top Fields: Class + Fee Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <AppCombobox
                value={selectedClassId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Class"
                name="classId"
                form={form}
                required
                options={allClass?.Items}
                selected={allClass?.Items?.find((c) => c.id === selectedClassId) || null}
                onSelect={(c) => setSelectedClassId(c?.id ?? "")}
                getLabel={(c) => c?.name ?? ""}
                getValue={(c) => c?.id ?? ""}
              />

              <AppCombobox
                value={selectedFeeCategoryId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Fee Category"
                name="feeCategoryId"
                form={form}
                required
                options={allFeeCategory?.Items}
                selected={allFeeCategory?.Items?.find((fc) => fc.id === selectedFeeCategoryId) || null}
                onSelect={(fc) => setSelectedFeeCategoryId(fc?.id ?? "")}
                getLabel={(fc) => fc?.name ?? ""}
                getValue={(fc) => fc?.id ?? ""}
              />
            </div>

            {/* Fee Structure Rows Table */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Fee Details
                </h3>
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-all"
                >
                  <Plus size={15} />
                  Add Row
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
                <table className="min-w-full bg-white dark:bg-gray-700 text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold w-8">S.N</th>
                      <th className="px-3 py-2 text-left font-semibold">Fee Type</th>
                      <th className="px-3 py-2 text-left font-semibold">Paid Type</th>
                      <th className="px-3 py-2 text-right font-semibold">Amount (Rs.)</th>
                      <th className="px-3 py-2 text-right font-semibold">Times</th>
                      <th className="px-3 py-2 text-right font-semibold">Subtotal (Rs.)</th>
                      <th className="px-3 py-2 text-right font-semibold">Discount (%)</th>
                      <th className="px-3 py-2 text-right font-semibold">Discount (Rs.)</th>
                      <th className="px-3 py-2 text-right font-semibold">Total (Rs.)</th>
                      <th className="px-3 py-2 text-center font-semibold w-12">
                        <Trash2 size={14} className="mx-auto opacity-50" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      const subtotal = row.amount * row.times;
                      return (
                        <tr
                          key={index}
                          className="border-t border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors"
                        >
                          {/* S.N */}
                          <td className="px-3 py-2 text-center text-gray-400 dark:text-gray-500">
                            {index + 1}
                          </td>

                          {/* Fee Type */}
                          <td className="px-3 py-2">
                            <select
                              className="w-full border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                              value={row.feeTypeId}
                              onChange={(e) => updateRow(index, { feeTypeId: e.target.value })}
                            >
                              <option value="">— Select —</option>
                              {allFeeType?.Items?.map((ft) => (
                                <option key={ft.id} value={ft.id}>
                                  {ft.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Paid Type */}
                          <td className="px-3 py-2">
                            <select
                              className="w-full border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                              value={row.feePaidType}
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
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              className="w-24 border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm text-right bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 ml-auto block"
                              value={row.amount}
                              onChange={(e) => updateRow(index, { amount: Number(e.target.value) })}
                            />
                          </td>

                          {/* Times */}
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={1}
                              className="w-16 border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm text-right bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 ml-auto block"
                              value={row.times}
                              onChange={(e) => updateRow(index, { times: Number(e.target.value) })}
                            />
                          </td>

                          {/* Subtotal (read-only) */}
                          <td className="px-3 py-2 text-right font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {subtotal.toFixed(2)}
                          </td>

                          {/* Discount Percentage */}
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step="0.01"
                              className="w-20 border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1.5 text-sm text-right bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 ml-auto block"
                              value={row.discountPercentage || 0}
                              onChange={(e) => updateRow(index, { discountPercentage: Number(e.target.value) })}
                            />
                          </td>

                          {/* Discount Amount (auto-calculated) */}
                          <td className="px-3 py-2 text-right text-red-600 dark:text-red-400 whitespace-nowrap">
                            {row.discountAmount.toFixed(2)}
                          </td>

                          {/* Total Amount (after discount) */}
                          <td className="px-3 py-2 text-right font-bold text-gray-800 dark:text-white whitespace-nowrap">
                            {calcTotalAmount(row.amount, row.times, row.discountAmount).toFixed(2)}
                          </td>

                          {/* Remove Row */}
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeRow(index)}
                              disabled={rows.length === 1}
                              className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Grand Total Footer */}
                  <tfoot className="bg-gray-50 dark:bg-gray-600 border-t-2 border-gray-200 dark:border-gray-500">
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-2 text-right font-bold text-gray-700 dark:text-gray-200 text-sm"
                      >
                        Grand Total:
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                        Rs. {grandTotal.toFixed(2)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Submit */}
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

export default AddFeeStructureForm;