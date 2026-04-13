"use client";
import { useState, useMemo, useEffect } from "react";
import React from "react";
import { Toaster } from "react-hot-toast";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BarChart3,
  RotateCcw,
} from "lucide-react";
import { Toast } from "@/components/Toast/toast";
import Pagination from "@/components/Pagination";
import { useForm } from "react-hook-form";
import { useGetCoCurricularReport, useGetAllEvents } from "../hooks";
import {
  IActivity,
  ICoCurricularEvent,
  ActivityCategory,
  ActivityCategoryLabel,
  ActivityCategoryBadgeClass,
} from "../types/Icocurricular";
import { useGetAllClasses } from "@/app/enduser/(StudentManagement)/_Activities/hooks";
import { IClass } from "@/app/enduser/(StudentManagement)/_Activities/types/IActivities";

type SearchParam = {
  pageSize: number;
  pageIndex: number;
  isPagination: boolean;
};

type GroupedEvent = {
  eventId: string;
  activityDate: string;
  activities: IActivity[];
};

const PAGE_SIZE = 10;

const getMonthKey = (dateString: string): string => {
  const d = new Date(dateString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

const getMonthLabel = (key: string): string => {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const AllCoCurricularForm = () => {
  const { data, isLoading } = useGetCoCurricularReport();
  const { data: classes, isLoading: classesLoading } = useGetAllClasses();
  const { data: allEvents, isLoading: eventsLoading } = useGetAllEvents();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentMonthKey, setCurrentMonthKey] = useState<string>("");
  const [paginationParams, setPaginationParams] = useState({
    pageSize: PAGE_SIZE,
    pageIndex: 1,
    isPagination: true,
  });

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };
  const handleSubmit = useForm<SearchParam>({ defaultValues: {} });

  const classMap = useMemo(() => {
    const map: Record<string, string> = {};
    (classes ?? []).forEach((cls: IClass) => { map[cls.id] = cls.name; });
    return map;
  }, [classes]);

  const eventMap = useMemo(() => {
    const map: Record<string, string> = {};
    (allEvents ?? []).forEach((ev) => { map[ev.id] = ev.title; });
    return map;
  }, [allEvents]);

  const allRows = useMemo(() => {
    if (!data?.Items) return [];
    const rows: { eventId: string; activityDate: string; activity: IActivity }[] = [];
    data.Items.forEach((event: ICoCurricularEvent) => {
      event.Activities.forEach((activity) => {
        rows.push({ eventId: event.EventsId, activityDate: event.ActivityDate, activity });
      });
    });
    return rows;
  }, [data]);

  const availableMonthKeys = useMemo(() => {
    const keys = new Set<string>();
    allRows.forEach((row) => keys.add(getMonthKey(row.activityDate)));
    return Array.from(keys).sort();
  }, [allRows]);

  useEffect(() => {
    if (availableMonthKeys.length > 0 && !currentMonthKey) {
      setCurrentMonthKey(availableMonthKeys[availableMonthKeys.length - 1]);
    }
  }, [availableMonthKeys, currentMonthKey]);

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      const matchesSearch =
        searchTerm === "" ||
        row.activity.ActivityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (eventMap[row.eventId] ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        row.activity.ActivityCategory === Number(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [allRows, searchTerm, selectedCategory, eventMap]);

  const monthFilteredRows = useMemo(() => {
    if (!currentMonthKey) return filteredRows;
    return filteredRows.filter((row) => getMonthKey(row.activityDate) === currentMonthKey);
  }, [filteredRows, currentMonthKey]);

  // Group by event for rowspan — one group = one event = one S.N.
  const monthGroupedEvents = useMemo((): GroupedEvent[] => {
    const groups: GroupedEvent[] = [];
    const seen = new Map<string, number>();
    monthFilteredRows.forEach((row) => {
      if (seen.has(row.eventId)) {
        groups[seen.get(row.eventId)!].activities.push(row.activity);
      } else {
        seen.set(row.eventId, groups.length);
        groups.push({
          eventId: row.eventId,
          activityDate: row.activityDate,
          activities: [row.activity],
        });
      }
    });
    return groups;
  }, [monthFilteredRows]);

  // Paginate by event (not by activity row)
  const monthPaginatedEvents = useMemo(() => {
    const start = (paginationParams.pageIndex - 1) * paginationParams.pageSize;
    return monthGroupedEvents.slice(start, start + paginationParams.pageSize);
  }, [monthGroupedEvents, paginationParams]);

  const monthTotalPages = Math.ceil(monthGroupedEvents.length / paginationParams.pageSize);
  const snOffset = (paginationParams.pageIndex - 1) * paginationParams.pageSize;

  const monthTotalParticipants = useMemo(
    () => monthFilteredRows.reduce((sum, r) => sum + r.activity.Participants, 0),
    [monthFilteredRows]
  );

  const monthCategorySummary = useMemo(() => {
    const map: Partial<Record<ActivityCategory, number>> = {};
    monthFilteredRows.forEach((row) => {
      const cat = row.activity.ActivityCategory;
      map[cat] = (map[cat] ?? 0) + 1;
    });
    return map;
  }, [monthFilteredRows]);

  const currentMonthIndex = availableMonthKeys.indexOf(currentMonthKey);
  const goToPreviousMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthKey(availableMonthKeys[currentMonthIndex - 1]);
      setPaginationParams((p) => ({ ...p, pageIndex: 1 }));
    }
  };
  const goToNextMonth = () => {
    if (currentMonthIndex < availableMonthKeys.length - 1) {
      setCurrentMonthKey(availableMonthKeys[currentMonthIndex + 1]);
      setPaginationParams((p) => ({ ...p, pageIndex: 1 }));
    }
  };

  const onClearClick = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setPaginationParams((p) => ({ ...p, pageIndex: 1 }));
  };

  const getCategoryBadgeClass = (category: ActivityCategory) =>
    ActivityCategoryBadgeClass[category] ?? "bg-gray-100 text-gray-700";
  const getCategoryLabel = (category: ActivityCategory) =>
    ActivityCategoryLabel[category] ?? "Unknown";

  const handleExport = () => {
    if (monthFilteredRows.length === 0) return;
    const csvData = monthFilteredRows.map((row, index) => ({
      "S.N.": index + 1,
      "Event Name": eventMap[row.eventId] ?? row.eventId,
      "Activity Name": row.activity.ActivityName,
      Category: getCategoryLabel(row.activity.ActivityCategory),
      Date: new Date(row.activityDate).toLocaleDateString("en-US"),
      Participants: row.activity.Participants,
      Classes:
        row.activity.ClassIds?.length > 0
          ? row.activity.ClassIds.map((id) => classMap[id] ?? id).join(", ")
          : "All Classes",
    }));
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((h) => JSON.stringify(row[h as keyof typeof row] || "")).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity_report_${currentMonthKey}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Toast.success("Report exported successfully");
  };

  const currentMonthLabel = currentMonthKey ? getMonthLabel(currentMonthKey) : "—";
  const isPageLoading = isLoading || eventsLoading;

  return (
    <>
      <Toaster position="top-right" />
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Calendar className="w-4 h-4" />
              <span>{currentMonthLabel}</span>
            </button>
            <div className="flex gap-2">
              <button
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={goToPreviousMonth}
                disabled={currentMonthIndex <= 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={goToNextMonth}
                disabled={currentMonthIndex >= availableMonthKeys.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities or events..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPaginationParams((p) => ({ ...p, pageIndex: 1 }));
                }}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPaginationParams((p) => ({ ...p, pageIndex: 1 }));
              }}
            >
              <option value="all">All Categories</option>
              {Object.entries(ActivityCategoryLabel).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClearClick}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Total Activities</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{monthFilteredRows.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <p className="text-xs text-green-500 font-medium uppercase tracking-wide">Total Participants</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{monthTotalParticipants}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="text-xs text-purple-500 font-medium uppercase tracking-wide">Total Events</p>
            {/* Uses monthGroupedEvents.length so it counts actual events, not activity rows */}
            <p className="text-2xl font-bold text-purple-700 mt-1">{monthGroupedEvents.length}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <p className="text-xs text-orange-500 font-medium uppercase tracking-wide">Categories Active</p>
            <p className="text-2xl font-bold text-orange-700 mt-1">{Object.keys(monthCategorySummary).length}</p>
          </div>
        </div>

        {/* Table */}
        {isPageLoading ? (
          <div className="text-center text-gray-500 py-10">Loading Activities...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-700 w-12">S.N.</th>
                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">Event Name</th>
                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">Activity Name</th>
                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">Category</th>
                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">Date</th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-gray-700">Participants</th>
                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">Classes</th>
                  </tr>
                </thead>
                <tbody>
                  {monthPaginatedEvents.length > 0 ? (
                    monthPaginatedEvents.map((group, groupIndex) => {
                      const eventTitle = eventMap[group.eventId] ?? null;
                      const rowSpan = group.activities.length;
                      const formattedDate = new Date(group.activityDate).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      });

                      return group.activities.map((activity, actIndex) => (
                        <tr
                          key={`${group.eventId}-${actIndex}`}
                          className="hover:bg-gray-50 transition"
                        >
                          {/* S.N. — rowspan across all activities of this event */}
                          {actIndex === 0 && (
                            <td rowSpan={rowSpan} className="border border-gray-300 p-3 text-center text-sm align-middle font-medium bg-gray-50">
                              {snOffset + groupIndex + 1}
                            </td>
                          )}

                          {/* Event Name — rowspan */}
                          {actIndex === 0 && (
                            <td rowSpan={rowSpan} className="border border-gray-300 p-3 align-middle bg-gray-50">
                              {eventTitle ? (
                                <span className="font-semibold text-gray-800 text-sm">{eventTitle}</span>
                              ) : (
                                <span className="text-gray-400 italic text-xs">Unknown Event</span>
                              )}
                            </td>
                          )}

                          {/* Activity Name */}
                          <td className="border border-gray-300 p-3 text-sm">
                            {activity.ActivityName}
                          </td>

                          {/* Category */}
                          <td className="border border-gray-300 p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(activity.ActivityCategory)}`}>
                              {getCategoryLabel(activity.ActivityCategory)}
                            </span>
                          </td>

                          {/* Date — rowspan */}
                          {actIndex === 0 && (
                            <td rowSpan={rowSpan} className="border border-gray-300 p-3 text-sm align-middle bg-gray-50">
                              {formattedDate}
                            </td>
                          )}

                          {/* Participants */}
                          <td className="border border-gray-300 p-3 text-center font-semibold text-sm">
                            {activity.Participants}
                          </td>

                          {/* Classes */}
                          <td className="border border-gray-300 p-3 text-sm">
                            {classesLoading ? (
                              <span className="text-gray-400 italic">Loading...</span>
                            ) : activity.ClassIds?.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {activity.ClassIds.map((id) => (
                                  <span key={id} className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                    {classMap[id] ?? id}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic text-xs">All Classes</span>
                            )}
                          </td>
                        </tr>
                      ));
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="border border-gray-300 p-3 text-center text-gray-500 italic">
                        No activities found for {currentMonthLabel}.
                      </td>
                    </tr>
                  )}
                </tbody>
                {monthFilteredRows.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={5} className="border border-gray-300 p-3 text-right">Total Participants:</td>
                      <td className="border border-gray-300 p-3 text-center text-blue-700">{monthTotalParticipants}</td>
                      <td className="border border-gray-300 p-3" />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Category Breakdown */}
            {Object.keys(monthCategorySummary).length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Category Breakdown ({currentMonthLabel})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(monthCategorySummary).map(([catVal, count]) => {
                    const cat = Number(catVal) as ActivityCategory;
                    return (
                      <div key={catVal} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(cat)}`}>
                        <span>{getCategoryLabel(cat)}</span>
                        <span className="font-bold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pagination */}
            {monthGroupedEvents.length > 0 && (
              <div className="mt-6">
                <Pagination
                  form={handleSubmit}
                  pagination={{
                    currentPage: paginationParams.pageIndex,
                    firstPage: 1,
                    lastPage: monthTotalPages,
                    nextPage: Math.min(paginationParams.pageIndex + 1, monthTotalPages),
                    previousPage: Math.max(paginationParams.pageIndex - 1, 1),
                  }}
                  handleSearch={handleSearch}
                />
              </div>
            )}
          </>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t flex flex-wrap justify-center gap-6 text-sm">
          {Object.entries(ActivityCategoryLabel).map(([val, label]) => {
            const cat = Number(val) as ActivityCategory;
            const bgColor = getCategoryBadgeClass(cat).split(" ")[0];
            return (
              <div key={val} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${bgColor} border border-gray-300 rounded`} />
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AllCoCurricularForm;