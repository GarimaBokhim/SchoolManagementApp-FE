// @/components/Sidebar/CrmLayoutWrapper.tsx

import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import { ReactNode } from "react";
import CrmHeader from "./CrmHeader";
import CrmTitleHeader from "./CrmTitleHeader";

export default function CrmLayoutWrapper({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const primaryColor = "#0A53C3";
  
  return (
    <LayoutWrapper
      title={title}
      primaryColor={primaryColor}
      activeBg="#EBF1FB"
      activeSubBg="#dbeafe"
      sidebarContainerClassName="dark:bg-[#161B27]"
      headerContent={<CrmHeader primaryColor={primaryColor} />}
      headerClassName="bg-white dark:bg-[#161B27] border-b border-gray-200 dark:border-gray-700"
      customTitleHeader={<CrmTitleHeader title={title} primaryColor={primaryColor} />}
    >
      {children}
    </LayoutWrapper>
  );
}