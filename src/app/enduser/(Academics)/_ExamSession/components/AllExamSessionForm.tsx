"use client";
import { useEffect, useRef, useState } from "react";
import {
  IAllExamSession,
  IFilterExamSessionByDate,
} from "../types/IExamSession";
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
import { useFilterExamSessionByDate } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddExamSession from "../pages/Add";
const AllExamSessionForm = () => {
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
  const [selectedExamSession, setSelectedExamSession] = useState<string | null>(
    ""
  );
  const [addModal, setAddModal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  const [params, setParams] = useState("");
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const form = useForm<IFilterExamSessionByDate>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    },
  });
  const fullQuery = query + (params || "");

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const {
    data: filteredExamSession,
    refetch,
    isLoading,
  } = useFilterExamSessionByDate(fullQuery);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterExamSessionByDate> = async (
    formData
  ) => {
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
  const { data: allExamSession } = useFilterExamSessionByDate();
  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
    setSelectedExamSession("");
    form.reset();
  };
  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className=" text-xl font-semibold ">All ExamSessions</h1>
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
                  text="Add New ExamSession"
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
                    value={selectedExamSession}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Exam Session"
                    name="name"
                    form={form}
                    options={allExamSession?.Items}
                    selected={
                      allExamSession?.Items?.find(
                        (g) => g.name === selectedExamSession
                      ) || null
                    }
                    onSelect={(group) => {
                      if (group) {
                        setSelectedExamSession(group.id || null);
                      } else {
                        setSelectedExamSession(null);
                      }
                    }}
                    getLabel={(g) => g?.name ?? ""}
                    getValue={(g) => g?.id ?? ""}
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
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Exam Session Name</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading ExamSessions...
                    </td>
                  </tr>
                ) : filteredExamSession?.Items &&
                  filteredExamSession?.Items.length > 0 ? (
                  filteredExamSession?.Items.map(
                    (ExamSession: IAllExamSession, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600  transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{`${ExamSession.date}`}</td>
                        <td className="py-3 px-4">{ExamSession.name}</td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No ExamSessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <AddExamSession
            visible={addModal}
            onClose={() => setAddModal(false)}
          />
        </div>

        {filteredExamSession?.Items &&
          filteredExamSession?.Items.length > 0 && (
            <div className="mt-4">
              <Pagination
                form={handleSubmit}
                pagination={{
                  currentPage: Array.isArray(filteredExamSession)
                    ? 1
                    : filteredExamSession?.PageIndex ?? 1,
                  firstPage: Array.isArray(filteredExamSession)
                    ? 1
                    : filteredExamSession?.FirstPage ?? 1,
                  lastPage: Array.isArray(filteredExamSession)
                    ? 1
                    : filteredExamSession?.LastPage ?? 1,
                  nextPage: Array.isArray(filteredExamSession)
                    ? 1
                    : filteredExamSession?.NextPage ?? 1,
                  previousPage: Array.isArray(filteredExamSession)
                    ? 1
                    : filteredExamSession?.PreviousPage ?? 1,
                }}
                handleSearch={handleSearch}
              />
            </div>
          )}
      </div>
    </>
  );
};

export default AllExamSessionForm;
