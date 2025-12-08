import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllTrialBalanceForm from "./components/AllTrialBalance";

export default function LedgerModule() {
  return (
    <LayoutWrapper title="Trial Balance">
      <AllTrialBalanceForm />
    </LayoutWrapper>
  );
}
