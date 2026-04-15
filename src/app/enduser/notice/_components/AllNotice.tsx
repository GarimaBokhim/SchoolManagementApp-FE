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
import {
  EyeIcon,
  Filter,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import {
  useFilterNoticeByDate,
  usePublishNotice,
  useUnPublishNotice,
  useDeleteNotice,
} from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddNotice from "../pages/Add";
import { EditButton } from "@/components/Buttons/EditButton";
import GenerateNotice from "./GenerateNotice";

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
  const [selectedNoticeName, setSelectedNoticeName] = useState<string | null>("");
  const publishNotice = usePublishNotice();
  const unPublishNotice = useUnPublishNotice();
  const deleteNotice = useDeleteNotice();

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [noticeToEdit, setNoticeToEdit] = useState<INotice | null>(null);

  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  const [viewNotice, setViewNotice] = useState<boolean>(false);
  const [selectedNotice, setSelectedNotice] = useState<INotice>();

  const { handleError, clearError } = useErrorHandler();

  const handleDelete = async (notice: INotice) => {
    if (!confirm(`Are you sure you want to delete "${notice.title}"?`)) return;
    clearError();
    try {
      await toast.promise(
        deleteNotice.mutateAsync(notice.id as string),
        {
          loading: "Deleting notice...",
          success: "Notice deleted successfully",
          error: "Failed to delete notice",
        }
      );
      refetch();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  const handleEdit = (notice: INotice) => {
    setNoticeToEdit(notice);
    setEditModal(true);
  };

  const buttonElement = (notice: INotice) => {
    return (
      <div className="flex items-center justify-end gap-2">
        {/* View */}
        <ButtonElement
          type="button"
          icon={<EyeIcon size={16} />}
          text=""
          onClick={() => {
            setSelectedNotice(notice);
            setViewNotice(true);
          }}
          className="!bg-blue-500 hover:!bg-blue-600"
        />

        {/* Edit */}
        <ButtonElement
          type="button"
          icon={<Pencil size={16} />}
          text=""
          onClick={() => handleEdit(notice)}
          className="!bg-yellow-500 hover:!bg-yellow-600"
        />

        {/* Delete */}
        <ButtonElement
          type="button"
          icon={<Trash2 size={16} />}
          text=""
          onClick={() => handleDelete(notice)}
          className="!bg-red-500 hover:!bg-red-600"
        />
      </div>
    );
  };

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
          error: "Failed to fetch data",
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  const handleTogglePublish = async (notice: INotice) => {
    try {
      await toast.promise(
        (async () => {
          if (notice.publishStatus === 1) {
            publishNotice.mutateAsync({ noticeId: notice.id as string });
          } else {
            unPublishNotice.mutateAsync({ noticeId: notice.id as string });
          }
          await refetch();
        })(),
        {
          loading:
            notice.publishStatus === 0 ? "Unpublishing..." : "Publishing...",
          success:
            notice.publishStatus === 0
              ? "Notice unpublished"
              : "Notice published",
          error: "Failed to update publish status",
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
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
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Notices</h1>
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

          <div className="flex flex-col gap-4 p-4">
            {isLoading ? (
              <div className="col-span-full text-center text-gray-500">
                Loading Notices...
              </div>
            ) : filteredNotice?.Items && filteredNotice.Items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white dark:bg-[#3a3a3a] rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#2f2f2f] text-left">
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Notice Title
                      </th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Short Description
                      </th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Status
                      </th>
                      <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 text-right">
                        Quick Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotice.Items.map(
                      (notice: INotice, index: number) => (
                        <tr
                          key={index}
                          className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#444] transition"
                        >
                          <td className="px-6 py-2">
                            <div className="flex flex-col gap-1 max-w-[220px]">
                              <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                                {notice.title}
                              </h3>
                              <span
                                className={`w-fit text-xs px-2 py-0.5 rounded-full font-medium ${
                                  notice.publishStatus === 0
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                {notice.publishStatus === 0
                                  ? "Published"
                                  : "Unpublished"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 max-w-md">
                              {notice.shortDescription}
                            </p>
                          </td>
                          <td className="px-6 py-2">
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs font-medium ${
                                  notice.publishStatus === 1
                                    ? "text-gray-500"
                                    : "text-emerald-600"
                                }`}
                              >
                                Unpublished
                              </span>
                              <button
                                onClick={() => handleTogglePublish(notice)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                  notice.publishStatus === 0
                                    ? "bg-emerald-600"
                                    : "bg-gray-300 dark:bg-gray-600"
                                }`}
                              >
                                <span
                                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                    notice.publishStatus === 0
                                      ? "translate-x-5"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                              <span
                                className={`text-xs font-medium ${
                                  notice.publishStatus === 0
                                    ? "text-emerald-600"
                                    : "text-gray-500"
                                }`}
                              >
                                Published
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-2 text-right">
                            <EditButton button={buttonElement(notice)} />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="col-span-full text-center text-gray-500 italic">
                No Notices found.
              </div>
            )}
          </div>

          {/* Add Modal */}
          <AddNotice
            visible={addModal}
            onClose={() => setAddModal(false)}
          />

          {/* Edit Modal — now passes noticeToEdit */}
          <AddNotice
            visible={editModal}
            noticeToEdit={noticeToEdit}
            onClose={() => {
              setEditModal(false);
              setNoticeToEdit(null);
            }}
          />
        </div>

        {selectedNotice && viewNotice && (
          <GenerateNotice
            notice={selectedNotice}
            onClose={() => setViewNotice(!viewNotice)}
          />
        )}

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