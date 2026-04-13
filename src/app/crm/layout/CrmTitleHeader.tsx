"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BellDot } from "lucide-react";
import ThemeToggle from "@/context/Theme/ToggleTheme";

type Props = {
  title: string;
  primaryColor?: string;
};

const CrmTitleHeader = ({ title }: Props) => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const [openNotification, setOpenNotification] = useState(false);
  
  const toggleNotificationVisibility = () => {
    setOpenNotification(!openNotification);
  };
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      {/* Updated header: Removed gradient, used plain bg-white and dark:bg-gray-950 */}
      <header className="py-4 px-8 font-bold bg-white dark:bg-[#0f0f0f] text-lg flex justify-between border-b border-gray-200 dark:border-gray-800 shadow-sm">
        
        {/* Left side - Title & Breadcrumb */}
        <div>
          {/* Updated Title: Black in light mode, White in dark mode */}
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {title}
          </h1>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
            {pathParts.map((part, index) => {
              const partialPath = "/" + pathParts.slice(0, index + 1).join("/");

              if (index === pathParts.length - 2) {
                return null;
              }

              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              if (uuidRegex.test(part)) {
                return null;
              }

              return (
                <Link href={partialPath} key={index + 1}>
                  <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize">
                    {index === 0 ? "" : " / "}
                    {part.replace(/-/g, ' ')}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side - Actions (Restored) */}
        <div className="flex justify-end gap-3 items-center">
          <button
            onClick={toggleNotificationVisibility}
            type="button"
            className="p-2.5 rounded-full bg-gray-100 dark:bg-[#d5d5d52d] hover:bg-gray-200 dark:hover:bg-[#d5d5d540] transition-colors relative"
          >
            <BellDot
              size={20}
              className="text-gray-700 dark:text-white"
            />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Notification Dropdown (Restored) */}
      {openNotification && (
        <div
          ref={dropdownRef}
          className="absolute top-[4.5rem] right-[1rem] sm:right-[5rem]
          min-w-[250px] sm:min-w-[300px] w-auto max-w-[420px] h-[28rem]
          bg-white border border-gray-200 rounded-md shadow-xl z-50
          dark:bg-[#0f0f0f] dark:border-[#272727] dark:text-white
          animate-fade-in overflow-y-auto"
        >
          <div className="sticky top-0 bg-white dark:bg-[#0f0f0f] px-4 py-3 border-b border-gray-200 dark:border-[#272727] flex justify-between items-center">
            <h2 className="text-base font-semibold">Notifications</h2>
            <button 
              onClick={toggleNotificationVisibility}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <ul className="divide-y divide-gray-100 dark:divide-[#1e1e1e]">
            {[
              { icon: "📋", title: "New Lead", desc: "New lead from ABC Corp", time: "2 min ago" },
              { icon: "✓", title: "Task Done", desc: "Follow-up call completed", time: "1 hour ago" },
              { icon: "📊", title: "Report Ready", desc: "Monthly report is ready", time: "3 hours ago" },
            ].map((n, i) => (
              <li key={i} className="flex gap-3 items-start px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1c1c1c] transition">
                <div className="text-xl">{n.icon}</div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium leading-tight">{n.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug mt-1">{n.desc}</p>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 block">{n.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default CrmTitleHeader;