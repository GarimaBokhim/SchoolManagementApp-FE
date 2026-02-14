import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import Students from "./student/components/allstudents";
import AllStudent from "./student/page/Allstudentpage";


export default function DashboardPageForAdmin() {
  return (
    <LayoutWrapper title="Applicants">
      <AllStudent />
    </LayoutWrapper>
  );
}
