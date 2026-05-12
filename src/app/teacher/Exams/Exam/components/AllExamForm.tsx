"use client";
import { useEffect, useRef, useState } from "react";
import { IExam, IFilterExamByDate } from "../types/IExams";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { EditButton } from "@/components/Buttons/EditButton";
import { Edit, Filter, Plus, RotateCcw, Trash } from "lucide-react";
import EditExam from "../pages/Edit";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useFilterExamByDate, useGetAllExams, useRemoveExam } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddExam from "../pages/Add";
import DeleteButton from "@/components/Buttons/DeleteButton";

const AllExamForm = () => {
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

  const [showExams, setShowExams] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);
  const [selectedId, setSelectedId] = useState<string>("");

  const buttonElement = (id: string) => (
    <ButtonElement
      icon={<Edit size={14} />}
      type="button"
      text=""
      onClick={() => {
        setShowExams(true);
        setSelectedId(id);
      }}
      className="!text-xs font-bold !bg-teal-500"
    />
  );

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });

  const form = useForm<IFilterExamByDate>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    },
  });

  const fullQuery = query + (params || "");

  const {
    data: filteredExam,
    refetch,
    isLoading,
  } = useFilterExamByDate(fullQuery);

  const { data: allExams } = useGetAllExams();
  const [selectedExamName, setSelectedExamName] = useState<string | null>(null);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);

  const onSubmit: SubmitHandler<IFilterExamByDate> = async (formData) => {
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
  const deleteExam = useRemoveExam();

  const handleDelete = async (id: string) => {
    try {
      await deleteExam.mutateAsync(id);
      toast.success("Exam deleted successfully!");
      refetch();
    } catch {
      toast.error("Error deleting exam.");
    }
  };

  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
    setSelectedExamName("");
    form.reset();
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="px-2 md:px-4">
        <div className="overflow-x-auto bg-white dark:bg-[#353535] border border-gray-200 rounded-xl">

          {/* Header and Filter buttons */}
          <div className="flex flex-col md:flex-row w-full justify-between p-3 px-4 pt-4 items-start md:items-center gap-3">
            <h1 className="text-lg md:text-xl font-semibold">All Exams</h1>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700 text-sm md:text-base"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={20} />}
                  type="button"
                  text="Add New Exam"
                  onClick={() => setAddModal(true)}
                  className="!text-sm md:!text-md !font-bold"
                />
              )}
            </div>
          </div>

          {/* Filter Panel */}
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
                    dropDownWidth="w-[25rem]"
                    label="Exam Name"
                    name="name"
                    form={form}
                    dropdownPositionClass="fixed"
                    value={selectedExamName}
                    options={allExams?.Items ?? []}
                    selected={
                      allExams
                        ? allExams?.Items?.find(
                          (g) => g.name === selectedExamName
                        ) ?? null
                        : null
                    }
                    onSelect={(user) => setSelectedExamName(user?.name ?? "")}
                    getLabel={(g) => g?.name ?? ""}
                    getValue={(g) => g?.name ?? ""}
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-[10px] sm:text-xs md:text-sm font-semibold border-b border-gray-200">
                  <th className="px-2 md:px-4 py-3 text-left w-[50px] md:w-[60px]">
                    S.N
                  </th>
                  <th className="px-2 md:px-4 py-3 text-left">Exam Name</th>
                  <th className="px-2 md:px-4 py-3 text-left">Class ID</th>
                  <th className="px-2 md:px-4 py-3 text-left">Subjects</th>
                  <th className="px-2 md:px-4 py-3 text-left">Is Final Exam</th>
                  <th className="px-2 md:px-4 py-3 text-left">Exam Date</th>
                  <th className="px-2 md:px-4 py-3 text-center w-[140px] md:w-[180px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading Exams...
                    </td>
                  </tr>
                ) : filteredExam?.Items?.length ? (
                  filteredExam.Items.map((exam: IExam, index: number) => (
                    <tr
                      key={exam.id ?? index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-3 px-2 md:px-4">{index + 1}</td>
                      <td className="py-3 px-2 md:px-4 break-words max-w-[120px] sm:max-w-none">
                        {exam.name}
                      </td>
                      <td className="py-3 px-2 md:px-4">{exam.classId}</td>
                      <td className="py-3 px-2 md:px-4">
                        {exam.examSubjects?.length ?? 0} subject(s)
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        {exam.isfinalExam ? "Yes" : "No"}
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        {exam.examDate
                          ? new Date(exam.examDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        <div className="flex justify-center flex-wrap gap-1 md:gap-2">
                          {canDelete && (
                            <DeleteButton
                              onConfirm={() => handleDelete(exam.id ?? "")}
                              headerText={<Trash />}
                              content="Are you sure you want to delete this Exam?"
                            />
                          )}
                          {canEdit && (
                            <EditButton button={buttonElement(exam.id ?? "")} />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-gray-500 italic text-sm"
                    >
                      No Exams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {showExams && selectedId && (
            <EditExam
              ExamId={selectedId}
              visible={showExams}
              onClose={() => setShowExams(false)}
            />
          )}

          {/* Add Modal */}
          <AddExam visible={addModal} onClose={() => setAddModal(false)} />
        </div>

        {/* Pagination */}
        {filteredExam?.Items && filteredExam.Items.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: Array.isArray(filteredExam)
                  ? 1
                  : filteredExam?.PageIndex ?? 1,
                firstPage: Array.isArray(filteredExam)
                  ? 1
                  : filteredExam?.FirstPage ?? 1,
                lastPage: Array.isArray(filteredExam)
                  ? 1
                  : filteredExam?.LastPage ?? 1,
                nextPage: Array.isArray(filteredExam)
                  ? 1
                  : filteredExam?.NextPage ?? 1,
                previousPage: Array.isArray(filteredExam)
                  ? 1
                  : filteredExam?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllExamForm;