"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { IIssuedCertificate } from "../types/IIssuedCertificate";
import {
  useEditIssuedCertificate,
  useGetIssuedCertificateById,
} from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllStudents } from "@/app/enduser/StudentManagement/Student/hooks";
import { useGetAllTemplate } from "../../CertificateTemplate/hooks";
type Props = {
  form: UseFormReturn<IIssuedCertificate>;
  onClose: () => void;
  IssuedCertificateId: string;
};
const EditIssuedCertificateForm = ({
  form,
  onClose,
  IssuedCertificateId,
}: Props) => {
  const editIssuedCertificate = useEditIssuedCertificate();
  const { handleError, clearError } = useErrorHandler();
  const { data: allTemplate } = useGetAllTemplate();
  const { data: IssuedCertificateData } =
    useGetIssuedCertificateById(IssuedCertificateId);
  const handleClose = () => {
    form.reset();
  };
  const { data: allStudent } = useGetAllStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    ""
  );
  useEffect(() => {
    if (IssuedCertificateData) {
      form.reset({
        templateId: IssuedCertificateData?.templateId ?? "",
        studentId: IssuedCertificateData?.studentId ?? "",
        certificateNumber: IssuedCertificateData?.certificateNumber ?? "",
        issuedDate: IssuedCertificateData?.issuedDate ?? new Date(),
        issuedBy: IssuedCertificateData?.issuedBy ?? "",
        pdfPath: IssuedCertificateData?.pdfPath ?? "",
        remarks: IssuedCertificateData?.remarks ?? "",
        status: IssuedCertificateData?.status ?? 0,
        yearOfCompletion: IssuedCertificateData?.yearOfCompletion ?? new Date(),
        program: IssuedCertificateData?.program ?? "",
        symbolNumber: IssuedCertificateData?.symbolNumber ?? "",
      });
      setSelectedStudentId(IssuedCertificateData.studentId);
      setSelectedTemplateId(IssuedCertificateData.templateId);
    }
  }, [IssuedCertificateData]);
  const onSubmit: SubmitHandler<IIssuedCertificate> = async (data) => {
    clearError();

    try {
      clearError();
      await toast.promise(
        editIssuedCertificate.mutateAsync({
          id: IssuedCertificateId,
          data: data,
        }),
        {
          loading: "Submitting Data",
          success: "Successfully Edited Income",
        }
      );
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
      >
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Update IssuedCertificate
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

export default EditIssuedCertificateForm;
