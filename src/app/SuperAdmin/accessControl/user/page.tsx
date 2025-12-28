import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import { AllUsers } from "./pages/All";

const UserPage = () => {
  return (
    <div>
      <LayoutWrapper title="User">
        <AllUsers />
      </LayoutWrapper>
    </div>
  );
};
export default UserPage;
