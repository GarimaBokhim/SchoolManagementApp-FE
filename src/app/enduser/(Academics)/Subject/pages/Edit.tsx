import { useForm } from "react-hook-form";
import { ISubject } from "../types/ISubjects";
import EditSubjectForm from "../components/EditSubjectForm";
import { useGetSubjectById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  SubjectId: string;
}

const EditSubject = ({ visible, onClose, SubjectId }: Props) => {
  const { data: SubjectData } = useGetSubjectById(SubjectId);

  const form = useForm<ISubject>({
    defaultValues: {
      name: SubjectData?.name ?? "",
      code: SubjectData?.code ?? "",
      creditHours: SubjectData?.creditHours ?? 0,
      description: SubjectData?.description ?? "",
      classId: SubjectData?.classId ?? "",
    },
  });

  if (!visible) return null;

  return (
    <EditSubjectForm form={form} onClose={onClose} SubjectId={SubjectId} />
  );
};

export default EditSubject;
