import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllContributor from "./_Contributor/pages/All";

export default function DashboardPageEndUser() {
  return (
    <LayoutWrapper title="Miscellaneous">
      <AllContributor />
    </LayoutWrapper>
  );
}
