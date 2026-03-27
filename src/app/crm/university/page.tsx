import CrmLayoutWrapper from "../layout/crmLayoutWrapper";
import AllAcademicsProgram from "./page/All";

export default function DashboardPageForAdmin() {
  return (
    <CrmLayoutWrapper title="Academic Programs">
      <AllAcademicsProgram />
    </CrmLayoutWrapper>
  );
}
