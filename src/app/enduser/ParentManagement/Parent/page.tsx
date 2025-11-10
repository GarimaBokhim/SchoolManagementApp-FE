import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllStudent from "./pages/All";

export default function DashboardPageEndUser() {
  return (
    <LayoutWrapper title="Parent">
      <AllStudent />
    </LayoutWrapper>
  );
}
