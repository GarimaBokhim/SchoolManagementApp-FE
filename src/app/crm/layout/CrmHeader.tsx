"use client";

import { useSidebar } from "@/context/SidebarContext";
import SidebarToggle from "@/components/Sidebar/SidebarToggle";

export default function CrmHeader({ primaryColor = "#0A53C3" }: { primaryColor?: string }) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex items-center justify-between w-full">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {isOpen && (
          <span 
            // text-black sets it for light mode
            // dark:text-white sets it for dark mode
            className="font-bold text-lg text-black dark:text-white"
          >
            Elite Space
          </span>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* ☰ Sidebar Toggle */}
        <SidebarToggle />
      </div>
    </div>
  );
}