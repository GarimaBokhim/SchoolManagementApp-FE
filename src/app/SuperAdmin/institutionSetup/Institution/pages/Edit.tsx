"use client";
import { useForm } from "react-hook-form";
import { useGetInstitutionById } from "../hooks";
import { IInstitution } from "../types/IInstitution";
import EditInstitutionForm from "../components/EditInstitutionForm";
type Props = {
  visible: boolean;
  onClose: () => void;
  institutionId: string;
};
const EditInstitution = ({ visible, onClose, institutionId }: Props) => {
  const { data: institutionData } = useGetInstitutionById(institutionId);
  const form = useForm<IInstitution>({
    values: {
      id: institutionData?.id ?? "",
      name: institutionData?.name ?? "",
      address: institutionData?.address ?? "",
      email: institutionData?.email ?? "",
      shortName: institutionData?.shortName ?? "",
      contactNumber: institutionData?.contactNumber ?? "",
      contactPerson: institutionData?.contactPerson ?? "",
      pan: institutionData?.pan ?? "",
      imageUrl: institutionData?.imageUrl ?? "",
      isEnable: institutionData?.isEnable ?? "",
      isDeleted: institutionData?.isDeleted ?? "",
      organizationId: institutionData?.organizationId ?? "",
    },
  });

  if (!visible) return null;
  return (
    <EditInstitutionForm
      form={form}
      institutionId={institutionId}
      onClose={() => onClose()}
    />
  );
};
export default EditInstitution;
