import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import Dashboard from "./dashboard/components/card";

export default function DashboardPageForAdmin() {
  return (
    <LayoutWrapper title="Dashboard">
      <Dashboard />
    </LayoutWrapper>
  );
}
