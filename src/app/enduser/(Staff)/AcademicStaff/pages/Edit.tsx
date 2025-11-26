import { useForm } from "react-hook-form";
import { IAcademicTeam } from "../types/IAcademicTeam";
import EditAcademicTeamForm from "../components/EditAcademicTeam";
import { useGetAcademicTeamById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  AcademicTeamId: string;
}

const EditAcademicTeam = ({ visible, onClose, AcademicTeamId }: Props) => {
  const { data: AcademicTeamData } = useGetAcademicTeamById(AcademicTeamId);

  const form = useForm<IAcademicTeam>({
    defaultValues: {
      firstName: AcademicTeamData?.firstName ?? "",
      lastName: AcademicTeamData?.lastName ?? "",
      email: AcademicTeamData?.email ?? "",
      username: AcademicTeamData?.username ?? "",
      address: AcademicTeamData?.address ?? "",
      rolesId: AcademicTeamData?.rolesId ?? [""],
    },
  });

  if (!visible) return null;

  return (
    <EditAcademicTeamForm
      form={form}
      onClose={onClose}
      AcademicTeamId={AcademicTeamId}
    />
  );
};

export default EditAcademicTeam;
