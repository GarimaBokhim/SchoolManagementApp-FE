import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllAttendance from "./pages/All";

export default function AttendancePage() {
  return (
    <LayoutWrapper title="Attendance Report">
      <AllAttendance />
    </LayoutWrapper>
  );
}