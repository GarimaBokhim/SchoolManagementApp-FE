"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X } from "lucide-react";
import { IStudentFee, IStudentFeeDetails } from "../types/IStudentFee";
import { useAddStudentFee, useGetFeeStructureByClassId } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState, useEffect } from "react";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useGetAllFeeTypes } from "../../_FeeType/hooks";
import {
  useGetFeeStructureById,
  mapFeeStructureDTOsToDetails,
} from "../hooks/useGetFeeStructureById";

const FEE_PAID_TYPE_OPTIONS = [
  { label: "One Time", value: 1 },
  { label: "Monthly", value: 2 },
  { label: "Quarterly", value: 3 },
  { label: "Yearly", value: 4 },
  { label: "Semester", value: 5 },
];

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

  // ── Fetch the selected fee structure's full details ──────────────────────────
  const { data: feeStructureDetail, isLoading: isFeeStructureLoading } =
    useGetFeeStructureById(selectedFeeStructureId);

  // ── Auto-populate table when fee structure data arrives ──────────────────────
  useEffect(() => {
    if (!feeStructureDetail?.feeStructureDTOs?.length) return

    const discount = form.getValues("discountPercentage") || 0
    const populated = mapFeeStructureDTOsToDetails(
      feeStructureDetail.feeStructureDTOs,
      discount
    )
    setFeeDetails(populated)
    form.setValue("studentFeeDetailsDTOs", populated)
  }, [feeStructureDetail])

  const handleClose = () => {
    form.reset();
    setSelectedStudentId("");
    setSelectedClassId("");
    setSelectedFeeStructureId("");
    setFeeDetails([]);
    onClose();
  };

  // ── Auto-set classId when student is selected ────────────────────────────────
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

  // ── Clear table when fee structure is deselected ─────────────────────────────
  useEffect(() => {
    if (!selectedFeeStructureId) {
      setFeeDetails([]);
      form.setValue("studentFeeDetailsDTOs", []);
    }
  }, [selectedFeeStructureId, form]);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit: SubmitHandler<IStudentFee> = async (data) => {
    clearError();

    if (!data.studentFeeDetailsDTOs || data.studentFeeDetailsDTOs.length === 0) {
      toast.error("Please select a fee structure first.");
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
                  // Clear existing details while new fee structure loads
                  setFeeDetails([]);
                  form.setValue("studentFeeDetailsDTOs", []);
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
              />
            </div>

            {/* Fee Details Table — always visible */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Fee Details
                </h3>
                {isFeeStructureLoading && (
                  <span className="text-sm text-gray-400 animate-pulse">
                    Loading fee structure...
                  </span>
                )}
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
                <table className="min-w-full bg-white dark:bg-gray-700 text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">S.N</th>
                      <th className="px-3 py-2 text-left font-semibold">Fee Type</th>
                      <th className="px-3 py-2 text-left font-semibold">Paid Type</th>
                      <th className="px-3 py-2 text-right font-semibold">Amount (Rs.)</th>
                      <th className="px-3 py-2 text-right font-semibold">Times</th>
                      <th className="px-3 py-2 text-right font-semibold">Discount (Rs.)</th>
                      <th className="px-3 py-2 text-right font-semibold">Total (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFeeStructureLoading ? (
                      // Skeleton rows while fetching
                      [1, 2, 3].map((i) => (
                        <tr key={i} className="border-t border-gray-100 dark:border-gray-600">
                          {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                            <td key={j} className="px-3 py-3">
                              <div className="h-3 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : feeDetails.length === 0 ? (
                      // Default empty row with zeros before any fee structure is selected
                      <tr className="border-t border-gray-100 dark:border-gray-600 text-gray-400 dark:text-gray-500">
                        <td className="px-3 py-3 text-center">1</td>
                        <td className="px-3 py-3">—</td>
                        <td className="px-3 py-3">—</td>
                        <td className="px-3 py-3 text-right">0.00</td>
                        <td className="px-3 py-3 text-right">0</td>
                        <td className="px-3 py-3 text-right">0.00</td>
                        <td className="px-3 py-3 text-right">0.00</td>
                      </tr>
                    ) : (
                      feeDetails.map((detail, index) => {
                        const feeTypeName =
                          allFeeTypes?.Items?.find((ft) => ft.id === detail.feeTypeId)?.name ?? detail.feeTypeId
                        const paidTypeLabel =
                          FEE_PAID_TYPE_OPTIONS.find((o) => o.value === detail.feePaidType)?.label ?? '—'

                        return (
                          <tr
                            key={index}
                            className="border-t border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors"
                          >
                            <td className="px-3 py-3 text-center text-gray-500 dark:text-gray-400">
                              {index + 1}
                            </td>
                            <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-100">
                              {feeTypeName || '—'}
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
                            <td className="px-3 py-3 text-right text-yellow-600 dark:text-yellow-400">
                              {detail.discountAmount.toFixed(2)}
                            </td>
                            <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-white">
                              {detail.totalAmount.toFixed(2)}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>

                  {/* Grand Total footer */}
                  <tfoot className="bg-gray-50 dark:bg-gray-600 border-t-2 border-gray-200 dark:border-gray-500">
                    <tr>
                      <td colSpan={6} className="px-3 py-2 text-right font-bold text-gray-700 dark:text-gray-200 text-sm">
                        Grand Total:
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-gray-900 dark:text-white text-sm">
                        Rs. {grandTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
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