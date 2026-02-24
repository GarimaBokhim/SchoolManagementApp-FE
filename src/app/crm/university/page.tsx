import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllAcademicPrograms from "./pages/all";

export default function DashboardPageForAdmin() {
  return (
    <LayoutWrapper title="Academic Programs">
      <AllAcademicPrograms />
    </LayoutWrapper>
  );
}
