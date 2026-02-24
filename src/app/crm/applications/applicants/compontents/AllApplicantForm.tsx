"use client";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Filter, Plus, RotateCcw } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import { useApplicants } from "../hooks/useApplicants";
import { useApplicantMutations } from "../hooks/useApplicantMutations";
import { ApplicantDetailModal } from "../model/ApplicantDetailModel";
import ConvertToStudentModal from "../pages/convert";

import {
  Applicant,
  ConvertToStudentData,
  ConvertToStudentPayload,
  FilterFormData,
  SearchParam,
  SelectedApplicant,
  UserProfile,
} from "../types/IApplicants";
import { ActionMenu } from "./applicant_ui_components/ActionMenu";

const AllApplicantsForm = () => {
  const { menuStatus } = usePermissions();
  const { canEdit, canAdd } = useMenuPermissionData(menuStatus);

  const { data: allSchools } = useGetAllSchool();

  const {
    applicants,
    loading,
    isFetching,
    error,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    setParams,
    fetchApplicants,
  } = useApplicants(allSchools);

  const { handleDelete, handleConvert, convertingId } = useApplicantMutations(fetchApplicants);

  const [openFilter, setOpenFilter] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);
  const [, setLocalParams] = useState("");

  // Modal states
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<SelectedApplicant | null>(null);

  const [conversionData, setConversionData] = useState<ConvertToStudentData>({
    universityName: "",
    visaId: "",
  });

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  const form = useForm<FilterFormData>({
    defaultValues: {
      firstName: "",
      startDate: "",
      endDate: "",
    },
  });

  const paginationForm = useForm<SearchParam>({
    defaultValues: {
      pageSize: 10,
      pageIndex: 1,
      isPagination: true,
    },
  });

  const formRef = useRef<DateRangeFilterRef>(null);
  const { clearError } = useErrorHandler();

  const onSubmit: SubmitHandler<FilterFormData> = (formData) => {
    clearError();
    const queryParams = [
      formData.firstName ? `firstName=${encodeURIComponent(formData.firstName)}` : null,
      formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
      formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
    ]
      .filter(Boolean)
      .join("&");
    const fullQuery = queryParams ? `&${queryParams}` : "";
    setParams(fullQuery);
    setLocalParams(fullQuery);
    setPaginationParams((prev: SearchParam) => ({ ...prev, pageIndex: 1 }));
  };

  const onClearClick = () => {
    setParams("");
    setLocalParams("");
    setSelectedProfile(undefined);
    formRef.current?.handleClear();
    form.reset();
    setPaginationParams((prev: SearchParam) => ({ ...prev, pageIndex: 1 }));
  };

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };

  // ✅ Action handlers
  const handleViewClick = (applicant: Applicant) => {
    setSelectedApplicantId(applicant.userId ?? applicant.id);
    setShowDetailModal(true);
  };

  const handleEditClick = (applicant: Applicant) => {
    Toast.info("Edit feature coming soon!");
    // Implement your edit logic here
    console.log("Edit applicant:", applicant);
  };

  const handleConvertClick = (applicant: Applicant) => {
    setConversionData({ universityName: "", visaId: "" });
    setSelectedApplicant({ 
      ...applicant, 
      name: applicant.fullName ?? "",
      userId: applicant.userId ?? applicant.id // Ensure userId is set
    });
    setShowConvertModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    // Find the applicant by id to pass to handleDelete
    const applicant = applicants.find(a => a.id === id || a.userId === id);
    if (applicant) {
      await handleDelete(applicant);
    }
  };

  // Conversion form handlers
  const handleConversionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConversionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant) return;
    const payload: ConvertToStudentPayload = {
      userId: selectedApplicant.userId,
      universityName: conversionData.universityName,
      visaId: conversionData.visaId,
    };
    const success = await handleConvert(selectedApplicant as unknown as Applicant, payload);
    if (success) {
      setShowConvertModal(false);
      setConversionData({ universityName: "", visaId: "" });
    }
  };

  const handleCloseConvertModal = () => {
    if (convertingId) return;
    setShowConvertModal(false);
    setConversionData({ universityName: "", visaId: "" });
    setSelectedApplicant(null);
  };

  if (!allSchools) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading schools data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Toaster position="top-right" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Applicants</h1>
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
                  icon={<Plus size={24} />}
                  type="button"
                  text="Add New Applicant"
                  onClick={() => Toast.info("Add new applicant feature coming soon!")}
                  className="!text-md !font-bold"
                />
              )}
            </div>
          </div>

          {openFilter && (
            <div className="mb-6 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setLocalParams}
                />
                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedProfile?.fullName ?? ""}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Applicant Name"
                    name="firstName"
                    form={form}
                    options={[]}
                    selected={selectedProfile || null}
                    onSelect={(profile) => {
                      if (profile) {
                        setSelectedProfile(profile);
                        form.setValue("firstName", profile.fullName);
                        form.handleSubmit(onSubmit)();
                      } else {
                        setSelectedProfile(undefined);
                      }
                    }}
                    getLabel={(p) => p?.fullName ?? ""}
                    getValue={(p) => p?.fullName ?? ""}
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
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150"
                  />
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto relative">
            {isFetching && (
              <div className="absolute inset-0 z-10 bg-white/50 dark:bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <table
              className={`w-full border-collapse text-xs sm:text-sm transition-opacity duration-150 ${
                isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Passport No</th>
                  <th className="px-4 py-3 text-left">Target Country</th>
                  <th className="px-4 py-3 text-left">School</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Loading Applicants...
                    </td>
                  </tr>
                ) : applicants && applicants.length > 0 ? (
                  applicants.map((applicant: Applicant, index: number) => (
                    <tr
                      key={applicant.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-1 px-4">
                        {(currentPage - 1) * paginationParams.pageSize + index + 1}
                      </td>
                      <td className="py-1 px-4">{applicant.fullName ?? "-"}</td>
                      <td className="py-1 px-4">{applicant.email ?? "-"}</td>
                      <td className="py-1 px-4">{applicant.passportNo ?? "-"}</td>
                      <td className="py-1 px-4">{applicant.targetCountry ?? "-"}</td>
                      <td className="py-1 px-4">{applicant.schoolName ?? "-"}</td>
                      <td className="py-1 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            applicant.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {applicant.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-1 px-4">
                        {/* ✅ Use ActionMenu component */}
                        <ActionMenu
                          applicant={applicant}
                          onView={handleViewClick}
                          onEdit={handleEditClick}
                          onConvert={handleConvertClick}
                          onDelete={handleDeleteClick}
                          canEdit={canEdit}
                          canDelete={true} // You can add a canDelete permission if needed
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500 italic">
                      No Applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showConvertModal && selectedApplicant && (
            <ConvertToStudentModal
              isOpen={showConvertModal}
              onClose={handleCloseConvertModal}
              selectedApplicant={selectedApplicant}
              conversionData={conversionData}
              convertingId={convertingId}
              onInputChange={handleConversionInputChange}
              onSubmit={handleConvertSubmit}
              onSuccess={fetchApplicants}
            />
          )}

          <ApplicantDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedApplicantId(null);
            }}
            applicantId={selectedApplicantId}
          />
        </div>

        {!loading && applicants.length > 0 && (
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
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllApplicantsForm;