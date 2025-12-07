import * as Yup from "yup";

export const LedgerValidator = Yup.object().shape({
  name: Yup.string().required("Ledger name is required"),
  masterId: Yup.string().required("Master is required"),
});
