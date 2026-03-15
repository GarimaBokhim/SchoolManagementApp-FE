/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { Filter, RotateCcw, Plus, X, Users } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { Counselor } from "../types/ICounselor";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { CounselorActionMenu } from "./CounselorActionMenu";
import { AddCounselorModal } from "./AddCounselorModel";
import { useAddCounselor, useGetAllCounselors } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";

interface FilterFormData {
  search: string;
  startDate: string;
  endDate: string;
}

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.startsWith("0001")) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
      isActive
        ? "bg-green-100 text-green-700 border-green-300"
        : "bg-red-100 text-red-700 border-red-300"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

const MOCK_SEARCH_RESULTS = [
  { id: "1", fullName: "test1", email: "a@example.com" },
  { id: "2", fullName: "test2", email: "b@example.com" },
  { id: "3", fullName: "test3", email: "c@example.com" },
];

const AllCounselorsForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus);

  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [params, setParams] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchResults, setSearchResults] = useState(MOCK_SEARCH_RESULTS);

  const formRef = useRef<DateRangeFilterRef>(null);
  const pageSize = 10;

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", startDate: "", endDate: "" },
  });

  const { data, isLoading, error, refetch } = useGetAllCounselors(params);
  const addCounselor = useAddCounselor();
  const { handleError, clearError } = useErrorHandler();

  const paginationForm = useForm({
    defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
  });

  const onFilterSubmit = async (formData: FilterFormData) => {
    clearError();
    try {
      const queryParams = [
        formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
        formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `&${queryParams}` : "";

      await toast.promise(
        (async () => {
          setParams(fullQuery);
          setCurrentPage(1);
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
    setSelectedProfile(null);
    setSearchResults(MOCK_SEARCH_RESULTS);
    setParams("");
    setCurrentPage(1);
    formRef.current?.handleClear();
    refetch();
  };

  const handleAdd = async (payload: { fullName: string; email: string; contactNumber: string }) => {
    try {
      await addCounselor.mutateAsync(payload);
      Toast.success("Counselor added successfully!");
      setIsAddModalOpen(false);
    } catch {
      Toast.error("Error adding counselor.");
    }
  };

  const handleDelete = async (_id: string) => {
    Toast.info("Delete coming soon!");
  };

  const handleEdit = () => {
    Toast.info("Edit coming soon!");
  };

  const handleView = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setShowDetailModal(true);
  };

  if (error) {
    const isAuthError = (error as any)?.response?.status === 401;
    return (
      <div className="p-4 sm:p-6">
        <Toaster position="top-right" />
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
          <div className="text-center py-16">
            <Users size={64} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {isAuthError ? "Authentication Required" : "Error loading counselors"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isAuthError ? "Please log in to view counselors." : "Please try again later."}
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

  const counselors = data?.Items || [];
  const totalPages = data?.TotalPages || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCounselors = counselors.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex flex-col sm:flex-row w-full justify-between p-4 px-4 sm:px-6 gap-4 items-start sm:items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Counselors</h1>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={20} />}
                  type="button"
                  text="Add"
                  onClick={() => setIsAddModalOpen(true)}
                  className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                />
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {openFilter && (
            <div className="mb-6 mx-4 sm:mx-6 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
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
                  <AppCombobox
                    value={selectedProfile?.fullName || ""}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Search by Name"
                    name="search"
                    form={form}
                    options={searchResults}
                    selected={selectedProfile}
                    onSelect={(profile) => {
                      setSelectedProfile(profile);
                      form.setValue("search", profile?.fullName || "");
                    }}
                    onFocus={() => setSearchResults(MOCK_SEARCH_RESULTS)}
                    getLabel={(profile) => profile?.fullName ?? ""}
                    getValue={(profile) => profile?.id ?? ""}
                    renderOptionExtra={(profile) => (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {profile.email}
                      </div>
                    )}
                  />
                </div>
                <div className="flex gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Apply"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={handleClearFilters}
                    className="!bg-gray-500 hover:!bg-gray-600 !text-white"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto relative">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Contact Number</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCounselors.length > 0 ? (
                  paginatedCounselors.map((counselor: Counselor, index: number) => (
                    <tr
                      key={counselor.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <td className="py-2 px-4">
                        {(startIndex + index + 1).toString().padStart(2, "0")}
                      </td>
                      <td className="py-2 px-4 font-medium">{counselor.fullName}</td>
                      <td className="py-2 px-4">{counselor.email}</td>
                      <td className="py-2 px-4">{counselor.contactNumber}</td>
                      <td className="py-2 px-4">
                        <StatusBadge isActive={counselor.isActive} />
                      </td>
                      <td className="py-2 px-4">
                        <CounselorActionMenu
                          counselor={counselor}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          canEdit={canEdit}
                          canDelete={canDelete}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                      No counselors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Counselor Modal */}
        <AddCounselorModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAdd}
        />

        {/* View Detail Modal */}
        {showDetailModal && selectedCounselor && (
          <div
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
            onClick={() => setShowDetailModal(false)}
          >
            <div
              className="relative bg-white dark:bg-[#353535] rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Counselor Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={18} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-4 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg shrink-0">
                    {selectedCounselor.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedCounselor.fullName}</p>
                    <StatusBadge isActive={selectedCounselor.isActive} />
                  </div>
                </div>
                {[
                  { label: "Email", value: selectedCounselor.email },
                  { label: "Contact Number", value: selectedCounselor.contactNumber },
                  { label: "Created At", value: formatDate(selectedCounselor.createdAt) },
                  { label: "Modified At", value: formatDate(selectedCounselor.modifiedAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sm:w-48 shrink-0">{label}</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{value || "N/A"}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {counselors.length > 0 && totalPages > 1 && (
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
              handleSearch={(p) => setCurrentPage(p.pageIndex)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllCounselorsForm;