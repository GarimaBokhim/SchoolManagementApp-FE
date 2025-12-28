import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllFeeType from "./_FeeType/pages/All";

export default function DashboardPageEndUser() {
  return (
    <LayoutWrapper title="School Fee">
      <AllFeeType />
    </LayoutWrapper>
  );
}
