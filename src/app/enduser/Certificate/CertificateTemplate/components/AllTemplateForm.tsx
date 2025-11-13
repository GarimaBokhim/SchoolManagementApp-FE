"use client";
import { useEffect, useRef, useState } from "react";
import { ITemplate, IFilterTemplateByDate } from "../types/ITemplate";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { EditButton } from "@/components/Buttons/EditButton";
import { Edit, Filter, Plus, RotateCcw, Trash } from "lucide-react";
import EditTemplate from "../pages/Edit";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useFilterTemplateByDate, useRemoveTemplate } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddTemplate from "../pages/Add";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
type Props = {
  onDataFromChild?: (startDate: string | null, endDate: string | null) => void;
};
const AllTemplateForm = ({ onDataFromChild }: Props) => {
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
  const { data: allSchool } = useGetAllSchool();
  const [showTemplate, setShowTemplate] = useState(false);
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
          setShowTemplate(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const form = useForm<IFilterTemplateByDate>({
    defaultValues: {
      schoolId: "",
      startDate: "",
      endDate: "",
    },
  });
  const fullQuery = query + (params || "");

  const {
    data: filteredTemplate,
    refetch,
    isLoading,
  } = useFilterTemplateByDate(fullQuery);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  useEffect(() => {
    if (onDataFromChild) onDataFromChild(start, end);
  }, [start, end, onDataFromChild]);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterTemplateByDate> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        formData.schoolId
          ? `schoolId=${encodeURIComponent(formData.schoolId)}`
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
      setStart(formData.startDate);
      setEnd(formData.endDate);
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
  const deleteTemplate = useRemoveTemplate();
  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate.mutateAsync(id);
      toast.success("User deleted successfully!");
      refetch();
    } catch {
      toast.error("Error deleting user.");
    }
  };
  const onClearClick = () => {
    refetch();
    setParams("");
    setSelectedSchoolId("");
    formRef.current?.handleClear();
    setStart("");
    form.reset();
    if (onDataFromChild) onDataFromChild(null, null);
    setEnd("");
  };
  return (
    <>
      <Toaster position="top-right" />
      <div className="">
        <div className="md:px-4  px-4 ">
          <div className="overflow-x-auto bg-white dark:bg-[#353535] border border-gray-200 rounded-xl">
            <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
              <h1 className=" text-xl font-semibold ">All Template</h1>
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
                    text="Add New Template"
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
                      dropDownWidth="w-[25rem]"
                      label="School"
                      name="schoolId"
                      form={form}
                      dropdownPositionClass="fixed"
                      value={selectedSchoolId}
                      options={allSchool?.Items ?? []}
                      selected={
                        allSchool
                          ? allSchool?.Items?.find(
                              (g) => g.id === selectedSchoolId
                            ) ?? null
                          : null
                      }
                      onSelect={(user) => setSelectedSchoolId(user?.id ?? "")}
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
                    <th className="px-4 py-3 text-left">Template Name</th>
                    <th className="px-4 py-3 text-left">Template Type</th>
                    <th className="px-4 py-3 text-left">Template Html Path</th>
                    <th className="px-4 py-3 text-left">Template Version</th>
                    <th className="px-4 py-3 text-center w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        Loading Template...
                      </td>
                    </tr>
                  ) : filteredTemplate?.Items &&
                    filteredTemplate?.Items.length > 0 ? (
                    filteredTemplate?.Items.map(
                      (Template: ITemplate, index: number) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600  transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                        >
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{Template.templateName}</td>
                          <td className="py-3 px-4">{Template.templateType}</td>
                          <td className="py-3 px-4">{Template.htmlTemplate}</td>
                          <td className="py-3 px-4">
                            {Template.templateVersion}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center gap-2">
                              {canDelete && (
                                <DeleteButton
                                  onConfirm={() =>
                                    handleDelete(Template.id ? Template.id : "")
                                  }
                                  headerText={<Trash />}
                                  content="Are you sure you want to delete this Template?"
                                />
                              )}
                              {canEdit && (
                                <EditButton
                                  button={buttonElement(Template.id ?? "")}
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
                        No Template found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {showTemplate && selectedId && (
              <EditTemplate
                TemplateId={selectedId}
                visible={showTemplate}
                onClose={() => setShowTemplate(false)}
              />
            )}
            <AddTemplate
              visible={addModal}
              onClose={() => setAddModal(false)}
            />
          </div>
        </div>
        {filteredTemplate?.Items && filteredTemplate?.Items.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: Array.isArray(filteredTemplate)
                  ? 1
                  : filteredTemplate?.PageIndex ?? 1,
                firstPage: Array.isArray(filteredTemplate)
                  ? 1
                  : filteredTemplate?.FirstPage ?? 1,
                lastPage: Array.isArray(filteredTemplate)
                  ? 1
                  : filteredTemplate?.LastPage ?? 1,
                nextPage: Array.isArray(filteredTemplate)
                  ? 1
                  : filteredTemplate?.NextPage ?? 1,
                previousPage: Array.isArray(filteredTemplate)
                  ? 1
                  : filteredTemplate?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllTemplateForm;
