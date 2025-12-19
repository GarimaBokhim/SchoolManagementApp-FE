import * as Yup from "yup";

export const ParentValidator = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  parentType: Yup.number().required("Parent Type is required"),
  email: Yup.string().required("Email is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  imageUrl: Yup.string().required("Img is required"),
  address: Yup.string().required("Address is required"),
});
