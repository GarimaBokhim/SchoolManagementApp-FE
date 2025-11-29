import { useForm } from "react-hook-form";
import { IClass } from "../types/IClass";
import EditClassForm from "../components/EditClassForm";
import { useGetClassById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  ClassId: string;
}

const EditClass = ({ visible, onClose, ClassId }: Props) => {
  const { data: ClassData } = useGetClassById(ClassId);

  const form = useForm<IClass>({
    defaultValues: {
      name: ClassData?.name ?? "",
    },
  });

  if (!visible) return null;

  return <EditClassForm form={form} onClose={onClose} ClassId={ClassId} />;
};

export default EditClass;
