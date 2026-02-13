import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import Students from "./components/students";


export default function DashboardPageForAdmin() {
  return (
    <LayoutWrapper title="Applicants">
      <Students />
    </LayoutWrapper>
  );
}
