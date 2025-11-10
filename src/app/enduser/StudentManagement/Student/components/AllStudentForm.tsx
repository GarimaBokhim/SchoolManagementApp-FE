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
import { useFilterStudentByDate, useRemoveStudent } from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { useTranslation } from "react-i18next";
import Certificate from "./IndividualStudentPrintForm";
import AddStudent from "../pages/Add";
import DeleteButton from "@/components/Buttons/DeleteButton";
type Props = {
  form: UseFormReturn<IFilterStudentByDate>;
  onDataFromChild?: (startDate: string | null, endDate: string | null) => void;
};
const AllStudentForm = ({ form, onDataFromChild }: Props) => {
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
  const [showStudents, setShowStudents] = useState(false);
  const [showStudentPrint, setShowStudentPrint] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudent>();
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
  const printButtonElement = (student: IStudent) => {
    return (
      <ButtonElement
        icon={<Printer size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowStudentPrint(true);
          setSelectedStudent(student);
        }}
        className="!text-xs font-bold "
      />
    );
  };
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });
  const {
    data: filteredStudent,
    refetch,
    isLoading,
  } = useFilterStudentByDate(query + (params || ""));
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  useEffect(() => {
    if (onDataFromChild) onDataFromChild(start, end);
  }, [start, end, onDataFromChild]);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterStudentByDate> = async (formData) => {
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
              <h1 className=" text-xl font-semibold ">All students</h1>
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
                    text="Add New student"
                    onClick={() => setAddModal(true)}
                    className="!text-md !font-bold"
                  />
                )}
              </div>
            </div>
            {openFilter && (
              <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-100 overflow-x-auto">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-end gap-4"
                >
                  <DateRangeFilter
                    ref={formRef}
                    form={form}
                    onSubmit={onSubmit}
                    setParams={setParams}
                  />
                  <div className="flex gap-2 ml-auto">
                    <ButtonElement
                      type="submit"
                      text=""
                      icon={<Filter size={14} />}
                      className="!bg-emerald-600 hover:!bg-emerald-700"
                    />
                    <ButtonElement
                      type="button"
                      text=""
                      icon={<RotateCcw size={14} />}
                      onClick={onClearClick}
                      className="!bg-gray-500 hover:!bg-gray-600"
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
                    <th className="px-4 py-3 text-left">Student Name</th>
                    <th className="px-4 py-3 text-left">Registration Number</th>
                    <th className="px-4 py-3 text-left">Gender</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Address</th>
                    <th className="px-4 py-3 text-left">Phone Number</th>
                    <th className="px-4 py-3 text-left">DOB</th>
                    <th className="px-4 py-3 text-center w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        Loading students...
                      </td>
                    </tr>
                  ) : filteredStudent?.Items &&
                    filteredStudent?.Items.length > 0 ? (
                    filteredStudent?.Items.map(
                      (student: IStudent, index: number) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600  transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                        >
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{student.firstName}</td>
                          <td className="py-3 px-4">
                            {student.registrationNumber}
                          </td>
                          <td className="py-3 px-4">
                            {student.genderStatus === 0 ? "M" : "F"}
                          </td>
                          <td className="py-3 px-4">{student.email}</td>
                          <td className="py-3 px-4">{student.address}</td>
                          <td className="py-3 px-4">{student.phoneNumber}</td>
                          <td className="py-3 px-4">{`${student.dateOfBirth}`}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center gap-2">
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
                                  button={buttonElement(student.id ?? "")}
                                />
                              )}
                              <EditButton
                                button={printButtonElement(student)}
                              />
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
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {showStudentPrint && selectedStudent && (
              <Certificate
                student={selectedStudent}
                onClose={() => setShowStudentPrint(false)}
              />
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
        </div>
        {filteredStudent?.Items && filteredStudent?.Items.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: Array.isArray(filteredStudent)
                  ? 1
                  : filteredStudent?.PageIndex ?? 1,
                firstPage: Array.isArray(filteredStudent)
                  ? 1
                  : filteredStudent?.FirstPage ?? 1,
                lastPage: Array.isArray(filteredStudent)
                  ? 1
                  : filteredStudent?.LastPage ?? 1,
                nextPage: Array.isArray(filteredStudent)
                  ? 1
                  : filteredStudent?.NextPage ?? 1,
                previousPage: Array.isArray(filteredStudent)
                  ? 1
                  : filteredStudent?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllStudentForm;
