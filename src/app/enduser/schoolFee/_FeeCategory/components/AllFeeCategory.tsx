"use client";
import { useEffect, useRef, useState } from "react";
import { IFeeCategory, IFilterFeeCategory } from "../types/IFeeCatory";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Filter, Plus, RotateCcw, Pencil, Trash2 } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useFilterFeeCategoryByDate, useRemoveFeeCategory } from "../hooks";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddFeeCategory from "../pages/Add";
const AllFeeCategoryForm = () => {
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
  const { canAdd, canDelete } = useMenuPermissionData(menuStatus);
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");

  const fullQuery = query + (params || "");

  const {
    data: filteredFeeCategory,
    refetch,
    isLoading,
  } = useFilterFeeCategoryByDate(fullQuery);

  const removeFeeCategory = useRemoveFeeCategory();

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const form = useForm<IFilterFeeCategory>({
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);

  const onSubmit: SubmitHandler<IFilterFeeCategory> = async (formData) => {
    clearError();
    try {
      const queryParams = [
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

  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
    form.reset();
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this fee category?")) return;
    try {
      await toast.promise(removeFeeCategory.mutateAsync(id), {
        loading: "Deleting...",
        success: "Fee Category deleted successfully",
      });
      refetch();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Fee Categories</h1>
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
                  <th className="px-4 py-3 text-center">S.N</th>
                  <th className="px-4 py-3 text-center">Name</th>
                  <th className="px-4 py-3 text-center">Description</th>
                  {canDelete && (
                    <th className="px-4 py-3 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-center text-gray-500 dark:text-gray-300"
                    >
                      Loading Fee Categories...
                    </td>
                  </tr>
                ) : filteredFeeCategory?.Items?.length ? (
                  filteredFeeCategory.Items.map(
                    (feeCategory: IFeeCategory, index: number) => (
                      <tr
                        key={feeCategory.id ?? index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100"
                      >
                        <td className="py-3 px-4 text-center">
                          {(paginationParams.pageIndex - 1) *
                            paginationParams.pageSize +
                            index +
                            1}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feeCategory.name}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {feeCategory.description || "-"}
                        </td>
                      
                        {canDelete && (
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <ButtonElement
                                text=""
                                icon={
                                  <Trash2 className="text-white" size={15} />
                                }
                                onClick={() => handleDelete(feeCategory.id)}
                                className="!bg-red-500 hover:!bg-red-600"
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No Fee Categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredFeeCategory && filteredFeeCategory?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: filteredFeeCategory?.PageIndex ?? 1,
                firstPage: filteredFeeCategory?.FirstPage ?? 1,
                lastPage: filteredFeeCategory?.LastPage ?? 1,
                nextPage: filteredFeeCategory?.NextPage ?? 1,
                previousPage: filteredFeeCategory?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}

        <AddFeeCategory
          visible={addModal}
          onClose={() => {
            setAddModal(false);
            refetch();
          }}
        />
      </div>
    </>
  );
};

export default AllFeeCategoryForm;