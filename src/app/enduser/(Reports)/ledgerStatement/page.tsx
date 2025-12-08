import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllLedgerStatementForm from "./components/AllLedgerStatement";

export default function LedgerModule() {
  return (
    <LayoutWrapper title="Ledger Statement">
      <AllLedgerStatementForm />
    </LayoutWrapper>
  );
}
