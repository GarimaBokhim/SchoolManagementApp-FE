"use client";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { EditButton } from "@/components/Buttons/EditButton";
import { Edit, Eye, Filter, Plus, RotateCcw, Trash, UserCheck } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import { useApplicants } from "../hooks/useApplicants";
import { useApplicantMutations } from "../hooks/useApplicantMutations";
import { ApplicantDetailModal } from "../model/ApplicantDetailModel";
import { api } from "@/utils/instance";
import ConvertToStudentModal from "../pages/convert";
import { Applicant, FilterFormData, SearchParam, SelectedApplicant, UserProfile } from "../types/IApplicants";


const AllApplicantsForm = () => {
  // ── Permissions ──
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);

  // ── Schools data ──
  const { data: allSchools } = useGetAllSchool();

  // ── Applicants data ──
  const {
    applicants,
    loading,
    error,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    setParams,
    fetchApplicants,
  } = useApplicants(allSchools);

  // ── Mutations ──
  const { handleDelete, handleConvert } = useApplicantMutations(fetchApplicants);

  // ── Filter state ──
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [params, setLocalParams] = useState("");

  // ── Convert modal state ──
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<SelectedApplicant | null>(null); // ← fixed type

  // ── Detail modal state ──
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  // ── Filter form ──
  const form = useForm<FilterFormData>({
    defaultValues: {
      firstName: "",
      startDate: "",
      endDate: "",
    },
  });

  // ── Pagination form ──
  const paginationForm = useForm<SearchParam>({
    defaultValues: {
      pageSize: 10,
      pageIndex: 1,
      isPagination: true,
    },
  });

  const formRef = useRef<DateRangeFilterRef>(null);
  const { handleError, clearError } = useErrorHandler();

  useEffect(() => {
    fetchApplicants();
  }, [paginationParams]);

  // ── Filter submit ──
  const onSubmit: SubmitHandler<FilterFormData> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        formData.firstName
          ? `firstName=${encodeURIComponent(formData.firstName)}`
          : null,
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
          setLocalParams(fullQuery);
          setPaginationParams((prev: any) => ({ ...prev, pageIndex: 1 }));
        })(),
        {
          loading: "Fetching applicants...",
          success: "Applicants fetched successfully!",
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
      console.error("Error during form submission:", error);
    }
  };

  // ── Search user profiles for combobox ──
  const fetchUsers = async (search: string = "") => {
    setIsSearching(true);
    try {
      const response = await api.get(
        `/api/Enrolments/GetAllUserProfile?search=${encodeURIComponent(search)}`
      );
      if (response.data?.Items) {
        setSearchResults(response.data.Items);
      }
    } catch {
      Toast.error("Failed to search profiles");
    } finally {
      setIsSearching(false);
    }
  };

  // ── Clear filter ──
  const onClearClick = () => {
    setParams("");
    setLocalParams("");
    setSelectedProfile(undefined);
    formRef.current?.handleClear();
    form.reset();
    setPaginationParams((prev: any) => ({ ...prev, pageIndex: 1 }));
  };

  // ── Handlers ──
  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };

  // ── Map Applicant → SelectedApplicant before opening modal ──
  const handleConvertClick = (applicant: Applicant) => {
    setSelectedApplicant({
      ...applicant,
      name: applicant.fullName ?? "", // ← map fullName to required name field
    });
    setShowConvertModal(true);
  };

  const handleViewClick = (applicant: Applicant) => {
    setSelectedApplicantId(applicant.userId ?? applicant.id);
    setShowDetailModal(true);
  };

  // ── Edit button per row ──
  const buttonElement = (applicant: Applicant) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => handleViewClick(applicant)}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };

  // ── Loading/Error states ──
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

          {/* ── Header ── */}
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
                  onClick={() => {}}
                  className="!text-md !font-bold"
                />
              )}
            </div>
          </div>

          {/* ── Filter Panel ── */}
          {openFilter && (
            <div className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
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
                    options={searchResults}
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

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Passport No</th>
                  <th className="px-4 py-3 text-left">Target Country</th>
                  <th className="px-4 py-3 text-left">School</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center w-[200px]">Actions</th>
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
                        <div className="flex justify-center gap-2">
                          {/* View Detail */}
                          <ButtonElement
                            icon={<Eye size={14} />}
                            type="button"
                            text=""
                            onClick={() => handleViewClick(applicant)}
                            className="!text-xs font-bold !bg-blue-500"
                          />
                          {/* Convert to Student */}
                          <ButtonElement
                            icon={<UserCheck size={14} />}
                            type="button"
                            text=""
                            onClick={() => handleConvertClick(applicant)}
                            className="!text-xs font-bold !bg-purple-500"
                          />
                          {canDelete && (
                            <DeleteButton
                              onConfirm={() => handleDelete(applicant.id)}
                              headerText={<Trash />}
                              content="Are you sure you want to delete this Applicant?"
                            />
                          )}
                          {canEdit && (
                            <EditButton button={buttonElement(applicant)} />
                          )}
                        </div>
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

          {/* ── Convert Modal ── */}
          <ConvertToStudentModal
            isOpen={showConvertModal}
            onClose={() => setShowConvertModal(false)}
            selectedApplicant={selectedApplicant}
            onSuccess={fetchApplicants}
          />

          {/* ── Detail Modal ── */}
          <ApplicantDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedApplicantId(null);
            }}
            applicantId={selectedApplicantId}
          />
        </div>

        {/* ── Pagination ── */}
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