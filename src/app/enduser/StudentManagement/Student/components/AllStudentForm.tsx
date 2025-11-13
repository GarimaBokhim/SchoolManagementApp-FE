"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { IFilterStudentByDate, IStudent } from "../types/IStudents";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import { PrintButton } from "@/components/Buttons/PrintButton";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { EditButton } from "@/components/Buttons/EditButton";
import { Edit, Filter, Plus, Printer, RotateCcw, Trash } from "lucide-react";
import EditStudent from "../pages/Edit";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import {
  useFilterStudentByDate,
  useGetAllStudents,
  useRemoveStudent,
} from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import Certificate from "./IndividualStudentPrintForm";
import AddStudent from "../pages/Add";
import DeleteButton from "@/components/Buttons/DeleteButton";
const AllStudentForm = () => {
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
  const [showStudents, setShowStudents] = useState(false);
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
          setShowStudents(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");
  const { data: allStudent } = useGetAllStudents();
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(
    ""
  );
  const fullQuery = query + (params || "");
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const {
    data: filteredStudent,
    refetch,
    isLoading,
  } = useFilterStudentByDate(fullQuery);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const form = useForm<IFilterStudentByDate>({
    defaultValues: {
      firstName: "",
      startDate: "",
      endDate: "",
    },
  });

  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterStudentByDate> = async (formData) => {
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
  const deleteStudent = useRemoveStudent();
  const handleDelete = async (id: string) => {
    try {
      await deleteStudent.mutateAsync(id);
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
      <div className="p-3 md:p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
            All Students
          </h1>
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
                  value={selectedStudentName}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Parent Name"
                  name="firstName"
                  form={form}
                  options={allStudent?.Items}
                  selected={
                    allStudent?.Items?.find(
                      (g) => g.firstName === selectedStudentName
                    ) || null
                  }
                  onSelect={(group) => {
                    setSelectedStudentName(group ? group.firstName : null);
                  }}
                  getLabel={(g) => g?.firstName ?? ""}
                  getValue={(g) => g?.firstName ?? ""}
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
                <th className="px-4 py-3 text-left">Reg. No</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  Gender
                </th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left hidden xl:table-cell">
                  Address
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  Phone
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  DOB
                </th>
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
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudent?.Items?.length ? (
                filteredStudent.Items.map(
                  (student: IStudent, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{student.firstName}</td>
                      <td className="py-3 px-4">
                        {student.registrationNumber}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {student.genderStatus === 0 ? "M" : "F"}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {student.email}
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        {student.address}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {student.phoneNumber}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {`${student.dateOfBirth}`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2 flex-wrap">
                          {canDelete && (
                            <DeleteButton
                              onConfirm={() =>
                                handleDelete(student.id ? student.id : "")
                              }
                              headerText={<Trash />}
                              content="Are you sure you want to delete this student?"
                            />
                          )}
                          {canEdit && (
                            <EditButton
                              button={
                                <ButtonElement
                                  icon={<Edit size={14} />}
                                  type="button"
                                  text=""
                                  onClick={() => {
                                    setShowStudents(true);
                                    setSelectedId(student.id ?? "");
                                  }}
                                  className="!text-xs !bg-teal-500"
                                />
                              }
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
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredStudent && filteredStudent?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: filteredStudent?.PageIndex ?? 1,
                firstPage: filteredStudent?.FirstPage ?? 1,
                lastPage: filteredStudent?.LastPage ?? 1,
                nextPage: filteredStudent?.NextPage ?? 1,
                previousPage: filteredStudent?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
        {showStudents && selectedId && (
          <EditStudent
            StudentId={selectedId}
            visible={showStudents}
            onClose={() => setShowStudents(false)}
          />
        )}
        <AddStudent visible={addModal} onClose={() => setAddModal(false)} />
      </div>
    </>
  );
};

export default AllStudentForm;
