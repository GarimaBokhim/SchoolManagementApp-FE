import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllAwards from "./schoolAward/pages/All";


export default function DashboardPageEndUser() {
  return (
    <LayoutWrapper title="Notice">
      <AllAwards />
    </LayoutWrapper>
  );
}