import * as Yup from "yup";

export const StudentValidator = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  registrationNumber: Yup.string().required("Registration Number is required"),
  genderStatus: Yup.number().required("Gender is required"),
  studentStatus: Yup.number().required("Student Status is required"),
  dateOfBirth: Yup.date().required("Date of Birth is required"),
  enrollmentDate: Yup.date().required("Enrollment Date is required"),
  email: Yup.string().required("Email is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  imageUrl: Yup.string().required("Image is required"),
  address: Yup.string().required("Address is required"),
  parentId: Yup.string().required("Parent is required"),
  provinceId: Yup.number().required("Province is required"),
  districtId: Yup.number().required("District is required"),
  wardNumber: Yup.number().nullable().notRequired(),
  middleName: Yup.string().nullable().notRequired(),
  classSectionId: Yup.string().nullable().notRequired(),
});
export type StudentFormValues = Yup.InferType<typeof StudentValidator>;
