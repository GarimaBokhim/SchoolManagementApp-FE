"use client";

import { useRef, useState, useMemo } from "react";
import { Filter, RotateCcw, Plus, CalendarDays } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import {
  useGetAllAppointments,
  useAddAppointment,
  useGetAllLeads,
  useGetAllCounselorDetails,
} from "../hooks";
import { Appointment } from "../types/IAppointment";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { AppointmentActionMenu } from "./AppointmentActionMenu";
import { AddAppointmentModal } from "../model/AddAppointmentModel";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllCountries, useGetAllCourses, useGetUniversities } from "@/app/crm/university/_university/hooks";
import AppointmentDetailModal from "./AppointmentDetailModel";

interface FilterFormData {
  search: string;
  startDate: string;
  endDate: string;
}

const APPOINTMENT_STATUS_LABELS: Record<number, string> = {
  1: "Scheduled",
  2: "Completed",
  3: "Cancelled",
  4: "No Show",
};

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.startsWith("0001")) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StatusBadge = ({ status }: { status: number }) => {
  const label = APPOINTMENT_STATUS_LABELS[status] ?? "Unknown";
  const colorMap: Record<number, string> = {
    1: "bg-blue-100 text-blue-700 border border-blue-300",
    2: "bg-green-100 text-green-700 border border-green-300",
    3: "bg-red-100 text-red-700 border border-red-300",
    4: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[status] ?? "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
};

const MOCK_SEARCH_RESULTS = [
  { id: "1", fullName: "Mock User 1", email: "a@example.com" },
  { id: "2", fullName: "Mock User 2", email: "b@example.com" },
  { id: "3", fullName: "Mock User 3", email: "c@example.com" },
];

const AllAppointmentsForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus);

  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [params, setParams] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchResults, setSearchResults] = useState(MOCK_SEARCH_RESULTS);

  const formRef = useRef<DateRangeFilterRef>(null);
  const pageSize = 10;

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", startDate: "", endDate: "" },
  });

  const { data, isLoading, error, refetch } = useGetAllAppointments(params);
  const { data: leads = [] } = useGetAllLeads();
  const { data: counselors = [] } = useGetAllCounselorDetails();
  const addAppointment = useAddAppointment();
  const { handleError, clearError } = useErrorHandler();

  // For resolving names in enquiry detail
  const { data: countries = [] } = useGetAllCountries();
  const { data: universities = [] } = useGetUniversities();
  const { data: courses = [] } = useGetAllCourses();

  const countryMap = useMemo(() => {
    const map: Record<string, string> = {};
    countries.forEach((c: any) => { map[c.id] = c.name; });
    return map;
  }, [countries]);

  const universityMap = useMemo(() => {
    const map: Record<string, string> = {};
    universities.forEach((u: any) => { map[u.id] = u.name; });
    return map;
  }, [universities]);

  const courseMap = useMemo(() => {
    const map: Record<string, string> = {};
    courses.forEach((c: any) => { map[c.id] = c.title; });
    return map;
  }, [courses]);

  const leadMap = useMemo(() => {
    const map: Record<string, string> = {};
    leads.forEach((l: any) => { map[l.id] = l.fullName; });
    return map;
  }, [leads]);

  const counselorMap = useMemo(() => {
    const map: Record<string, string> = {};
    counselors.forEach((c: any) => { map[c.id] = c.fullName; });
    return map;
  }, [counselors]);

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

  const handleAdd = async (payload: {
    leadId: string;
    startTime: string;
    endTime: string;
    appointmentDate: string;
    counselorId: string;
    notes: string;
    appointmentStatus: number;
  }) => {
    try {
      await addAppointment.mutateAsync(payload);
      Toast.success("Appointment added successfully!");
      setIsAddModalOpen(false);
    } catch {
      Toast.error("Error adding appointment.");
    }
  };

  const handleDelete = async (_id: string) => {
    Toast.info("Delete coming soon!");
  };

  const handleEdit = () => {
    Toast.info("Edit coming soon!");
  };

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  if (error) {
    const isAuthError = (error as any)?.response?.status === 401;
    return (
      <div className="p-4 sm:p-6">
        <Toaster position="top-right" />
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8">
          <div className="text-center py-16">
            <CalendarDays size={64} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {isAuthError ? "Authentication Required" : "Error loading appointments"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isAuthError ? "Please log in to view appointments." : "Please try again later."}
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

  const appointments = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAppointments = appointments.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* Header - Updated to match student component */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Appointments</h1>
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
                text="Add New Appointment"
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
                    label="Lead Name"
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
                  <th className="px-4 py-3 text-left">Lead</th>
                  <th className="px-4 py-3 text-left">Counselor</th>
                  <th className="px-4 py-3 text-left">Appointment Date</th>
                  <th className="px-4 py-3 text-left">Start Time</th>
                  <th className="px-4 py-3 text-left">End Time</th>
                  <th className="px-4 py-3 text-left">Notes</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map((appointment: Appointment, index: number) => (
                    <tr
                      key={appointment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-1 px-4">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-1 px-4 font-medium">
                        {leadMap[appointment.leadId] || (
                          <span className="text-gray-400 italic text-xs">Unknown</span>
                        )}
                      </td>
                      <td className="py-1 px-4">
                        {counselorMap[appointment.counselorId] || (
                          <span className="text-gray-400 italic text-xs">Unknown</span>
                        )}
                      </td>
                      <td className="py-1 px-4">{formatDate(appointment.appointmentDate)}</td>
                      <td className="py-1 px-4">{appointment.startTime}</td>
                      <td className="py-1 px-4">{appointment.endTime}</td>
                      <td className="py-1 px-4 max-w-[200px] truncate">{appointment.notes || "N/A"}</td>
                      <td className="py-1 px-4">
                        <StatusBadge status={appointment.appointmentStatus} />
                      </td>
                      <td className="py-1 px-4">
                        <AppointmentActionMenu
                          appointment={appointment}
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
                    <td colSpan={9} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Appointment Modal */}
        <AddAppointmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAdd}
        />

        {/* View Detail Modal */}
        {showDetailModal && selectedAppointment && (
          <AppointmentDetailModal
            appointment={selectedAppointment}
            leadMap={leadMap}
            counselorMap={counselorMap}
            countryMap={countryMap}
            universityMap={universityMap}
            courseMap={courseMap}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedAppointment(null);
            }}
          />
        )}

        {/* Pagination */}
        {appointments.length > 0 && totalPages > 1 && (
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

export default AllAppointmentsForm;