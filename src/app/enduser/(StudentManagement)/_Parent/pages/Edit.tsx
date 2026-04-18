import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IParent } from "../types/IParents";
import EditParentForm from "../components/EditParentForm";
import { useGetParentById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void; 
  ParentId: string;
}

const EditParent = ({ visible, onClose, onSuccess, ParentId }: Props) => {
  const { data: ParentData } = useGetParentById(ParentId);

  const form = useForm<IParent>({
    defaultValues: {
      fullName: "",
      parentType: 0,
      email: "",
      phoneNumber: "",
      imageUrl: "",
      address: "",
    },
  });

  useEffect(() => {
    if (ParentData) {
      form.reset({
        fullName: ParentData.fullName ?? "",
        parentType: ParentData.parentType ?? 0,
        email: ParentData.email ?? "",
        phoneNumber: ParentData.phoneNumber ?? "",
        imageUrl: ParentData.imageUrl ?? "",
        address: ParentData.address ?? "",
      });
    }
  }, [ParentData, form]);

  if (!visible) return null;

  return (
    <EditParentForm
      form={form}
      onClose={onClose}
      onSuccess={onSuccess}
      ParentId={ParentId}
    />
  );
};

export default EditParent;