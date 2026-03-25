"use client";

import { useRef, useState } from "react";
import {
  CalendarDays,
  Search,
  MapPin,
  Filter,
  RotateCcw,
  Building2,
  Clock,
  Plus,
} from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import { useGetAllUniversities } from "@/app/crm/university/_university/hooks";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddIntakeModal from "../pages/Add";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import useIntakes from "../hooks/UseIntakes";


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

interface FilterFormData {
  startDate: string;
  endDate: string;
}

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

const AllIntakeForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);

  const [openFilter, setOpenFilter] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [params, setParams] = useState("");
  const formRef = useRef<DateRangeFilterRef>(null);

  const form = useForm<FilterFormData>({
    defaultValues: { startDate: "", endDate: "" },
  });


  const { intakes, isLoading, error, fetchIntakes, clearError } = useIntakes();

  const { handleError } = useErrorHandler();

  const { data: universitiesData } = useGetAllUniversities();
  const universities = universitiesData?.Items ?? [];

  const getUniversityName = (schoolId: string): string => {
    const match = universities.find((u) => u.schoolId === schoolId);
    return match?.name ?? "Unknown University";
  };

  const onFilterSubmit = async (formData: FilterFormData) => {
    clearError();
    try {
      const queryParams = [
        formData.startDate
          ? `startDate=${encodeURIComponent(formData.startDate)}`
          : null,
        formData.endDate
          ? `endDate=${encodeURIComponent(formData.endDate)}`
          : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `&${queryParams}` : "";

      await toast.promise(
        (async () => {
          setParams(fullQuery);
          await fetchIntakes(fullQuery);
        })(),
        {
          loading: "Fetching data...",
          success: "Data fetched successfully!",
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
      console.error("Error during form submission:", error);
    }
  };

  const handleClearFilters = () => {
    form.reset({ startDate: "", endDate: "" });
    setParams("");
    formRef.current?.handleClear();
    fetchIntakes();
  };

  const getStatusBadge = (isOpen: boolean) =>
    isOpen
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Intakes</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={18} />}
                  type="button"
                  text="Add New"
                  onClick={() => setIsAddModalOpen(true)}
                  className="!font-semibold"
                />
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {openFilter && (
            <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form
                onSubmit={form.handleSubmit(onFilterSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onFilterSubmit}
                  setParams={setParams}
                />

                <div className="flex items-end gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={handleClearFilters}
                    className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="mx-4 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Cards Grid */}
          <div className="px-4 pb-4">
            {isLoading ? (
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

                      <div className="flex gap-2 mt-4">
                        <ButtonElement
                          icon={<Search size={14} />}
                          text="View Details"
                          onClick={() => {}}
                          className="flex-1 !bg-blue-500 hover:!bg-blue-600 !text-white !text-xs !py-2"
                        />
                        <ButtonElement
                          icon={<CalendarDays size={14} />}
                          text="Apply Now"
                          onClick={() => {}}
                          className="flex-1 !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-xs !py-2"
                          disabled={!intake.isOpen}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                      <th className="px-4 py-3 text-left">S.N</th>
                      <th className="px-4 py-3 text-left">Intake Month</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">University</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Deadline</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Status</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                        No intakes found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddIntakeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchIntakes();
        }}
      />
    </>
  );
};

export default AllIntakeForm;