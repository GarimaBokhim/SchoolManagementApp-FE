import * as Yup from "yup";

export const JournalValidator = Yup.object().shape({
  transactionDate: Yup.string().required("Transaction date is required"),
  description: Yup.string().required("description is required"),
});
