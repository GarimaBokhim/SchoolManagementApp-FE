import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import Allvisitors from "./page/All";



export default function DashboardPageForAdmin() {
  return (
    <LayoutWrapper title="Visitors">
        <Allvisitors/>
    </LayoutWrapper>
  );
}
