/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
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

type Props = {
  form: UseFormReturn<IStudentFee>;
  onClose: () => void;
};

const AddStudentFeeForm = ({ form, onClose }: Props) => {
  const addStudentFee = useAddStudentFee();
  const { handleError, clearError } = useErrorHandler();

  const { data: allStudents } = useGetAllStudents();
  const { data: allClasses } = useGetAllClass();

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState("");
  const [feeDetails, setFeeDetails] = useState<IStudentFeeDetails[]>([]);

  const { data: feeStructuresByClass } = useGetFeeStructureByClassId(selectedClassId);

  // Mock data for testing - this will be replaced with actual API call later
  useEffect(() => {
    if (selectedFeeStructureId) {
      // Mock fee types data based on selected fee structure
      const mockFeeTypesData: Record<string, any> = {
        // You can add different mock data for different fee structure IDs
        "default": {
          Items: [
            { id: "fee-type-1", amount: 1000, times: 1, feePaidType: 1, name: "Tuition Fee" },
            { id: "fee-type-2", amount: 500, times: 2, feePaidType: 1, name: "Exam Fee" },
            { id: "fee-type-3", amount: 200, times: 1, feePaidType: 2, name: "Library Fee" },
            { id: "fee-type-4", amount: 300, times: 1, feePaidType: 2, name: "Sports Fee" },
          ]
        }
      };
      
      const mockData = mockFeeTypesData[selectedFeeStructureId] || mockFeeTypesData["default"];
      
      const details: IStudentFeeDetails[] = mockData.Items.map((feeType: any) => ({
        feeTypeId: feeType.id,
        discountAmount: 0,
        amount: feeType.amount || 0,
        times: feeType.times || 1,
        totalAmount: (feeType.amount || 0) * (feeType.times || 1),
        feePaidType: feeType.feePaidType || 1
      }));
      
      setFeeDetails(details);
      form.setValue("studentFeeDetailsDTOs", details);
    } else {
      setFeeDetails([]);
      form.setValue("studentFeeDetailsDTOs", []);
    }
  }, [selectedFeeStructureId, form]);

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
    }
  }, [selectedStudentId, allStudents, form]);

  useEffect(() => {
    form.setValue("classId", selectedClassId);
  }, [selectedClassId, form]);

  const onSubmit: SubmitHandler<IStudentFee> = async (data) => {
    clearError();
    try {
      // Calculate totals based on discount
      const discountPercentage = data.discountPercentage || 0;
      const updatedDetails = data.studentFeeDetailsDTOs.map(detail => ({
        ...detail,
        discountAmount: (detail.amount * discountPercentage) / 100,
        totalAmount: (detail.amount * detail.times) - ((detail.amount * discountPercentage * detail.times) / 100)
      }));
      
      const finalData = {
        studentId: data.studentId,
        feeStructureId: data.feeStructureId,
        classId: data.classId,
        discountPercentage: data.discountPercentage,
        studentFeeDetailsDTOs: updatedDetails
      };
      
      console.log("Sending data to API:", finalData); // For debugging
      
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

  // Update fee details when discount changes
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = Number(e.target.value);
    form.setValue("discountPercentage", discount);
    const updatedDetails = feeDetails.map(detail => ({
      ...detail,
      discountAmount: (detail.amount * discount) / 100,
      totalAmount: (detail.amount * detail.times) - ((detail.amount * discount * detail.times) / 100)
    }));
    setFeeDetails(updatedDetails);
    form.setValue("studentFeeDetailsDTOs", updatedDetails);
  };

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full max-w-4xl h-[100%] bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
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

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
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
                  const className = allClasses?.Items?.find((c) => c.id === s?.classId)?.name ?? "";
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

              <input
                type="hidden"
                {...form.register("classId")}
                value={selectedClassId}
              />

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
                  return f.feeCategoryName?.trim()
                    ? f.feeCategoryName
                    : "empty fee Structure";
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

            {/* Fee Details Table */}
            {feeDetails.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Fee Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                      <tr>
                        <th className="px-4 py-2 text-left">Fee Type</th>
                        <th className="px-4 py-2 text-right">Amount (Rs.)</th>
                        <th className="px-4 py-2 text-right">Times</th>
                        <th className="px-4 py-2 text-right">Discount (Rs.)</th>
                        <th className="px-4 py-2 text-right">Total (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeDetails.map((detail, index) => (
                        <tr key={index} className="border-b dark:border-gray-600">
                          <td className="px-4 py-2">{detail.feeTypeId}</td>
                          <td className="px-4 py-2 text-right">{detail.amount.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">{detail.times}</td>
                          <td className="px-4 py-2 text-right">{detail.discountAmount.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right font-semibold">
                            {detail.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-600 font-bold">
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-right">Grand Total:</td>
                        <td className="px-4 py-2 text-right">
                          Rs. {feeDetails.reduce((sum, d) => sum + d.totalAmount, 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
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