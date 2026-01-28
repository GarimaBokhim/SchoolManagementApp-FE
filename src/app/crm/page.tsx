import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import Dashboard from "./dashboard/dashboard";

export default function DashboardPageForAdmin() {
  return (
    <LayoutWrapper title="Dashboard">
      <Dashboard />
    </LayoutWrapper>
  );
}
