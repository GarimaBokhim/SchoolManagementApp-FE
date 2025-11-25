"use client";
import { useEffect, useRef, useState } from "react";
import {
  IAcademicTeam,
  IFilterAcademicTeamByDate,
} from "../types/IAcademicTeam";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { EditButton } from "@/components/Buttons/EditButton";
import { Edit, Filter, Plus, RotateCcw, Trash } from "lucide-react";
import EditAcademicTeam from "../pages/Edit";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useFilterAcademicTeamByDate, useRemoveAcademicTeam } from "../hooks";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddAcademicTeam from "../pages/Add";
import DeleteButton from "@/components/Buttons/DeleteButton";
const AllAcademicTeamForm = () => {
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
  const [showAcademicTeams, setShowAcademicTeams] = useState(false);
  // const [selectedAcademicTeamName, setSelectedAcademicTeamName] = useState<
  //   string | null
  // >("");
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
          setShowAcademicTeams(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  const [params, setParams] = useState("");
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const form = useForm<IFilterAcademicTeamByDate>({
    defaultValues: {
      firstName: "",
      startDate: "",
      endDate: "",
    },
  });
  const fullQuery = query + (params || "");

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const {
    data: filteredAcademicTeam,
    refetch,
    isLoading,
  } = useFilterAcademicTeamByDate(fullQuery);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterAcademicTeamByDate> = async (
    formData
  ) => {
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
  const deleteAcademicTeam = useRemoveAcademicTeam();
  const handleDelete = async (id: string) => {
    try {
      await deleteAcademicTeam.mutateAsync(id);
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
    form.reset();
  };
  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className=" text-xl font-semibold ">All AcademicTeams</h1>
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
                  text="Add New AcademicTeam"
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
                {/* <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedAcademicTeamName}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="AcademicTeam Name"
                    name="firstName"
                    form={form}
                    options={allAcademicTeams?.Items}
                    selected={
                      allAcademicTeams?.Items?.find(
                        (g) => g.fullName === selectedAcademicTeamName
                      ) || null
                    }
                    onSelect={(group) => {
                      if (group) {
                        setSelectedAcademicTeamName(group.fullName || null);
                      } else {
                        setSelectedAcademicTeamName(null);
                      }
                    }}
                    getLabel={(g) => g?.fullName ?? ""}
                    getValue={(g) => g?.fullName ?? ""}
                  />
                </div> */}

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
                  <th className="px-4 py-3 text-left">UserName</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-center w-[180px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading AcademicTeams...
                    </td>
                  </tr>
                ) : filteredAcademicTeam?.Items &&
                  filteredAcademicTeam?.Items.length > 0 ? (
                  filteredAcademicTeam?.Items.map(
                    (AcademicTeam: IAcademicTeam, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600  transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{AcademicTeam.username}</td>
                        <td className="py-3 px-4">{AcademicTeam.email}</td>
                        <td className="py-3 px-4">{AcademicTeam.address}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            {canDelete && (
                              <DeleteButton
                                onConfirm={() =>
                                  handleDelete(
                                    AcademicTeam.id ? AcademicTeam.id : ""
                                  )
                                }
                                headerText={<Trash />}
                                content="Are you sure you want to delete this AcademicTeam?"
                              />
                            )}
                            {canEdit && (
                              <EditButton
                                button={buttonElement(AcademicTeam.id ?? "")}
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
                      No AcademicTeams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {showAcademicTeams && selectedId && (
            <EditAcademicTeam
              AcademicTeamId={selectedId}
              visible={showAcademicTeams}
              onClose={() => setShowAcademicTeams(false)}
            />
          )}
          <AddAcademicTeam
            visible={addModal}
            onClose={() => setAddModal(false)}
          />
        </div>

        {filteredAcademicTeam?.Items &&
          filteredAcademicTeam?.Items.length > 0 && (
            <div className="mt-4">
              <Pagination
                form={handleSubmit}
                pagination={{
                  currentPage: Array.isArray(filteredAcademicTeam)
                    ? 1
                    : filteredAcademicTeam?.PageIndex ?? 1,
                  firstPage: Array.isArray(filteredAcademicTeam)
                    ? 1
                    : filteredAcademicTeam?.FirstPage ?? 1,
                  lastPage: Array.isArray(filteredAcademicTeam)
                    ? 1
                    : filteredAcademicTeam?.LastPage ?? 1,
                  nextPage: Array.isArray(filteredAcademicTeam)
                    ? 1
                    : filteredAcademicTeam?.NextPage ?? 1,
                  previousPage: Array.isArray(filteredAcademicTeam)
                    ? 1
                    : filteredAcademicTeam?.PreviousPage ?? 1,
                }}
                handleSearch={handleSearch}
              />
            </div>
          )}
      </div>
    </>
  );
};

export default AllAcademicTeamForm;
