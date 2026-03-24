import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import AllDocuments from "./pages/AllDocuments";


export default function DocumentsPage() {
  return (
    <LayoutWrapper title="Documents">
      <AllDocuments />
    </LayoutWrapper>
  );
}
