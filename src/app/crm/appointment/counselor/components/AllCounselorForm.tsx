/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { Filter, RotateCcw, Plus, Users } from "lucide-react";
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
import CounselorDetailModal from "./CounselorDetailModel";

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
    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${isActive
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
        { loading: "Fetching data...", success: "Data fetched successfully!" }
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
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          {/* Skeleton header */}
          <div className="flex justify-between items-center p-3 px-4 pt-4">
            <div className="h-6 w-32 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
          </div>
          {/* Skeleton table */}
          <div className="p-5 space-y-3">
            <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const counselors = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCounselors = counselors.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* Header - Updated to match student component */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Counselors</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {/* {canAdd && ( - Commented out conditional rendering */}
              <ButtonElement
                icon={<Plus size={24} />}
                type="button"
                text="Add New Counselor"
                onClick={() => setIsAddModalOpen(true)}
                className="!text-md !font-bold"
              />
              {/* )} */}
            </div>
          </div>

          {/* Filter Panel - Updated to match student component */}
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
                  <AppCombobox
                    value={selectedProfile?.fullName || ""}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Counselor Name"
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

          {/* Table - Updated with loading overlay */}
          <div className="overflow-x-auto relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-white/50 dark:bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <table
              className={`w-full border-collapse text-xs sm:text-sm transition-opacity duration-150 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
                }`}
            >
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
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
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-1 px-4">
                        {(startIndex + index + 1)}
                      </td>
                      <td className="py-1 px-4 font-medium">{counselor.fullName}</td>
                      <td className="py-1 px-4">{counselor.email}</td>
                      <td className="py-1 px-4">{counselor.contactNumber}</td>
                      <td className="py-1 px-4">
                        <StatusBadge isActive={counselor.isActive} />
                      </td>
                      <td className="py-1 px-4">
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

        {showDetailModal && selectedCounselor && (
          <CounselorDetailModal
            counselor={selectedCounselor}
            onClose={() => {
              setShowDetailModal(false)
              setSelectedCounselor(null)
            }}
          />
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