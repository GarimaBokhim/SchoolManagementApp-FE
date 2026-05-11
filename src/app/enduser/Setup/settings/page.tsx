import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import SettingsPage from "./SettingsPage";


export default function DashboardPageEndUser() {
    return (
        <LayoutWrapper title="Settings">
            <SettingsPage />
        </LayoutWrapper>
    );
}
