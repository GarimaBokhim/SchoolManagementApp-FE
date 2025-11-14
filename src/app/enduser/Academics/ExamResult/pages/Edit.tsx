import { useForm } from "react-hook-form";
import { IExamResult } from "../types/IExamResults";
import EditExamResultForm from "../components/EditExamResultForm";
import { useGetExamResultById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  ExamResultId: string;
}

const EditExamResult = ({ visible, onClose, ExamResultId }: Props) => {
  const { data: ExamResultData } = useGetExamResultById(ExamResultId);

  const form = useForm<IExamResult>({
    defaultValues: {
      examId: ExamResultData?.examId ?? "",
      studentId: ExamResultData?.studentId ?? "",
      subjectId: ExamResultData?.subjectId ?? "",
      marksObtained: ExamResultData?.marksObtained ?? 0,
      grade: ExamResultData?.grade ?? "",
      remarks: ExamResultData?.remarks ?? "",
      isActive: ExamResultData?.isActive ?? true,
      schoolId: ExamResultData?.examId ?? "",
    },
  });

  if (!visible) return null;

  return (
    <EditExamResultForm
      form={form}
      onClose={onClose}
      ExamResultId={ExamResultId}
    />
  );
};

export default EditExamResult;
