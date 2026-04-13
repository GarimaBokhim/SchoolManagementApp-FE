import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllApplications from "../pages/AllApplications";
import CrmLayoutWrapper from "../../layout/crmLayoutWrapper";


export default function DashboardPageForAdmin() {
  return (
    <CrmLayoutWrapper title="Applicants">
      <AllApplications />
    </CrmLayoutWrapper>
  );
}
