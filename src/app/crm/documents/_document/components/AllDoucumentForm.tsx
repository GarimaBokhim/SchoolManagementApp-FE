/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import {
  FileText, Search, User, Filter, RotateCcw,
  CheckCircle, Clock, XCircle, ExternalLink, Plus,
} from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { useGetAllDocuments } from "../../hooks";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddDocumentModal from "../pages/Add";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { IDocument } from "../model/IDocuments";

interface FilterFormData {
  search: string;
  startDate: string;
  endDate: string;
}

const STATUS_MAP: Record<number, { label: string; color: string; icon: React.ReactNode }> = {
  1: { label: "Pending",  color: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800", icon: <Clock size={14} /> },
  2: { label: "Approved", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800", icon: <CheckCircle size={14} /> },
  3: { label: "Rejected", color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800", icon: <XCircle size={14} /> },
};

const AllDocumentsForm = () => {
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

  const { data, isLoading, error, refetch } = useGetAllDocuments(params);
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
            <FileText size={64} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {isAuthError ? "Authentication Required" : "Error loading documents"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isAuthError ? "Please log in to view documents." : "Please try again later."}
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

  const documents = data?.Items || [];
  const totalPages = data?.TotalPages || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDocuments = documents.slice(startIndex, startIndex + pageSize);

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
            <h1 className="text-xl font-semibold">All Documents</h1>
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
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Documents</label>
                    <div className="relative">
                      <input type="text" placeholder="Search documents..." {...form.register("search")} className={inputClass} />
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
            {documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedDocuments.map((doc: IDocument) => {
                  const status = STATUS_MAP[doc.documentStatus] ?? { label: "Unknown", color: "text-gray-500 bg-gray-50 border-gray-200", icon: <FileText size={14} /> };
                  return (
                    <div key={doc.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
                      <div className="p-5 flex flex-col h-full">

                        {/* Title row */}
                        <div className="flex items-start gap-2 mb-3">
                          <FileText size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                            Document
                          </h3>
                        </div>

                        {/* Status badge */}
                        <div className={`flex items-center justify-center gap-2 p-2 rounded-lg border mb-3 ${status.color}`}>
                          {status.icon}
                          <p className="text-sm font-semibold">{status.label}</p>
                        </div>

                        {/* Applicant ID */}
                        <div className="flex items-center gap-2 mb-3">
                          <User size={14} className="text-gray-400 flex-shrink-0" />
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            Applicant: <span className="font-medium text-gray-800 dark:text-gray-200">{doc.applicantId}</span>
                          </p>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4 flex-grow">
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Active</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {doc.isActive ? "Yes" : "No"}
                            </p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Created</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Doc link */}
                        {doc.docLink && (
                          <a
                            href={doc.docLink.startsWith("http") ? doc.docLink : `https://${doc.docLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline truncate mb-2"
                          >
                            <ExternalLink size={12} />
                            <span className="truncate">{doc.docLink}</span>
                          </a>
                        )}

                        <ButtonElement
                          icon={<Search size={14} />} text="View Details"
                          onClick={() => console.log("View doc:", doc.id)}
                          className="w-full !bg-blue-500 hover:!bg-blue-600 !text-white !text-xs !py-2 mt-2"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                      <th className="px-4 py-3 text-left">S.N</th>
                      <th className="px-4 py-3 text-left">Applicant ID</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Document Type</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Status</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                        No documents found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {documents.length > 0 && totalPages > 1 && (
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

      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => { setIsAddModalOpen(false); refetch(); }}
      />
    </>
  );
};

export default AllDocumentsForm;