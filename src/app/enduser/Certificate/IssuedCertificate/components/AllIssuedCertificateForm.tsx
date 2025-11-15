"use client";
import { useEffect, useRef, useState } from "react";
import {
  IIssuedCertificate,
  IFilterIssuedCertificateByDate,
} from "../types/IIssuedCertificate";

import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { EditButton } from "@/components/Buttons/EditButton";
import { Edit, Filter, Plus, Printer, RotateCcw, Trash } from "lucide-react";
import EditIssuedCertificate from "../pages/Edit";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import {
  useFilterIssuedCertificateByDate,
  useRemoveIssuedCertificate,
} from "../hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddIssuedCertificate from "../pages/Add";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useGetAllTemplate } from "../../CertificateTemplate/hooks";
import { useGetAllStudents } from "@/app/enduser/StudentManagement/Student/hooks";
import CollegeCertificate from "./CollegeCertificate";
import SchoolCertificate from "./SchoolCertificate";
type Props = {
  onDataFromChild?: (startDate: string | null, endDate: string | null) => void;
};
const AllIssuedCertificateForm = ({ onDataFromChild }: Props) => {
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
  const [showIssuedCertificate, setShowIssuedCertificate] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);
  const [selectedId, setSelectedId] = useState<string>("");
  const { data: allStudent } = useGetAllStudents();
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowIssuedCertificate(true);
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
  const form = useForm<IFilterIssuedCertificateByDate>({
    defaultValues: {
      templateId: "",
      startDate: "",
      endDate: "",
    },
  });
  const fullQuery = query + (params || "");

  const {
    data: filteredIssuedCertificate,
    refetch,
    isLoading,
  } = useFilterIssuedCertificateByDate(fullQuery);
  const { data: allTemplate } = useGetAllTemplate();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [showStudentPrint, setShowStudentPrint] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [templateId, setTemplateId] = useState<string | null>(null);
  useEffect(() => {
    if (onDataFromChild) onDataFromChild(start, end);
  }, [start, end, onDataFromChild]);
  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);
  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);
  const onSubmit: SubmitHandler<IFilterIssuedCertificateByDate> = async (
    formData
  ) => {
    clearError();
    try {
      const queryParams = [
        formData.templateId
          ? `templateId=${encodeURIComponent(formData.templateId)}`
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
  const deleteIssuedCertificate = useRemoveIssuedCertificate();
  const handleDelete = async (id: string) => {
    try {
      await deleteIssuedCertificate.mutateAsync(id);
      toast.success("User deleted successfully!");
      refetch();
    } catch {
      toast.error("Error deleting user.");
    }
  };
  const onClearClick = () => {
    refetch();
    setParams("");
    setSelectedTemplateId("");
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
              <h1 className=" text-xl font-semibold ">All IssuedCertificate</h1>
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
                    text="Add New IssuedCertificate"
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
                      value={selectedTemplateId}
                      dropDownWidth="w-full"
                      dropdownPositionClass="absolute"
                      label="Template"
                      name="templateId"
                      form={form}
                      options={allTemplate?.Items}
                      selected={
                        allTemplate?.Items?.find(
                          (g) => g.id === selectedTemplateId
                        ) || null
                      }
                      onSelect={(group) => {
                        if (group) {
                          setSelectedTemplateId(group.id || null);
                        } else {
                          setSelectedTemplateId(null);
                        }
                      }}
                      getLabel={(g) => g?.templateName ?? ""}
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
                    <th className="px-4 py-3 text-left">Student Name</th>
                    <th className="px-4 py-3 text-left">Template Name</th>
                    <th className="px-4 py-3 text-left">Certificate Number</th>
                    <th className="px-4 py-3 text-left">Program</th>
                    <th className="px-4 py-3 text-left">Issued Date</th>
                    <th className="px-4 py-3 text-center w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        Loading IssuedCertificate...
                      </td>
                    </tr>
                  ) : filteredIssuedCertificate?.Items &&
                    filteredIssuedCertificate?.Items.length > 0 ? (
                    filteredIssuedCertificate?.Items.map(
                      (
                        IssuedCertificate: IIssuedCertificate,
                        index: number
                      ) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600  transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                        >
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">
                            {
                              allStudent?.Items.find(
                                (i) => i.id === IssuedCertificate.studentId
                              )?.firstName
                            }
                          </td>
                          <td className="py-3 px-4">
                            {
                              allTemplate?.Items.find(
                                (i) => i.id === IssuedCertificate.templateId
                              )?.templateName
                            }
                          </td>
                          <td className="py-3 px-4">
                            {IssuedCertificate.certificateNumber}
                          </td>
                          <td className="py-3 px-4">
                            {IssuedCertificate.program}
                          </td>
                          <td className="py-3 px-4">{`${IssuedCertificate.issuedDate}`}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center gap-2">
                              {canDelete && (
                                <DeleteButton
                                  onConfirm={() =>
                                    handleDelete(
                                      IssuedCertificate.id
                                        ? IssuedCertificate.id
                                        : ""
                                    )
                                  }
                                  headerText={<Trash />}
                                  content="Are you sure you want to delete this IssuedCertificate?"
                                />
                              )}
                              {canEdit && (
                                <EditButton
                                  button={buttonElement(
                                    IssuedCertificate.id ?? ""
                                  )}
                                />
                              )}
                              <EditButton
                                button={
                                  <ButtonElement
                                    icon={<Printer size={14} />}
                                    text=""
                                    type="button"
                                    onClick={() => {
                                      setShowStudentPrint(true);
                                      setTemplateId(
                                        IssuedCertificate.templateId
                                      );
                                      setSelectedStudent(
                                        IssuedCertificate.studentId
                                      );
                                    }}
                                    className="!text-xs"
                                  />
                                }
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
                        No IssuedCertificate found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {showStudentPrint &&
              selectedStudent &&
              templateId &&
              (templateId === "abcbbdbc-2155-40fa-bd8f-a37c93bf6b59" ? (
                <SchoolCertificate
                  studentId={selectedStudent}
                  onClose={() => setShowStudentPrint(false)}
                />
              ) : (
                <CollegeCertificate
                  studentId={selectedStudent}
                  onClose={() => setShowStudentPrint(false)}
                />
              ))}
            {showIssuedCertificate && selectedId && (
              <EditIssuedCertificate
                IssuedCertificateId={selectedId}
                visible={showIssuedCertificate}
                onClose={() => setShowIssuedCertificate(false)}
              />
            )}
            <AddIssuedCertificate
              visible={addModal}
              onClose={() => setAddModal(false)}
            />
          </div>
        </div>
        {filteredIssuedCertificate?.Items &&
          filteredIssuedCertificate?.Items.length > 0 && (
            <div className="mt-4">
              <Pagination
                form={handleSubmit}
                pagination={{
                  currentPage: Array.isArray(filteredIssuedCertificate)
                    ? 1
                    : filteredIssuedCertificate?.PageIndex ?? 1,
                  firstPage: Array.isArray(filteredIssuedCertificate)
                    ? 1
                    : filteredIssuedCertificate?.FirstPage ?? 1,
                  lastPage: Array.isArray(filteredIssuedCertificate)
                    ? 1
                    : filteredIssuedCertificate?.LastPage ?? 1,
                  nextPage: Array.isArray(filteredIssuedCertificate)
                    ? 1
                    : filteredIssuedCertificate?.NextPage ?? 1,
                  previousPage: Array.isArray(filteredIssuedCertificate)
                    ? 1
                    : filteredIssuedCertificate?.PreviousPage ?? 1,
                }}
                handleSearch={handleSearch}
              />
            </div>
          )}
      </div>
    </>
  );
};

export default AllIssuedCertificateForm;
