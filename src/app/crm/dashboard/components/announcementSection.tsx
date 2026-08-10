"use client";

import React from "react";
import { Bell, Calendar, Clock, Pin } from "lucide-react";
import { useGetAllAnnouncement } from "../hooks";
import {
  formatAnnouncementTime,
  formatTimeAgo,
} from "@/components/helpers/dateTime";

const AnnouncementsSection: React.FC = () => {
  const { data, isLoading } = useGetAllAnnouncement();

  const announcements = data?.items ?? [];

  return (
    <div className="bg-white dark:bg-[#161B27] rounded-xl border border-gray-200 dark:border-[#1E2A3E] shadow-sm flex flex-col h-[540px]">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b bg-white dark:bg-[#161B27] dark:border-[#1E2A3E] rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Announcements
          </h3>
        </div>

        <Bell className="w-5 h-5 text-blue-600" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            No announcements available.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#1E2A3E]">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-[#0D1117] transition-colors"
              >
                <div className="flex gap-3">
                  {/* Pin */}
                  <div className="mt-1">
                    {announcement.isPinned === 0 ? (
                      <Pin className="w-4 h-4 text-red-500 fill-red-500" />
                    ) : (
                      <Bell className="w-4 h-4 text-blue-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {announcement.title}
                      </h4>

                      {announcement.isPinned === 0 && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                          PINNED
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {announcement.description.replace(/<[^>]*>/g, "")}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatAnnouncementTime(announcement.createdAt)}
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatTimeAgo(announcement.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 border-t border-gray-100 dark:border-[#1E2A3E] bg-white dark:bg-[#161B27] p-4 rounded-b-xl">
        <button className="w-full rounded-lg bg-blue-50 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40">
          View All Announcements
        </button>
      </div>
    </div>
  );
};

export default AnnouncementsSection;