// announcements_section.tsx - New component for Announcements
"use client";
import React from "react";
import { Bell, Calendar, Clock, Pin } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  message: string;
  time: string;
  timeAgo: string;
  isPinned?: boolean;
  color: string;
}

const AnnouncementsSection: React.FC = () => {
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "Team Meeting",
      message: "today meeting at 5pm sharp",
      time: "Today, 5:00 PM",
      timeAgo: "2 months ago",
      isPinned: true,
      color: "#0A53C3",
    },
    {
      id: 2,
      title: "Meeting Organization",
      message: "please organize meeting today",
      time: "Today",
      timeAgo: "3 months ago",
      isPinned: false,
      color: "#8B5CF6",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#161B27] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E2A3E] transition-colors duration-300">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-[#1E2A3E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: "#0A53C3" }}
            />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Announcements
            </h3>
          </div>
          <Bell className="h-4 w-4" style={{ color: "#0A53C3" }} />
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-[#1E2A3E]">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="p-5 hover:bg-gray-50 dark:hover:bg-[#0D1117]/40 transition-colors duration-150"
          >
            {/* Announcement Header */}
            <div className="flex items-start gap-3 mb-2">
              {announcement.isPinned && (
                <Pin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {announcement.title}
                  </h4>
                  {announcement.isPinned && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                      Pinned
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {announcement.message}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {announcement.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {announcement.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with View All */}
      <div className="p-4 border-t border-gray-100 dark:border-[#1E2A3E]">
        <button
          className="w-full text-center text-xs font-medium py-1.5 rounded-lg transition-all duration-150 hover:scale-[1.02]"
          style={{ color: "#0A53C3", backgroundColor: "#EBF1FB" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C2D5F5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EBF1FB")}
        >
          View All Announcements →
        </button>
      </div>
    </div>
  );
};

export default AnnouncementsSection;