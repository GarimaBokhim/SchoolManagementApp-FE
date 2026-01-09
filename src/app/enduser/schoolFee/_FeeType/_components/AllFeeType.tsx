"use client";
import { useEffect, useRef, useState } from "react";
import { IFilterFeeType, IFeeType } from "../types/IFeeType";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Filter, Plus, RotateCcw, Trash } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useFilterFeeTypeByDate, useGetAllFeeTypes, useRemoveFeeType } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddFeeType from "../pages/Add";
import DeleteButton from "@/components/Buttons/DeleteButton";
const AllFeeTypeForm = () => {
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
  // const [showFeeTypes, setShowFeeTypes] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd,canDelete } = useMenuPermissionData(menuStatus);
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");
  const { data: allFeeType } = useGetAllFeeTypes();
  const [selectedFeeTypeName, setSelectedFeeTypeName] = useState<string | null>(
    ""
  );
  const fullQuery = query + (params || "");

  const {
    data: filteredFeeType,
    refetch,
    isLoading,
  } = useFilterFeeTypeByDate(fullQuery);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const form = useForm<IFilterFeeType>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    },
  });
  const months = [
    { id: 1, name: "Baisakh" },
    { id: 2, name: "Jestha" },
    { id: 3, name: "Ashadh" },
    { id: 4, name: "Shrawan" },
    { id: 5, name: "Bhadra" },
    { id: 6, name: "Ashwin" },
    { id: 7, name: "Kartik" },
    { id: 8, name: "Mangsir" },
    { id: 9, name: "Poush" },
    { id: 10, name: "Magh" },
    { id: 11, name: "Falgun" },
    { id: 12, name: "Chaitra" },
  ];
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterFeeType> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        formData.name ? `name=${encodeURIComponent(formData.name)}` : null,
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
  const deleteFeeType = useRemoveFeeType();
  const handleDelete = async (id: string) => {
    try {
      await deleteFeeType.mutateAsync(id);
      toast.success("User deleted successfully!");
      refetch();
    } catch {
      toast.error("Error deleting user.");
    }
  };
  const onClearClick = () => {
    refetch();
    setParams("");
    setSelectedFeeTypeName("");
    formRef.current?.handleClear();
    form.reset();
  };
  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className=" text-xl font-semibold ">All FeeTypes</h1>
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
                    value={selectedFeeTypeName}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Fee Type"
                    name="name"
                    form={form}
                    options={allFeeType?.Items}
                    selected={
                      allFeeType?.Items?.find(
                        (g) => g.name === selectedFeeTypeName
                      ) || null
                    }
                    onSelect={(group) => {
                      setSelectedFeeTypeName(group ? group.name : null);
                    }}
                    getLabel={(g) => g?.name ?? ""}
                    getValue={(g) => g?.name ?? ""}
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
                  <th className="px-4 py-3 text-left">S.N</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Month</th>
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
                      Loading FeeTypes...
                    </td>
                  </tr>
                ) : filteredFeeType?.Items?.length ? (
                  filteredFeeType.Items.map(
                    (FeeType: IFeeType, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{FeeType.name}</td>
                        <td className="py-3 px-4">{FeeType.description}</td>
                        <td className="py-3 px-4">
                          {
                            months.find((i) => i.id === FeeType.nameOfMonths)
                              ?.name
                          }
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2 flex-wrap">
                            {canDelete && (
                              <DeleteButton
                                onConfirm={() =>
                                  handleDelete(
                                    FeeType.id ? FeeType.id : ""
                                  )
                                }
                                headerText={<Trash />}
                                content="Are you sure you want to delete this FeeType?"
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
                      colSpan={9}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No FeeTypes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {filteredFeeType && filteredFeeType?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: filteredFeeType?.PageIndex ?? 1,
                firstPage: filteredFeeType?.FirstPage ?? 1,
                lastPage: filteredFeeType?.LastPage ?? 1,
                nextPage: filteredFeeType?.NextPage ?? 1,
                previousPage: filteredFeeType?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
        <AddFeeType visible={addModal} onClose={() => setAddModal(false)} />
      </div>
    </>
  );
};

export default AllFeeTypeForm;
