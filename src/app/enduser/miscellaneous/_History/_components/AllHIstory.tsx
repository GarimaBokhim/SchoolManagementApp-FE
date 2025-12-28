"use client";
import { useEffect, useRef, useState } from "react";
import { IFilterHistory, IHistory } from "../types/IHistory";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Filter, Plus, RotateCcw } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useFilterHistoryByDate } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddHistory from "../pages/Add";
import { useGetAllSchoolItems } from "../../_SchoolItem/hooks";
const AllHistoryForm = () => {
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
  const [addModal, setAddModal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");
  const { data: allSchoolItem } = useGetAllSchoolItems();
  const [selectedSchoolItem, setSelectedSchoolItem] = useState<string | null>(
    ""
  );
  const fullQuery = query + (params || "");

  const {
    data: filteredHistory,
    refetch,
    isLoading,
  } = useFilterHistoryByDate(fullQuery);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const form = useForm<IFilterHistory>({
    defaultValues: {
      schoolItemId: "",
      startDate: "",
      endDate: "",
    },
  });
  const itemStatus = [
    { id: 1, name: "Available" },
    { id: 2, name: "Damaged" },
    { id: 3, name: "Replaced" },
    { id: 4, name: "Lost" },
    { id: 5, name: "Disposed" },
  ];
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterHistory> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        formData.schoolItemId
          ? `schoolItemId=${encodeURIComponent(formData.schoolItemId)}`
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
  // const deleteHistory = useRemoveHistory();
  // const handleDelete = async (id: string) => {
  //   try {
  //     await deleteHistory.mutateAsync(id);
  //     toast.success("User deleted successfully!");
  //     refetch();
  //   } catch {
  //     toast.error("Error deleting user.");
  //   }
  // };
  const onClearClick = () => {
    refetch();
    setParams("");
    setSelectedSchoolItem("");
    formRef.current?.handleClear();
    form.reset();
  };
  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className=" text-xl font-semibold ">All History</h1>
            <div className="flex flex-wrap gap-2 justify-end">
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
                  onClick={() => setAddModal(true)}
                  className="!font-semibold"
                />
              )}
            </div>
          </div>
          {openFilter && (
            <div className="bg-white dark:bg-[#2c2c2c] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col lg:flex-row lg:flex-wrap gap-4"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />
                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedSchoolItem}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="School Item"
                    name="schoolItemId"
                    form={form}
                    options={allSchoolItem?.Items}
                    selected={
                      allSchoolItem?.Items?.find(
                        (g) => g.id === selectedSchoolItem
                      ) || null
                    }
                    onSelect={(group) => {
                      setSelectedSchoolItem(group?.id ?? null);
                    }}
                    getLabel={(g) => g?.name ?? ""}
                    getValue={(g) => g?.id ?? ""}
                  />
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0 lg:ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600"
                  />
                </div>
              </form>
            </div>
          )}
          <div className="overflow-x-auto bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#80878c] text-gray-700 dark:text-white uppercase font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 ">S.N</th>
                  <th className="px-4 py-3 ">School Item</th>
                  <th className="px-4 py-3 ">Prev Status</th>
                  <th className="px-4 py-3 ">Current Status</th>
                  <th className="px-4 py-3 ">Remarks</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-4 text-center text-gray-500 dark:text-gray-300"
                    >
                      Loading History...
                    </td>
                  </tr>
                ) : filteredHistory?.Items?.length ? (
                  filteredHistory.Items.map(
                    (History: IHistory, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          {
                            allSchoolItem?.Items?.find(
                              (i) => i.id === History.schoolItemId
                            )?.name
                          }
                        </td>
                        <td className="py-3 px-4">
                          {
                            itemStatus.find(
                              (i) => i.id === History.previousStatus
                            )?.name
                          }
                        </td>
                        <td className="py-3 px-4">
                          {
                            itemStatus.find(
                              (i) => i.id === History.currentStatus
                            )?.name
                          }
                        </td>
                        <td className="py-3 px-4">{History.remarks}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2 flex-wrap">
                            {/* {canDelete && (
                              <DeleteButton
                                onConfirm={() =>
                                  handleDelete(
                                    History.id ? History.id : ""
                                  )
                                }
                                headerText={<Trash />}
                                content="Are you sure you want to delete this History?"
                              />
                            )} */}
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No History found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {filteredHistory && filteredHistory?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: filteredHistory?.PageIndex ?? 1,
                firstPage: filteredHistory?.FirstPage ?? 1,
                lastPage: filteredHistory?.LastPage ?? 1,
                nextPage: filteredHistory?.NextPage ?? 1,
                previousPage: filteredHistory?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
        <AddHistory visible={addModal} onClose={() => setAddModal(false)} />
      </div>
    </>
  );
};

export default AllHistoryForm;
