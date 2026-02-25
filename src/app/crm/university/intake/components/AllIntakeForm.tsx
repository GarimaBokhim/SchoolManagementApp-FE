"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Search,
  MapPin,
  ChevronDown,
  Filter,
  RotateCcw,
  Building2,
  Clock,
} from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import { api } from "@/utils/instance"; // adjust path to your api helper
import { useGetAllUniversities } from "@/app/crm/university/univer-sity/hooks"; // adjust path

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface IntakeItem {
  id: string;
  month: number;
  deadline: string;
  isOpen: boolean;
  courseId: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface ApiResponse {
  Items: IntakeItem[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

interface FilterFormData {
  month: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string): string => {
  if (!dateStr || dateStr.startsWith("0001")) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getMonthName = (month: number): string =>
  MONTH_OPTIONS.find((m) => m.value === month)?.label ?? `Month ${month}`;

// ─── Component ────────────────────────────────────────────────────────────────

const AllIntakeForm = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [intakes, setIntakes] = useState<IntakeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FilterFormData>({
    defaultValues: { month: "" },
  });

  // ── Universities (for name lookup via schoolId) ─────────────────────────────
  const { data: universitiesData } = useGetAllUniversities();
  const universities = universitiesData?.Items ?? [];

  const getUniversityName = (schoolId: string): string => {
    const match = universities.find((u) => u.schoolId === schoolId);
    return match?.name ?? "Unknown University";
  };

  // ── API call ────────────────────────────────────────────────────────────────

  const fetchIntakes = async (month?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, unknown> = {};
      if (month) params.month = month;

      const response = await api.get<ApiResponse>(
        "api/AcademicPrograms/FilterIntake",
        { params }
      );

      setIntakes(response.data?.Items ?? []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? err?.message ?? "Something went wrong."
      );
      setIntakes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all intakes on mount
  useEffect(() => {
    fetchIntakes();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const onFilterSubmit = (data: FilterFormData) => {
    const monthNum = data.month ? parseInt(data.month) : undefined;
    fetchIntakes(monthNum);
  };

  const handleClearFilters = () => {
    form.reset({ month: "" });
    fetchIntakes();
  };

  const handleViewDetails = (intakeId: string) => {
    // TODO: Implement view details
  };

  const handleApplyNow = (intakeId: string) => {
    // TODO: Implement apply
  };

  // ── Styling helpers ─────────────────────────────────────────────────────────

  const getStatusBadge = (isOpen: boolean) =>
    isOpen
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#1f1f22] border border-gray-300 
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 
    dark:text-white text-sm appearance-none`;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
          <div className="flex items-center space-x-3">
            <ButtonElement
              type="button"
              text="Filter"
              icon={<Filter size={14} />}
              onClick={() => setOpenFilter(!openFilter)}
              className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold"
            />
          </div>
        </div>

        {/* Filter Panel */}
        {openFilter && (
          <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <form
              onSubmit={form.handleSubmit(onFilterSubmit)}
              className="flex flex-wrap items-end gap-4 md:gap-6"
            >
              {/* Intake Month Dropdown */}
              <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Intake Month
                </label>
                <div className="relative">
                  <select {...form.register("month")} className={inputClass}>
                    <option value="">All Months</option>
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <CalendarDays
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 ml-auto">
                <ButtonElement
                  type="submit"
                  text="Filter"
                  icon={<Filter size={14} />}
                  className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150 !text-white"
                />
                <ButtonElement
                  type="button"
                  text="Clear"
                  icon={<RotateCcw size={14} />}
                  onClick={handleClearFilters}
                  className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150 !text-white"
                />
              </div>
            </form>
          </div>
        )}

        {/* Results count */}
        <div className="px-4 pb-3 text-sm text-gray-500 dark:text-gray-400">
          {isLoading
            ? "Loading intakes..."
            : `Showing ${intakes.length} ${intakes.length === 1 ? "intake" : "intakes"}`}
        </div>

        {/* Error state */}
        {error && (
          <div className="mx-4 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Cards Grid */}
        <div className="px-4 pb-4">
          {isLoading ? (
            /* Skeleton loader — matches card shape */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : intakes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {intakes.map((intake) => (
                <div
                  key={intake.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Title row */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <CalendarDays
                          size={18}
                          className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                        />
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {getMonthName(intake.month)} Intake
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 whitespace-nowrap ${getStatusBadge(intake.isOpen)}`}
                      >
                        {intake.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>

                    {/* University Name */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
                        <Building2
                          size={16}
                          className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                        />
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 line-clamp-1">
                          {getUniversityName(intake.schoolId)}
                        </p>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock size={14} className="text-gray-400" />
                        <span>Intake: {getMonthName(intake.month)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <CalendarDays size={14} className="text-gray-400" />
                        <span>Deadline: {formatDate(intake.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <MapPin size={14} className="text-gray-400" />
                        <span>Added: {formatDate(intake.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4">
                      <ButtonElement
                        icon={<Search size={14} />}
                        text="View Details"
                        onClick={() => handleViewDetails(intake.id)}
                        className="flex-1 !bg-blue-500 hover:!bg-blue-600 !text-white !text-xs !py-2"
                      />
                      <ButtonElement
                        icon={<CalendarDays size={14} />}
                        text="Apply Now"
                        onClick={() => handleApplyNow(intake.id)}
                        className="flex-1 !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-xs !py-2"
                        disabled={!intake.isOpen}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <CalendarDays size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No intakes found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search or filter criteria.
              </p>
              <ButtonElement
                type="button"
                text="Clear Filters"
                onClick={handleClearFilters}
                className="mt-6 !bg-emerald-600 hover:!bg-emerald-700 !text-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllIntakeForm;