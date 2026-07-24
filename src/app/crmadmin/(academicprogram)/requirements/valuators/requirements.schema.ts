import * as yup from "yup";

export const RequirementsSchema = yup.object({
    title: yup.string().required("Title is required"),
    descriptions: yup.string().required("Description is required"),
    universityId: yup.string().required("University is required"),
    countryId: yup.string().required("Country is required"),
    courseId: yup.string().required("Course is required"),

    documentsCheckListDTOs: yup.array().of(
        yup.object({
            documenteTypeId: yup.string().required("Required"),
        })
    )
    .default([]) 
    .required(),
});