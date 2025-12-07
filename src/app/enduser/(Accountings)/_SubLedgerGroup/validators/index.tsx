import * as Yup from "yup";

export const SubLedgerGroupValidator = Yup.object().shape({
  name: Yup.string().required("Ledger name is required"),
  ledgerGroupId: Yup.string().required("ledgerGroup group is required"),
});
