import { useForm } from "react-hook-form";
import { IStudent } from "../types/IStudents";
import EditStudentForm from "../_components/EditStudentForm";
import { useGetStudentById } from "../hooks";
import { useEffect } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  StudentId: string;
}

const EditStudent = ({ visible, onClose, StudentId }: Props) => {
  const { data: StudentData } = useGetStudentById(StudentId);

  const form = useForm<IStudent>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      registrationNumber: "",
      genderStatus: 0,
      studentStatus: 0,
      dateOfBirth: new Date(),
      email: "",
      phoneNumber: "",
      studentImg: "",
      address: "",
      enrollmentDate: new Date(),
      parentId: "",
      classId: "",
      provinceId: 0,
      districtId: 0,
      wardNumber: 0,
      vdcid: 0,
      municipalityId: 0,
      classSectionId: "",
      feeCategoryId: "",
    },
  });

  // Reset form when StudentData changes
  useEffect(() => {
    if (StudentData) {
      form.reset({
        firstName: StudentData?.firstName ?? "",
        middleName: StudentData?.middleName ?? "",
        lastName: StudentData?.lastName ?? "",
        registrationNumber: StudentData?.registrationNumber ?? "",
        genderStatus: StudentData?.genderStatus ?? 0,
        studentStatus: StudentData?.studentStatus ?? 0,
        dateOfBirth: StudentData?.dateOfBirth ?? new Date(),
        email: StudentData?.email ?? "",
        phoneNumber: StudentData?.phoneNumber ?? "",
        studentImg: StudentData?.studentImg ?? "",
        address: StudentData?.address ?? "",
        enrollmentDate: StudentData?.enrollmentDate ?? new Date(),
        parentId: StudentData?.parentId ?? "",
        classId: StudentData?.classId ?? "",
        classSectionId: StudentData?.classSectionId ?? "",
        provinceId: StudentData?.provinceId ?? 0,
        districtId: StudentData?.districtId ?? 0,
        wardNumber: StudentData?.wardNumber ?? 0,
        vdcid: StudentData?.vdcid ?? 0,
        municipalityId: StudentData?.municipalityId ?? 0,
        feeCategoryId: StudentData?.feeCategoryId ?? "",
      });
    }
  }, [StudentData, form]);

  if (!visible) return null;

  return (
    <EditStudentForm form={form} onClose={onClose} studentId={StudentId} />
  );
};

export default EditStudent;