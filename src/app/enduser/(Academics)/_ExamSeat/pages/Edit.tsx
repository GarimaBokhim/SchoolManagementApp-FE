import { useForm } from "react-hook-form";
import { IExamSeat } from "../types/IExamSeat";
import EditExamSeatForm from "../components/EditExamSeatForm";
import { useGetExamSeatById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  ExamSeatId: string;
}

const EditExamSeat = ({ visible, onClose, ExamSeatId }: Props) => {
  const { data: ExamSeatData } = useGetExamSeatById(ExamSeatId);

  const form = useForm<IExamSeat>({
    defaultValues: {
      examId: ExamSeatData?.examId ?? "",
      studentId: ExamSeatData?.studentId ?? "",
      remarks: ExamSeatData?.remarks ?? "",
    },
  });

  if (!visible) return null;

  return (
    <EditExamSeatForm form={form} onClose={onClose} ExamSeatId={ExamSeatId} />
  );
};

export default EditExamSeat;
