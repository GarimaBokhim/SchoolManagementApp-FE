import { useForm } from "react-hook-form";
import { IIssuedCertificate } from "../types/IIssuedCertificate";
import EditIssuedCertificateForm from "../components/EditIssuedCertificateForm";
import { useGetIssuedCertificateById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  IssuedCertificateId: string;
}

const EditIssuedCertificate = ({
  visible,
  onClose,
  IssuedCertificateId,
}: Props) => {
  const { data: IssuedCertificateData } =
    useGetIssuedCertificateById(IssuedCertificateId);

  const form = useForm<IIssuedCertificate>({
    defaultValues: {
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
    },
  });

  if (!visible) return null;

  return (
    <EditIssuedCertificateForm
      form={form}
      onClose={onClose}
      IssuedCertificateId={IssuedCertificateId}
    />
  );
};

export default EditIssuedCertificate;
