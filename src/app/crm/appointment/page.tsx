import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllServices from "./pages/AllServices";

export default function DashboardPageForAdmin() {
  return (
    <LayoutWrapper title="Services">
      <AllServices />
    </LayoutWrapper>
  );
}