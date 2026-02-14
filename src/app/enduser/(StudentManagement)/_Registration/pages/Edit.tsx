import { useForm } from "react-hook-form";
import { IRegistration } from "../types/IRegistration";
import EditRegistrationForm from "../components/EditRegistrationForm";
import { useGetRegistrationById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  RegistrationId: string;
}

const EditRegistration = ({ visible, onClose, RegistrationId }: Props) => {
  const { data: RegistrationData } = useGetRegistrationById(RegistrationId);

  const form = useForm<IRegistration>({
    defaultValues: {
      studentId: RegistrationData?.studentId ?? "",
      classId: RegistrationData?.classId ?? "",
      academicYearId: RegistrationData?.academicYearId ?? "",
    },
  });

  if (!visible) return null;

  return (
    <EditRegistrationForm
      form={form}
      onClose={onClose}
      RegistrationId={RegistrationId}
    />
  );
};

export default EditRegistration;
