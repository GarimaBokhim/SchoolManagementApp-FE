/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { Tag, Search, Filter, RotateCcw, CheckCircle, XCircle, Plus } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { useGetAllDocumentTypes } from "../../hooks";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { IDocumentType } from "../types/IDoucumentTypes";
import AddDocumentTypeModal from "../page/Add";

interface FilterFormData {
  search: string;
  startDate: string;
  endDate: string;
}

const AllDocumentTypesForm = () => {
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

  const { data, isLoading, error, refetch } = useGetAllDocumentTypes(params);
  const { handleError, clearError } = useErrorHandler();

  const onFilterSubmit = async (formData: FilterFormData) => {
    clearError();
    try {
      const queryParams = [
        formData.search ? `search=${encodeURIComponent(formData.search)}` : null,
        formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
        formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
      ].filter(Boolean).join("&");

      const fullQuery = queryParams ? `&${queryParams}` : "";

      await toast.promise(
        (async () => { setParams(fullQuery); await refetch(); })(),
        { loading: "Fetching data...", success: "Data fetched successfully!" }
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

  const paginationForm = useForm({
    defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
  });

  if (error) {
    const isAuthError = (error as any)?.response?.status === 401;
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
          <div className="text-center py-16">
            <Tag size={64} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {isAuthError ? "Authentication Required" : "Error loading document types"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isAuthError ? "Please log in to view document types." : "Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const docTypes = data?.Items || [];
  const totalPages = data?.TotalPages || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDocTypes = docTypes.slice(startIndex, startIndex + pageSize);

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#1f1f22] border border-gray-300 
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 
    dark:text-white text-sm appearance-none`;

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Document Types</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button" text="Filter" icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={18} />} type="button" text="Add New"
                  onClick={() => setIsAddModalOpen(true)}
                  className="!font-semibold"
                />
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {openFilter && (
            <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form onSubmit={form.handleSubmit(onFilterSubmit)} className="flex flex-wrap items-end gap-4 md:gap-6">
                <DateRangeFilter ref={formRef} form={form} onSubmit={onFilterSubmit} setParams={setParams} />
                <div className="flex flex-1 items-end gap-2 min-w-[200px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Document Types</label>
                    <div className="relative">
                      <input type="text" placeholder="Search by name..." {...form.register("search")} className={inputClass} />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                  <ButtonElement type="submit" text="Filter" icon={<Filter size={14} />} className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150" />
                  <ButtonElement type="button" text="Clear" icon={<RotateCcw size={14} />} onClick={handleClearFilters} className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150" />
                </div>
              </form>
            </div>
          )}

          {/* Cards Grid */}
          <div className="px-4 pb-4">
            {docTypes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedDocTypes.map((dt: IDocumentType) => (
                  <div key={dt.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
                    <div className="p-5 flex flex-col h-full">

                      {/* Title */}
                      <div className="flex items-start gap-2 mb-3">
                        <Tag size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                          {dt.name}
                        </h3>
                      </div>

                      {/* Status */}
                      <div className={`flex items-center justify-center gap-2 p-2 rounded-lg border mb-3 ${dt.isActive
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                        : "text-gray-500 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      }`}>
                        {dt.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        <p className="text-sm font-semibold">{dt.isActive ? "Active" : "Inactive"}</p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-4 flex-grow">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Created</p>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {new Date(dt.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Modified</p>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {dt.modifiedAt && dt.modifiedAt !== "0001-01-01T00:00:00"
                              ? new Date(dt.modifiedAt).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                      </div>

                      <ButtonElement
                        icon={<Search size={14} />} text="View Details"
                        onClick={() => console.log("View doc type:", dt.id)}
                        className="w-full !bg-blue-500 hover:!bg-blue-600 !text-white !text-xs !py-2 mt-2"
                      />
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
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Created At</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                        No document types found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {docTypes.length > 0 && totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              form={paginationForm}
              pagination={{
                currentPage, firstPage: 1, lastPage: totalPages,
                nextPage: currentPage < totalPages ? currentPage + 1 : currentPage,
                previousPage: currentPage > 1 ? currentPage - 1 : 1,
              }}
              handleSearch={(params) => setCurrentPage(params.pageIndex)}
            />
          </div>
        )}
      </div>

      <AddDocumentTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => { setIsAddModalOpen(false); refetch(); }}
      />
    </>
  );
};

export default AllDocumentTypesForm;