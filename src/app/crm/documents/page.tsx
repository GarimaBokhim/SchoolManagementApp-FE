import AllDocuments from "./pages/AllDocuments";
import CrmLayoutWrapper from "../layout/crmLayoutWrapper";


export default function DocumentsPage() {
  return (
    <CrmLayoutWrapper title="Documents">
      <AllDocuments />
    </CrmLayoutWrapper>
  );
}
