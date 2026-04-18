import { useForm } from 'react-hook-form'
import { IExam } from '../types/IExams'
import EditExamForm from '../components/EditExamForm'
import { useGetExamById } from '../hooks'

interface Props {
  visible: boolean
  onClose: () => void
  ExamId: string
}

const EditExam = ({ visible, onClose, ExamId }: Props) => {
  const { data: ExamData } = useGetExamById(ExamId)

  const form = useForm<IExam>({
    defaultValues: {
      name: ExamData?.name ?? '',
      examDate: ExamData?.examDate ?? new Date(),
      totalMarks: ExamData?.totalMarks ?? 0,
      passingMarks: ExamData?.passingMarks ?? 0,
      isfinalExam: ExamData?.isfinalExam ?? true,
      classId: ExamData?.classId ?? '',
      schoolId: ExamData?.schoolId ?? '',
      examSubjects: (ExamData as any)?.ExamSubjectDTOs ?? [],
    },
  })

  if (!visible) return null

  return <EditExamForm form={form} onClose={onClose} ExamId={ExamId} />
}

export default EditExam
