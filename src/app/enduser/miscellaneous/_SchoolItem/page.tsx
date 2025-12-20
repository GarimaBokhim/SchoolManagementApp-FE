import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllStudent from "../../(StudentManagement)/Student/pages/All";

export default function DashboardPageEndUser() {
  return (
    <LayoutWrapper title="Student">
      <AllStudent />
    </LayoutWrapper>
  );
}
