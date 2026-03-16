import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllApplications from "../pages/AllApplications";


export default function DashboardPageForAdmin() {
  return (
    <LayoutWrapper title="Applicants">
      <AllApplications />
    </LayoutWrapper>
  );
}
