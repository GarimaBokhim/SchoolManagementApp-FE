import AllServices from "./pages/AllServices";
import CrmLayoutWrapper from "../layout/crmLayoutWrapper";

export default function DashboardPageForAdmin() {
  return (
    <CrmLayoutWrapper title="Services">
      <AllServices />
    </CrmLayoutWrapper>
  );
}