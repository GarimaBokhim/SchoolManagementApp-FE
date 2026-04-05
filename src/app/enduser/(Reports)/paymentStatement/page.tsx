"use client";

import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import PaymentDetailReportForm from "./components/PaymentDetailReport";
export default function PaymentReports() {
  return (
    <LayoutWrapper title="Payment Reports">
      <PaymentDetailReportForm />
    </LayoutWrapper>
  );
}