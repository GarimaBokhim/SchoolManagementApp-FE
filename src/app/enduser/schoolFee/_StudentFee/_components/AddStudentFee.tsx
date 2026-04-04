"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X, Plus, Trash2 } from "lucide-react";
import { IStudentFee, IStudentFeeDetails } from "../types/IStudentFee";
import { useAddStudentFee, useGetFeeStructureByClassId } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState, useEffect } from "react";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useGetAllFeeTypes } from "../../_FeeType/hooks";

const FEE_PAID_TYPE_OPTIONS = [
  { label: "One Time", value: 1 },
  { label: "Monthly", value: 2 },
  { label: "Quarterly", value: 3 },
  { label: "Yearly", value: 4 },
  { label: "Semester", value: 5 },
];

const emptyFeeDetail = (): IStudentFeeDetails => ({
  feeTypeId: "",
  discountAmount: 0,
  amount: 0,
  times: 1,
  totalAmount: 0,
  feePaidType: 1,
});

type Props = {
  form: UseFormReturn<IStudentFee>;
  onClose: () => void;
};

const AddStudentFeeForm = ({ form, onClose }: Props) => {
  const addStudentFee = useAddStudentFee();
  const { handleError, clearError } = useErrorHandler();

  const { data: allStudents } = useGetAllStudents();
  const { data: allClasses } = useGetAllClass();
  const { data: allFeeTypes } = useGetAllFeeTypes();

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState("");
  const [feeDetails, setFeeDetails] = useState<IStudentFeeDetails[]>([]);

  const { data: feeStructuresByClass } = useGetFeeStructureByClassId(selectedClassId);

  const handleClose = () => {
    form.reset();
    setSelectedStudentId("");
    setSelectedClassId("");
    setSelectedFeeStructureId("");
    setFeeDetails([]);
    onClose();
  };

  // Auto-set classId when student is selected
  useEffect(() => {
    const student = allStudents?.Items?.find((s) => s.id === selectedStudentId);
    if (student) {
      setSelectedClassId(student.classId ?? "");
      setSelectedFeeStructureId("");
      form.setValue("feeStructureId", "");
      form.setValue("studentFeeDetailsDTOs", []);
      setFeeDetails([]);
    }
  }, [selectedStudentId, allStudents, form]);

  useEffect(() => {
    form.setValue("classId", selectedClassId);
  }, [selectedClassId, form]);

  // Reset fee details when fee structure changes
  useEffect(() => {
    if (!selectedFeeStructureId) {
      setFeeDetails([]);
      form.setValue("studentFeeDetailsDTOs", []);
    }
  }, [selectedFeeStructureId, form]);

  // ── Row operations ──────────────────────────────────────────

  const addRow = () => {
    const updated = [...feeDetails, emptyFeeDetail()];
    setFeeDetails(updated);
    form.setValue("studentFeeDetailsDTOs", updated);
  };

  const removeRow = (index: number) => {
    const updated = feeDetails.filter((_, i) => i !== index);
    setFeeDetails(updated);
    form.setValue("studentFeeDetailsDTOs", updated);
  };

  const updateRow = (index: number, fields: Partial<IStudentFeeDetails>) => {
    const updated = feeDetails.map((d, i) => {
      if (i !== index) return d;
      const merged = { ...d, ...fields };
      // Recalculate totals whenever amount, times, or discount changes
      const discount = form.getValues("discountPercentage") || 0;
      merged.discountAmount = (merged.amount * discount) / 100;
      merged.totalAmount =
        merged.amount * merged.times -
        (merged.amount * discount * merged.times) / 100;
      return merged;
    });
    setFeeDetails(updated);
    form.setValue("studentFeeDetailsDTOs", updated);
  };

  // ── Discount ────────────────────────────────────────────────

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = Number(e.target.value);
    form.setValue("discountPercentage", discount);
    const updated = feeDetails.map((detail) => ({
      ...detail,
      discountAmount: (detail.amount * discount) / 100,
      totalAmount:
        detail.amount * detail.times -
        (detail.amount * discount * detail.times) / 100,
    }));
    setFeeDetails(updated);
    form.setValue("studentFeeDetailsDTOs", updated);
  };

  // ── Submit ──────────────────────────────────────────────────

  const onSubmit: SubmitHandler<IStudentFee> = async (data) => {
    clearError();

    if (!data.studentFeeDetailsDTOs || data.studentFeeDetailsDTOs.length === 0) {
      toast.error("Please add at least one fee detail.");
      return;
    }

    const hasEmptyFeeType = data.studentFeeDetailsDTOs.some((d) => !d.feeTypeId);
    if (hasEmptyFeeType) {
      toast.error("Please select a fee type for all rows.");
      return;
    }

    try {
      const finalData: IStudentFee = {
        studentId: data.studentId,
        feeStructureId: data.feeStructureId,
        classId: data.classId,
        discountPercentage: data.discountPercentage,
        studentFeeDetailsDTOs: data.studentFeeDetailsDTOs,
      };

      await toast.promise(addStudentFee.mutateAsync(finalData), {
        loading: "Adding Student Fee...",
        success: "Successfully added Student Fee",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      toast.error(errorMsg);
    }
  };

  const grandTotal = feeDetails.reduce((sum, d) => sum + d.totalAmount, 0);

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full max-w-4xl h-[100%] bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Add Student Fee
            </h1>
            <button
              type="button"
              onClick={onClose}
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

              {/* Class (read-only) */}
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
              <AppCombobox
                value={selectedFeeStructureId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Fee Structure"
                name="feeStructureId"
                form={form}
                required
                options={feeStructuresByClass?.Items ?? []}
                selected={
                  feeStructuresByClass?.Items?.find((f) => f.id === selectedFeeStructureId) ?? null
                }
                onSelect={(f) => {
                  const id = f?.id ?? "";
                  setSelectedFeeStructureId(id);
                  form.setValue("feeStructureId", id);
                }}
                getLabel={(f) => {
                  if (!f) return "";
                  return f.feeCategoryName?.trim() ? f.feeCategoryName : "Empty Fee Structure";
                }}
                getValue={(f) => f?.id ?? ""}
              />

              {/* Discount */}
              <InputElement
                label="Discount (%)"
                form={form}
                name="discountPercentage"
                placeholder="Enter Discount Percentage"
                inputType="number"
                onChange={handleDiscountChange}
              />
            </div>

            {/* Fee Details Section */}
            {selectedFeeStructureId && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Fee Details
                  </h3>
                  {/* Add Row Button */}
                  <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-all"
                  >
                    <Plus size={16} />
                    Add Fee Detail
                  </button>
                </div>

                {feeDetails.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                    No fee details added yet. Click &quot;Add Fee Detail&quot; to begin.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                      <thead className="bg-gray-100 dark:bg-gray-600">
                        <tr>
                          <th className="px-3 py-2 text-left text-sm">Fee Type</th>
                          <th className="px-3 py-2 text-left text-sm">Paid Type</th>
                          <th className="px-3 py-2 text-right text-sm">Amount (Rs.)</th>
                          <th className="px-3 py-2 text-right text-sm">Times</th>
                          <th className="px-3 py-2 text-right text-sm">Discount (Rs.)</th>
                          <th className="px-3 py-2 text-right text-sm">Total (Rs.)</th>
                          <th className="px-3 py-2 text-center text-sm">Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feeDetails.map((detail, index) => (
                          <tr key={index} className="border-b dark:border-gray-600">
                            
                            {/* Fee Type Dropdown */}
                            <td className="px-3 py-2">
                              <select
                                className="border rounded px-2 py-1 text-sm w-full bg-white dark:bg-gray-700 dark:border-gray-500 dark:text-white"
                                value={detail.feeTypeId}
                                onChange={(e) =>
                                  updateRow(index, { feeTypeId: e.target.value })
                                }
                              >
                                <option value="">-- Select --</option>
                                {allFeeTypes?.Items?.map((ft) => (
                                  <option key={ft.id} value={ft.id}>
                                    {ft.name}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Fee Paid Type Dropdown */}
                            <td className="px-3 py-2">
                              <select
                                className="border rounded px-2 py-1 text-sm w-full bg-white dark:bg-gray-700 dark:border-gray-500 dark:text-white"
                                value={detail.feePaidType}
                                onChange={(e) =>
                                  updateRow(index, { feePaidType: Number(e.target.value) })
                                }
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
                                className="border rounded px-2 py-1 text-sm text-right w-24 bg-white dark:bg-gray-700 dark:border-gray-500 dark:text-white"
                                value={detail.amount}
                                onChange={(e) =>
                                  updateRow(index, { amount: Number(e.target.value) })
                                }
                              />
                            </td>

                            {/* Times */}
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min={1}
                                className="border rounded px-2 py-1 text-sm text-right w-16 bg-white dark:bg-gray-700 dark:border-gray-500 dark:text-white"
                                value={detail.times}
                                onChange={(e) =>
                                  updateRow(index, { times: Number(e.target.value) })
                                }
                              />
                            </td>

                            {/* Discount Amount (read-only, auto-calculated) */}
                            <td className="px-3 py-2 text-right text-sm">
                              {detail.discountAmount.toFixed(2)}
                            </td>

                            {/* Total (read-only, auto-calculated) */}
                            <td className="px-3 py-2 text-right text-sm font-semibold">
                              {detail.totalAmount.toFixed(2)}
                            </td>

                            {/* Remove Row */}
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeRow(index)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      {/* Grand Total */}
                      <tfoot className="bg-gray-50 dark:bg-gray-600 font-bold">
                        <tr>
                          <td colSpan={5} className="px-3 py-2 text-right text-sm">
                            Grand Total:
                          </td>
                          <td className="px-3 py-2 text-right text-sm">
                            Rs. {grandTotal.toFixed(2)}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            )}

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