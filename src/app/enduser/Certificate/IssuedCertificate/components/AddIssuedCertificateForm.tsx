"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { IIssuedCertificate } from "../types/IIssuedCertificate";
import { useAddIssuedCertificate } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllStudents } from "@/app/enduser/StudentManagement/Student/hooks";
import { useState } from "react";
import { useGetAllTemplate } from "../../CertificateTemplate/hooks";
type Props = {
  form: UseFormReturn<IIssuedCertificate>;
  onClose: () => void;
};
const AddIssuedCertificateForm = ({ form, onClose }: Props) => {
  const addIssuedCertificate = useAddIssuedCertificate();
  const { handleError, clearError } = useErrorHandler();
  const { data: allStudent } = useGetAllStudents();
  const { data: allTemplate } = useGetAllTemplate();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    ""
  );
  const handleClose = () => {
    form.reset();
  };
  const onSubmit: SubmitHandler<IIssuedCertificate> = async (data) => {
    clearError();
    try {
      await toast.promise(addIssuedCertificate.mutateAsync(data), {
        loading: "Adding IssuedCertificate...",
        success: "Successfully added IssuedCertificate",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add IssuedCertificate
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500 "
            >
              <X strokeWidth={3} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <AppCombobox
                value={selectedTemplateId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Template"
                name="templateId"
                form={form}
                required
                options={allTemplate?.Items}
                selected={
                  allTemplate?.Items?.find(
                    (g) => g.id === selectedTemplateId
                  ) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedTemplateId(group.id || null);
                  } else {
                    setSelectedTemplateId(null);
                  }
                }}
                getLabel={(g) => g?.templateName ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <AppCombobox
                value={selectedStudentId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Student"
                name="studentId"
                form={form}
                required
                options={allStudent?.Items}
                selected={
                  allStudent?.Items?.find((g) => g.id === selectedStudentId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedStudentId(group.id || null);
                  } else {
                    setSelectedStudentId(null);
                  }
                }}
                getLabel={(g) => g?.firstName ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              <InputElement
                label="Certificate Number"
                form={form}
                name="certificateNumber"
                placeholder="Enter Certificate Number"
                required
              />
              <InputElement
                label="issued Date"
                form={form}
                name="issuedDate"
                inputType="Date"
                placeholder="Enter Issued Date"
              />
              <InputElement
                label="Issued By"
                form={form}
                name="issuedBy"
                placeholder="Enter Issued By Name"
                required
              />
              <InputElement
                label="Pdf Path"
                form={form}
                name="pdfPath"
                placeholder="Enter Pdf Path"
                required
              />
              <InputElement
                label="Remarks"
                form={form}
                name="remarks"
                placeholder="Enter Remarks"
              />
              <InputElement
                label="Year of Completion Date"
                form={form}
                name="yearOfCompletion"
                inputType="Date"
                placeholder="Enter Year of Completion Date"
              />
              <InputElement
                label="Program"
                form={form}
                name="program"
                placeholder="Enter Program Name"
                required
              />
              <InputElement
                label="Symbol Number"
                form={form}
                name="symbolNumber"
                placeholder="Enter Symbol Number"
                required
              />
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={"Submit"} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddIssuedCertificateForm;
