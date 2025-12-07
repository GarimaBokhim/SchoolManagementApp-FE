import * as Yup from "yup";

export const LedgerValidator = Yup.object().shape({
  name: Yup.string().required("Ledger name is required"),
  subledgerGroupId: Yup.string().required("Subledger group is required"),
});
