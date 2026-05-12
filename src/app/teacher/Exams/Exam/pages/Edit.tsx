import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IExam } from "../types/IExams";
import EditExamForm from "../components/EditExamForm";
import { useGetExamById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  ExamId: string;
}

const EditExam = ({ visible, onClose, ExamId }: Props) => {
  const { data: ExamData } = useGetExamById(ExamId);

  const form = useForm<IExam>({
    defaultValues: {
      name: "",
      examDate: new Date(),
      isfinalExam: false,
      classId: "",
      examSubjects: [],
    },
  });

  // Reset form with fetched data once it loads
  useEffect(() => {
    if (ExamData) {
      form.reset({
        name: ExamData.name ?? "",
        examDate: ExamData.examDate ?? new Date(),
        isfinalExam: ExamData.isfinalExam ?? false,
        classId: ExamData.classId ?? "",
        examSubjects: ExamData.examSubjects ?? [],
      });
    }
  }, [ExamData, form]);

  if (!visible) return null;

  return <EditExamForm form={form} onClose={onClose} ExamId={ExamId} />;
};

export default EditExam;