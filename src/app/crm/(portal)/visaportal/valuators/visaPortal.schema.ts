import * as yup from "yup"

export const VisaPortalSchema = yup.object({
    name: yup.string().trim().required("Name is required"),
    countryId: yup.string().required("Country is required"),
    universityId: yup.string().required("University is required"),
    url: yup.string().trim().url("Enter a valid URL").required("URL is required"),
    processingTimeInDays: yup
        .number()
        .typeError("Processing time is required")
        .integer("Processing time must be a whole number")
        .min(1, "Processing time must be at least one day")
        .required("Processing time is required"),
    note: yup.string().trim().required("Note is required"),
})
