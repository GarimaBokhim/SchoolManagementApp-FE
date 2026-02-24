import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllAcademicsProgram from "./page/All";



export default function DashboardPageForAdmin() {
  return (
    <LayoutWrapper title="Academic Programs">
      <AllAcademicsProgram />
    </LayoutWrapper>
  );
}
