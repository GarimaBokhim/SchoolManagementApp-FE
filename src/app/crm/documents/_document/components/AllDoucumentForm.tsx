"use client";

import { useRef, useState, useMemo } from "react";
import {
  FileText, Search, Filter, RotateCcw,
  CheckCircle, Clock, XCircle, ExternalLink, Plus, MoreVertical,
} from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { useGetAllDocuments, useGetAllApplicants } from "../../hooks";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { IDocument } from "../model/IDocuments";
import AddDocumentModal from "../pages/Add";
import { useGetAllDocumentTypesList } from "../hooks";

interface FilterFormData {
  search: string;
  startDate: string;
  endDate: string;
}

const STATUS_MAP: Record<number, { label: string; color: string; icon: React.ReactNode }> = {
  1: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    icon: <Clock size={14} />,
  },
  2: {
    label: "Approved",
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    icon: <CheckCircle size={14} />,
  },
  3: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    icon: <XCircle size={14} />,
  },
};

const AllDocumentsForm = () => {
  // ─── Permissions ─────────────────────────────────────────────────────────────
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);

  // ─── State ───────────────────────────────────────────────────────────────────
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [params, setParams] = useState("");
  const formRef = useRef<DateRangeFilterRef>(null);
  const pageSize = 10;

  // ─── Forms ───────────────────────────────────────────────────────────────────
  const form = useForm<FilterFormData>({
    defaultValues: { search: "", startDate: "", endDate: "" },
  });

  const paginationForm = useForm({
    defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
  });

  // ─── Data ────────────────────────────────────────────────────────────────────
  const { data, isLoading, error, refetch } = useGetAllDocuments(params);
  const { data: applicants, isLoading: applicantsLoading } = useGetAllApplicants();
  const { data: documentTypes } = useGetAllDocumentTypesList();
  const { handleError, clearError } = useErrorHandler();

  // ─── Maps ────────────────────────────────────────────────────────────────────
  const applicantMap = useMemo(() => {
    const map = new Map<string, string>();
    if (applicants) {
      applicants.forEach((applicant: any) => {
        map.set(applicant.id, applicant.fullName);
      });
    }
    return map;
  }, [applicants]);

  const documentTypeMap = useMemo(() => {
    const map = new Map<string, string>();
    if (documentTypes) {
      documentTypes.forEach((dt) => {
        map.set(dt.id, dt.name);
      });
    }
    return map;
  }, [documentTypes]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const getApplicantName = (applicantId: string) => {
    return applicantMap.get(applicantId) || applicantId || "-";
  };

  const getDocumentTypeName = (documentTypeId: string) => {
    return documentTypeMap.get(documentTypeId) || documentTypeId || "-";
  };

  // ─── Handlers ────────────────────────────────────────────────────────────────
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

  // ─── Error State ─────────────────────────────────────────────────────────────
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

  // ─── Loading State ────────────────────────────────────────────────────────────
  if (isLoading || applicantsLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  const documents = data?.Items || [];
  const totalPages = data?.TotalPages || 1;

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#1f1f22] border border-gray-300 
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 
    dark:text-white text-sm appearance-none`;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster position="top-right" />

      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* ── Header ── */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Documents</h1>
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

          {/* ── Filter Panel ── */}
          {openFilter && (
            <div className="mb-6 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
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
                <div className="flex-1 min-w-[240px]">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search Documents
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by applicant name or ID..."
                        {...form.register("search")}
                        className={inputClass}
                      />
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-auto">
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

          {/* ── Table ── */}
          <div className="overflow-x-auto relative">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3 text-left">Applicant Name</th>
                  <th className="px-4 py-3 text-left">Document Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Active</th>
                  <th className="px-4 py-3 text-left">Document Link</th>
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc: IDocument, index: number) => {
                    const status = STATUS_MAP[doc.documentStatus] ?? {
                      label: "Unknown",
                      color: "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400",
                      icon: <FileText size={14} />,
                    };
                    return (
                      <tr
                        key={doc.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                      >
                        {/* S.N */}
                        <td className="py-3 px-4">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>

                        {/* Applicant Name */}
                        <td className="py-3 px-4 font-medium">
                          <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                            {getApplicantName(doc.applicantId)}
                          </span>
                        </td>

                        {/* Document Type Name */}
                        <td className="py-3 px-4">
                          {getDocumentTypeName(doc.documentTypeId)}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </span>
                        </td>

                        {/* Active */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          }`}>
                            {doc.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Document Link */}
                        <td className="py-3 px-4">
                          {doc.docLink ? (
                            <a
                              href={
                                doc.docLink.startsWith("http")
                                  ? doc.docLink
                                  : `https://schoolapp.netraverselabs.com/${doc.docLink}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                            >
                              <ExternalLink size={12} />
                              <span className="truncate max-w-[150px]">View</span>
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => console.log("Actions for doc:", doc.id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                            title="Actions"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <FileText size={48} className="mx-auto mb-3 text-gray-400" />
                      No documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Pagination ── */}
        {documents.length > 0 && totalPages > 1 && (
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

      {/* ── Modal ── */}
      <AddDocumentModal
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

export default AllDocumentsForm;