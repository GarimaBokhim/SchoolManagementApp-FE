import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllNotice from "./pages/All";

export default function DashboardPageEndUser() {
  return (
    <LayoutWrapper title="Notice">
      <AllNotice />
    </LayoutWrapper>
  );
}
