"use client";
import { useEffect, useRef, useState } from "react";
import { INotice, IFilterNotice } from "../types/INotice";
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
import { useFilterNoticeByDate } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddNotice from "../pages/Add";
const AllNoticeForm = () => {
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
  const { data: allNotices } = useFilterNoticeByDate();
  // const [showNotices, setShowNotices] = useState(false);
  const [selectedNoticeName, setSelectedNoticeName] = useState<string | null>(
    ""
  );
  const [addModal, setAddModal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  // const [selectedId, setSelectedId] = useState<string>("");
  // const buttonElement = (id: string) => {
  //   return (
  //     <ButtonElement
  //       icon={<Edit size={14} />}
  //       type="button"
  //       text=""
  //       onClick={() => {
  //         setShowNotices(true);
  //         setSelectedId(id);
  //       }}
  //       className="!text-xs font-bold !bg-teal-500"
  //     />
  //   );
  // };
  const [params, setParams] = useState("");
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const form = useForm<IFilterNotice>({
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
    },
  });
  const fullQuery = query + (params || "");

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const {
    data: filteredNotice,
    refetch,
    isLoading,
  } = useFilterNoticeByDate(fullQuery);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterNotice> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        formData.title ? `title=${encodeURIComponent(formData.title)}` : null,
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
    setSelectedNoticeName("");
    form.reset();
  };
  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className=" text-xl font-semibold ">All Notices</h1>
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
                  text="Add New Notice"
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
                    value={selectedNoticeName}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Notice Name"
                    name="firstName"
                    form={form}
                    options={allNotices?.Items}
                    selected={
                      allNotices?.Items?.find(
                        (g) => g.title === selectedNoticeName
                      ) || null
                    }
                    onSelect={(group) => {
                      if (group) {
                        setSelectedNoticeName(group.title || null);
                      } else {
                        setSelectedNoticeName(null);
                      }
                    }}
                    getLabel={(g) => g?.title ?? ""}
                    getValue={(g) => g?.title ?? ""}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
            {isLoading ? (
              <div className="col-span-full text-center text-gray-500">
                Loading Notices...
              </div>
            ) : filteredNotice?.Items && filteredNotice.Items.length > 0 ? (
              filteredNotice.Items.map((notice: INotice, index: number) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-[#3a3a3a] border border-gray-200 dark:border-gray-600 
                   rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
                      {notice.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {notice.shortDescription}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-4 pt-0">
                    <span className="text-xs text-gray-400">#{index + 1}</span>

                    <div className="flex gap-2">
                      {/* Future action buttons */}
                      {/* <ButtonElement
              type="button"
              text="View"
              className="!text-xs !bg-emerald-600"
            /> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 italic">
                No Notices found.
              </div>
            )}
          </div>

          <AddNotice visible={addModal} onClose={() => setAddModal(false)} />
        </div>

        {filteredNotice?.Items && filteredNotice?.Items.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: Array.isArray(filteredNotice)
                  ? 1
                  : filteredNotice?.PageIndex ?? 1,
                firstPage: Array.isArray(filteredNotice)
                  ? 1
                  : filteredNotice?.FirstPage ?? 1,
                lastPage: Array.isArray(filteredNotice)
                  ? 1
                  : filteredNotice?.LastPage ?? 1,
                nextPage: Array.isArray(filteredNotice)
                  ? 1
                  : filteredNotice?.NextPage ?? 1,
                previousPage: Array.isArray(filteredNotice)
                  ? 1
                  : filteredNotice?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllNoticeForm;
