import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllIssuedCertificate from "./pages/All";

export default function DashboardPageEndUser() {
  return (
    <LayoutWrapper title="Issued Certificate">
      <AllIssuedCertificate />
    </LayoutWrapper>
  );
}
