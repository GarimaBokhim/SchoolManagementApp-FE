
import LayoutWrapper from "@/components/Sidebar/ClientWrapper"
import AllHouseHoldsDetails from "./pages/CommonPages"
import AllWaterPaymentsDetails from "./pages/CommonPages"

export default function WaterPaymentsPage() {
    return (
        <LayoutWrapper title="Water Payments">
            <AllWaterPaymentsDetails />
        </LayoutWrapper>
    )
}
