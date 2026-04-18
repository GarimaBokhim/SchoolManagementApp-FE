"use client";
import { useEffect, useRef, useState } from "react";
import { IRegistration, IFilterRegistrationByDate } from "../types/IRegistration";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { EditButton } from "@/components/Buttons/EditButton";
import { Edit, Filter, Plus, RotateCcw, Trash } from "lucide-react";
import EditRegistration from "../pages/Edit";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import {
  useFilterRegistrationByDate,
  useGetAllAcademicYear,
  useRemoveRegistration,
} from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddRegistration from "../pages/Add";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useGetAllStudents } from "../../Student/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";

const AllRegistrationForm = () => {
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  
  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };
  
  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };
  
  const { data: allAcademicYear } = useGetAllAcademicYear();
  const {data: allStudents} = useGetAllStudents()
  const {data: allClasses} = useGetAllClass()
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string | null>(null);
  const [addModal, setAddModal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);
  const [selectedId, setSelectedId] = useState<string>("");
  
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowRegistrations(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  
  const [params, setParams] = useState("");
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const form = useForm<IFilterRegistrationByDate>({
    defaultValues: {
      academicYearId: "",
      startDate: "",
      endDate: "",
    },
  });
  const fullQuery = query + (params || "");

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  
  const {
    data: filteredRegistration,
    refetch,
    isLoading,
  } = useFilterRegistrationByDate(fullQuery);
  
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  
  const onSubmit: SubmitHandler<IFilterRegistrationByDate> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        formData.academicYearId
          ? `academicYearId=${encodeURIComponent(formData.academicYearId)}`
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
      console.error("Error during form submission:", error);
    }
  };

  const refForInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refForInput.current?.focus();
  }, []);
  
  const formRef = useRef<DateRangeFilterRef>(null);
  const deleteRegistration = useRemoveRegistration();
  
  const handleDelete = async (id: string) => {
    try {
      await deleteRegistration.mutateAsync(id);
      toast.success("User deleted successfully!");
      refetch();
    } catch {
      toast.error("Error deleting user.");
    }
  };
  
  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
    setSelectedAcademicYearId(null);
    form.reset();
  };
  
  // Calculate the starting serial number for the current page
  const getSerialNumber = (index: number) => {
    return (paginationParams.pageIndex - 1) * paginationParams.pageSize + index + 1;
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className=" text-xl font-semibold ">All Registrations</h1>
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
                  text="Add New Registration"
                  onClick={() => setAddModal(true)}
                  className="!text-md !font-bold"
                />
              )}
            </div>
          </div>
          
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
                  setParams={setParams}
                />
                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedAcademicYearId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Academic Year"
                    name="academicYearId"
                    form={form}
                    options={allAcademicYear?.Items}
                    selected={
                      allAcademicYear?.Items?.find(
                        (g) => g.Id === selectedAcademicYearId
                      ) || null
                    }
                    onSelect={(group) => {
                      if (group) {
                        setSelectedAcademicYearId(group.Id || null);
                      } else {
                        setSelectedAcademicYearId(null);
                      }
                    }}
                    getLabel={(g) => g?.Name ?? ""}
                    getValue={(g) => g?.Id ?? ""}
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
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Academic Year</th>
                  <th className="px-4 py-3 text-center w-[180px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading Registrations...
                    </td>
                  </tr>
                ) : filteredRegistration?.Items &&
                  filteredRegistration?.Items.length > 0 ? (
                  filteredRegistration?.Items.map(
                    (Registration: IRegistration, index: number) => (
                      <tr
                        key={Registration.id || index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                      >
                        <td className="py-1 px-4">{getSerialNumber(index)}</td>
                        <td className="py-1 px-4">
                          {allStudents?.Items.find((i) => i.id === Registration.studentId)?.firstName || 'N/A'}
                        </td>
                        <td className="py-1 px-4">
                          {allClasses?.Items.find((i) => i.id === Registration.classId)?.name || 'N/A'}
                        </td>
                        <td className="py-1 px-4">
                          {allAcademicYear?.Items.find((i) => i.Id === Registration.academicYearId)?.Name || 'N/A'}
                        </td>
                        <td className="py-1 px-4">
                          <div className="flex justify-center gap-2">
                            {canDelete && (
                              <DeleteButton
                                onConfirm={() =>
                                  handleDelete(Registration.id ? Registration.id : "")
                                }
                                headerText={<Trash />}
                                content="Are you sure you want to delete this Registration?"
                              />
                            )}
                            {canEdit && (
                              <EditButton
                                button={buttonElement(Registration.id ?? "")}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No Registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {showRegistrations && selectedId && (
            <EditRegistration
              RegistrationId={selectedId}
              visible={showRegistrations}
              onClose={() => setShowRegistrations(false)}
            />
          )}
          <AddRegistration visible={addModal} onClose={() => setAddModal(false)} />
        </div>

        {filteredRegistration?.Items && filteredRegistration?.Items.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: Array.isArray(filteredRegistration)
                  ? 1
                  : filteredRegistration?.PageIndex ?? 1,
                firstPage: Array.isArray(filteredRegistration)
                  ? 1
                  : filteredRegistration?.FirstPage ?? 1,
                lastPage: Array.isArray(filteredRegistration)
                  ? 1
                  : filteredRegistration?.LastPage ?? 1,
                nextPage: Array.isArray(filteredRegistration)
                  ? 1
                  : filteredRegistration?.NextPage ?? 1,
                previousPage: Array.isArray(filteredRegistration)
                  ? 1
                  : filteredRegistration?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllRegistrationForm;