import { useForm } from "react-hook-form";
import { IStudent } from "../types/IStudents";
import EditStudentForm from "../components/EditStudentForm";
import { useGetStudentById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  StudentId: string;
}

const EditStudent = ({ visible, onClose, StudentId }: Props) => {
  const { data: StudentData } = useGetStudentById(StudentId);

  const form = useForm<IStudent>({
    defaultValues: {
      firstName: StudentData?.firstName ?? "",
      middleName: StudentData?.middleName ?? "",
      lastName: StudentData?.lastName ?? "",
      registrationNumber: StudentData?.registrationNumber ?? "",
      genderStatus: StudentData?.genderStatus ?? 0,
      studentStatus: StudentData?.studentStatus ?? 0,
      dateOfBirth: StudentData?.dateOfBirth ?? new Date(),
      email: StudentData?.email ?? "",
      phoneNumber: StudentData?.phoneNumber ?? "",
      imageUrl: StudentData?.imageUrl ?? "",
      address: StudentData?.address ?? "",
      enrollmentDate: StudentData?.enrollmentDate ?? new Date(),
      parentId: StudentData?.parentId ?? "",
      classSectionId: null,
      provinceId: StudentData?.provinceId ?? 0,
      districtId: StudentData?.districtId ?? 0,
      wardNumber: StudentData?.wardNumber ?? 0,
    },
  });

  if (!visible) return null;

  return (
    <EditStudentForm form={form} onClose={onClose} studentId={StudentId} />
  );
};

export default EditStudent;
