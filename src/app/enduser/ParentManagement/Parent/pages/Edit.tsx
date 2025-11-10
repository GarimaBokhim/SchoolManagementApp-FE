import { useForm } from "react-hook-form";
import { IParent } from "../types/IParents";
import EditParentForm from "../components/EditParentForm";
import { useGetParentById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  ParentId: string;
}

const EditParent = ({ visible, onClose, ParentId }: Props) => {
  const { data: ParentData } = useGetParentById(ParentId);

  const form = useForm<IParent>({
    defaultValues: {
      fullName: ParentData?.fullName ?? "",
      parentType: ParentData?.parentType ?? 0,
      email: ParentData?.email ?? "",
      phoneNumber: ParentData?.phoneNumber ?? "",
      imageUrl: ParentData?.imageUrl ?? "",
      address: ParentData?.address ?? "",
    },
  });

  if (!visible) return null;

  return <EditParentForm form={form} onClose={onClose} ParentId={ParentId} />;
};

export default EditParent;
