"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { IClass, IFilterClassByDate } from "../types/IClass";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { EditButton } from "@/components/Buttons/EditButton";
import { Edit, Filter, Plus, RotateCcw, Trash } from "lucide-react";
import EditClass from "../pages/Edit";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useFilterClassByDate, useGetAllClass, useRemoveClass } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { useTranslation } from "react-i18next";
import AddClass from "../pages/Add";
import DeleteButton from "@/components/Buttons/DeleteButton";
type Props = {
  onDataFromChild?: (startDate: string | null, endDate: string | null) => void;
};
const AllClassForm = ({ onDataFromChild }: Props) => {
  const { t } = useTranslation();
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
  const [showClass, setShowClass] = useState(false);
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
          setShowClass(true);
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
  const form = useForm<IFilterClassByDate>({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    },
  });
  const fullQuery = query + (params || "");

  const {
    data: filteredClass,
    refetch,
    isLoading,
  } = useFilterClassByDate(fullQuery);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const { data: allClass } = useGetAllClass();
  const [selectedClassName, setSelectedClassName] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (onDataFromChild) onDataFromChild(start, end);
  }, [start, end, onDataFromChild]);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterClassByDate> = async (formData) => {
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
  const deleteClass = useRemoveClass();
  const handleDelete = async (id: string) => {
    try {
      await deleteClass.mutateAsync(id);
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
              <h1 className=" text-xl font-semibold ">All Class</h1>
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
                    text="Add New Class"
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
                      label="Class Name"
                      name="name"
                      form={form}
                      dropdownPositionClass="fixed"
                      value={selectedClassName}
                      options={allClass?.Items ?? []}
                      selected={
                        allClass
                          ? allClass?.Items?.find(
                              (g) => g.name === selectedClassName
                            ) ?? null
                          : null
                      }
                      onSelect={(user) =>
                        setSelectedClassName(user?.name ?? "")
                      }
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                    <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                    <th className="px-4 py-3 text-left">Class Name</th>
                    <th className="px-4 py-3 text-center w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        Loading Class...
                      </td>
                    </tr>
                  ) : filteredClass?.Items &&
                    filteredClass?.Items.length > 0 ? (
                    filteredClass?.Items.map((Class: IClass, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600  transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{Class.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-2">
                            {canDelete && (
                              <DeleteButton
                                onConfirm={() =>
                                  handleDelete(Class.id ? Class.id : "")
                                }
                                headerText={<Trash />}
                                content="Are you sure you want to delete this Class?"
                              />
                            )}
                            {canEdit && (
                              <EditButton
                                button={buttonElement(Class.id ?? "")}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-4 text-center text-gray-500 italic"
                      >
                        No Class found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {showClass && selectedId && (
              <EditClass
                ClassId={selectedId}
                visible={showClass}
                onClose={() => setShowClass(false)}
              />
            )}
            <AddClass visible={addModal} onClose={() => setAddModal(false)} />
          </div>
        </div>
        {filteredClass?.Items && filteredClass?.Items.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: Array.isArray(filteredClass)
                  ? 1
                  : filteredClass?.PageIndex ?? 1,
                firstPage: Array.isArray(filteredClass)
                  ? 1
                  : filteredClass?.FirstPage ?? 1,
                lastPage: Array.isArray(filteredClass)
                  ? 1
                  : filteredClass?.LastPage ?? 1,
                nextPage: Array.isArray(filteredClass)
                  ? 1
                  : filteredClass?.NextPage ?? 1,
                previousPage: Array.isArray(filteredClass)
                  ? 1
                  : filteredClass?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllClassForm;
