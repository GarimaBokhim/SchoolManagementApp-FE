import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllJournalForm from "./components/AllJournal";

export default function LedgerModule() {
  return (
    <LayoutWrapper title="Journal">
      <AllJournalForm />
    </LayoutWrapper>
  );
}
