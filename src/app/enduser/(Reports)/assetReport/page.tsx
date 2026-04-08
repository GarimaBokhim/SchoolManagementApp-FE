import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllContributor from "../../miscellaneous/_Contributor/pages/All";
import AllAssetsReportByFiscalYear from "../../miscellaneous/_Assetsreport/_components/Allassetsreport";

export default function DashboardPageEndUser() {
  return (
    <LayoutWrapper title="Miscellaneous">
      <AllAssetsReportByFiscalYear />
    </LayoutWrapper>
  );
}
