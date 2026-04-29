"use client";

import { useRef, useState } from "react";
import {
  GraduationCap,
  Search,
  Filter,
  RotateCcw,
  Building2,
  Plus,
} from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { useGetAllUniversities } from "../hooks";
import { IUniversity } from "../types/IUniversity";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddUniversityModal from "../pages/Add";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { UniversityCard } from "./universityCard";

interface FilterFormData {
  search: string;
  startDate: string;
  endDate: string;
}

const AllUniversityForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);

  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [params, setParams] = useState("");
  const formRef = useRef<DateRangeFilterRef>(null);
  const pageSize = 9;

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", startDate: "", endDate: "" },
  });

  const { data, isLoading, error, refetch } = useGetAllUniversities(params);
  const { handleError, clearError } = useErrorHandler();

  const onFilterSubmit = async (formData: FilterFormData) => {
    clearError();
    try {
      const queryParams = [
        formData.search ? `search=${encodeURIComponent(formData.search)}` : null,
        formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
        formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `&${queryParams}` : "";

      await toast.promise(
        (async () => {
          setParams(fullQuery);
          await refetch();
        })(),
        {
          loading: "Fetching data...",
          success: "Data fetched successfully!",
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  const handleClearFilters = () => {
    form.reset({ search: "", startDate: "", endDate: "" });
    setParams("");
    formRef.current?.handleClear();
    refetch();
  };

  const handleViewDetails = (universityId: string) => {
    console.log("View details clicked for university:", universityId);
    // Navigate to university details page or open modal
  };

  const handleAddCountry = (universityId: string) => {
    console.log("Add country for university:", universityId);
    // Open country selection modal or navigate to edit page
  };

  const paginationForm = useForm({
    defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
  });

  if (error) {
    const isAuthError = (error as any)?.response?.status === 401;
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#1e1e21] border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={32} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {isAuthError ? "Authentication Required" : "Failed to load"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAuthError ? "Please log in to view universities." : "Something went wrong. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#1e1e21] border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm overflow-hidden">
          {/* Skeleton header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700/50">
            <div className="h-6 w-40 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
          </div>
          {/* Skeleton cards */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-700/50 p-5 space-y-3 animate-pulse">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                <div className="space-y-1.5">
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-4/5" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                  <div className="h-14 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                </div>
                <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const universities = data?.Items || [];
  const totalPages = data?.TotalPages || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUniversities = universities.slice(startIndex, startIndex + pageSize);

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#2a2a2e] border border-gray-200
    dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40
    focus:border-emerald-500 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500
    transition-all duration-150`;

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#1e1e21] border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm overflow-hidden">

          {/* ── Header ── */}
          <div className="flex w-full justify-between items-center px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <Building2 size={18} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">
                  All Universities
                </h1>
                {universities.length > 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {universities.length} institution{universities.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenFilter(!openFilter)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-150
                  ${openFilter
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
                    : "bg-white dark:bg-[#2a2a2e] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600/50 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
              >
                <Filter size={14} />
                Filter
              </button>
              {canAdd && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold
                    bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600
                    shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30 transition-all duration-150"
                >
                  <Plus size={15} />
                  Add New
                </button>
              )}
            </div>
          </div>

          {/* ── Filter Panel ── */}
          {openFilter && (
            <div className="mx-5 my-4 bg-gray-50 dark:bg-[#25252a] rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
              <form
                onSubmit={form.handleSubmit(onFilterSubmit)}
                className="flex flex-wrap items-end gap-3"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onFilterSubmit}
                  setParams={setParams}
                />
                <div className="flex flex-1 items-end gap-2 min-w-[200px]">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Name or location..."
                        {...form.register("search")}
                        className={inputClass}
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium
                      bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-150"
                  >
                    <Filter size={14} />
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium
                      bg-white dark:bg-[#2a2a2e] text-gray-600 dark:text-gray-300
                      border border-gray-200 dark:border-gray-600/50
                      hover:border-gray-400 transition-all duration-150"
                  >
                    <RotateCcw size={14} />
                    Clear
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Cards Grid ── */}
          <div className="px-5 pb-5">
            {universities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedUniversities.map((university: IUniversity, index: number) => (
                  <UniversityCard
                    key={university.id}
                    university={university}
                    index={index}
                    canAdd={canAdd}
                    onViewDetails={handleViewDetails}
                    onAddCountry={handleAddCountry}
                  />
                ))}
              </div>
            ) : (
              /* ── Empty state ── */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700/30 flex items-center justify-center mb-4">
                  <Building2 size={28} className="text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                  No universities found
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs">
                  Try adjusting your filters or add a new university to get started.
                </p>
                {canAdd && (
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-5 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                      bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-150"
                  >
                    <Plus size={15} />
                    Add First University
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Pagination ── */}
        {universities.length > 0 && totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              form={paginationForm}
              pagination={{
                currentPage,
                firstPage: 1,
                lastPage: totalPages,
                nextPage: currentPage < totalPages ? currentPage + 1 : currentPage,
                previousPage: currentPage > 1 ? currentPage - 1 : 1,
              }}
              handleSearch={(params) => setCurrentPage(params.pageIndex)}
            />
          </div>
        )}
      </div>

      <AddUniversityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          refetch();
        }}
      />
    </>
  );
};

export default AllUniversityForm;