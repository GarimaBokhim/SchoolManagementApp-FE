"use client";

import { useSidebar } from "@/context/SidebarContext";
import Sidebar from "./Sidebar";
import SidebarToggle from "./SidebarToggle";
import { ReactNode, useEffect, useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import useRoleWiseSidebarMenu from "@/app/SuperAdmin/navigation/hooks/useRoleWiseSidebarMenu";
import TitleHeader from "../TitleHeader";
import SuperAdminSidebar from "@/tempdata/SuperAdminNavItems.json";

export default function LayoutWrapper({
  children,
  title,
  sidebarClassName,
  sidebarStyle,
  mainClassName,
  mainStyle,
  headerClassName,
  headerStyle,
  primaryColor,
  activeBg,
  activeSubBg,
  sidebarContainerClassName,
  sidebarContainerStyle,
  headerContent,
  customTitleHeader,
}: {
  children: ReactNode;
  title: string;
  sidebarClassName?: string;
  sidebarStyle?: CSSProperties;
  mainClassName?: string;
  mainStyle?: CSSProperties;
  headerClassName?: string;
  headerStyle?: CSSProperties;
  primaryColor?: string;
  activeBg?: string;
  activeSubBg?: string;
  sidebarContainerClassName?: string;
  sidebarContainerStyle?: CSSProperties;
  headerContent?: ReactNode;
  customTitleHeader?: ReactNode;
}) {
  const { isOpen } = useSidebar();
  const sidebarWidth = isOpen ? "w-64" : "w-16";

  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<string | null>(null);

  const navigate = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedId = localStorage.getItem("userId");
    const userDetailsString = localStorage.getItem("userDetails");

    if (storedId) setUserId(storedId);

    if (userDetailsString) {
      try {
        const parsed = JSON.parse(userDetailsString);
        setRole(parsed.role || null);
      } catch (e) {
        console.error("Failed to parse userDetails", e);
      }
    }

    const token = localStorage.getItem("token");
    if (!token) navigate.push("/");
  }, [navigate]);

  const { data: sideBarMenu } = useRoleWiseSidebarMenu(userId);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`${sidebarWidth} border-r border-border flex flex-col transition-all duration-300 ${sidebarClassName ?? ""}`}
        style={sidebarStyle}
      >
        {/* Top Header */}
        <div
          className={`flex items-center justify-between p-1.5 py-[1.2rem] border-b px-5 
          bg-background text-text ${headerClassName ?? ""}`}
          style={headerStyle}
        >
          {headerContent ? (
            headerContent
          ) : (
            <>
              {isOpen && (
                <span className="font-bold text-lg flex items-center gap-2">
                  Elite Space
                </span>
              )}
              <SidebarToggle />
            </>
          )}
        </div>

        {/* Sidebar Menu */}
        <Sidebar
          sideBarItems={
            role === "superadmin"
              ? SuperAdminSidebar
              : { module: Array.isArray(sideBarMenu) ? sideBarMenu : [] }
          }
          primaryColor={primaryColor}
          activeBg={activeBg}
          activeSubBg={activeSubBg}
          containerClassName={sidebarContainerClassName}
          containerStyle={sidebarContainerStyle}
        />
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${mainClassName ?? ""}`}
        style={mainStyle}
      >
        {customTitleHeader ? customTitleHeader : <TitleHeader title={title} />}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}