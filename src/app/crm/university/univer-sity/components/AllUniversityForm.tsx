/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/crm/university/univer-sity/components/AllUniversityForm.tsx
"use client";

import { useState } from "react";
import { GraduationCap, Search, MapPin, ChevronDown, Filter, RotateCcw, Award, Globe, ExternalLink, Plus } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { useGetAllUniversities } from "../hooks";
import { IUniversity } from "../types/IUniversity";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddUniversityModal from "../pages/Add";


interface FilterFormData {
  search: string;
  country: string;
}

const generateLocation = (university: IUniversity): string => {
  return university.country || "Location not specified";
};

const generateDescription = (university: IUniversity): string => {
  if (university.descriptions && university.descriptions !== "str") {
    return university.descriptions;
  }
  return `${university.name} is a university in ${university.country} with global ranking #${university.globalRanking}.`;
};

const AllUniversityForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);

  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const pageSize = 9;

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", country: "" },
  });

  const { data, isLoading, error, refetch } = useGetAllUniversities();

  const uniqueCountries = data?.Items
    ? [...new Set(data.Items.map(u => u.country))].filter(Boolean)
    : [];

  const onFilterSubmit = (data: FilterFormData) => {
    console.log("Filter UI clicked - filters:", data);
  };

  const handleClearFilters = () => {
    form.reset({ search: "", country: "" });
  };

  const handleViewDetails = (universityId: string) => {
    console.log("View details clicked for university:", universityId);
  };

  const paginationForm = useForm({
    defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
  });

  if (error) {
    const isAuthError = (error as any)?.response?.status === 401;
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden p-8">
          <div className="text-center py-16">
            <GraduationCap size={64} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {isAuthError ? "Authentication Required" : "Error loading universities"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isAuthError ? "Please log in to view universities." : "Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const universities = data?.Items || [];
  const totalItems = data?.TotalItems || 0;
  const totalPages = data?.TotalPages || 1;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUniversities = universities.slice(startIndex, startIndex + pageSize);

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#1f1f22] border border-gray-300 
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 
    dark:text-white text-sm appearance-none`;

  return (
    <>
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
                <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Universities</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or location..."
                      {...form.register("search")}
                      className={inputClass}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                  <div className="relative">
                    <select {...form.register("country")} className={inputClass}>
                      <option value="">All Countries</option>
                      {uniqueCountries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                      ))}
                    </select>
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>

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


          {/* Cards Grid - completely unchanged */}
          <div className="px-4 pb-4">
            {universities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedUniversities.map((university: IUniversity) => (
                  <div
                    key={university.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                  >
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex items-start gap-2 mb-3">
                        <GraduationCap size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                          {university.name}
                        </h3>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
                          <MapPin size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 line-clamp-1">
                            {generateLocation(university)}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-grow">
                        {generateDescription(university)}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                          <Award size={14} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            Rank #{university.globalRanking || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                          <Globe size={14} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {university.country || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {university.website && university.website !== "str" && (
                          <a
                            href={university.website.startsWith('http') ? university.website : `https://${university.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline truncate"
                          >
                            <ExternalLink size={12} />
                            <span className="truncate">{university.website}</span>
                          </a>
                        )}
                        <ButtonElement
                          icon={<Search size={14} />}
                          text="View Details"
                          onClick={() => handleViewDetails(university.id)}
                          className="w-full !bg-blue-500 hover:!bg-blue-600 !text-white !text-xs !py-2 mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <GraduationCap size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No universities found</h3>
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

        {/* Pagination */}
        {universities.length > 0 && totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              form={paginationForm}
              pagination={{
                currentPage: currentPage,
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