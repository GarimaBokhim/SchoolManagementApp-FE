"use client";

import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Filter, Plus, RotateCcw, Trash } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";

import DeleteButton from "@/components/Buttons/DeleteButton";
import { useFilterSchoolAwardByDate, useRemoveSchoolAward } from "../hooks";
import { IfilterSchoolAward, ISchoolAward } from "../types/Ischoolaward";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import AddschoolAward from "./Addschoolaward";

const AllSchoolAwardForm = () => {
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

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");
  const fullQuery = query + (params || "");
  const StudentAwardform = useForm<ISchoolAward>()
  const { data, refetch, isLoading } = useFilterSchoolAwardByDate(fullQuery);
  const { data: allSchools } = useGetAllSchool();
  const { menuStatus } = usePermissions();
  const { canAdd, canDelete } = useMenuPermissionData(menuStatus);
  const deleteSchoolAward = useRemoveSchoolAward();
  const [addModal, setAddModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedSchoolId, setselectedSchoolId] = useState<string | null>("");

  const form = useForm<IfilterSchoolAward>({
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const { handleError, clearError } = useErrorHandler();
  const formRef = useRef<DateRangeFilterRef>(null);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

const onSubmit: SubmitHandler<IfilterSchoolAward> = async (formData) => {
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

    setParams(queryParams ? `&${queryParams}` : "");
  } catch (error) {
    const errorMsg = handleError(error);
    Toast.error(errorMsg);
  }
};


 

  const handleDelete = async (id: string) => {
    try {
      await deleteSchoolAward.mutateAsync(id);
      toast.success("School award deleted successfully!");
      refetch();
    } catch {
      toast.error("Error deleting school award.");
    }
  };

  const onClearClick = () => {
    refetch();
    setParams("");
    setselectedSchoolId("");
    formRef.current?.handleClear();
    form.reset();
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex justify-between p-4 items-center">
            <h1 className="text-xl font-semibold">All School Awards</h1>
            <div className="flex gap-2">
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
                />
              )}
            </div>
          </div>

          {openFilter && (
            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-wrap gap-4"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />
                <div className="flex gap-2 ml-auto">
                  <ButtonElement type="submit" text="Filter" icon={<Filter size={14} />} />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500"
                  />
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3">S.N</th>
                  <th className="px-4 py-3">School</th>
                  <th className="px-4 py-3">Awarded By</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Awarded At</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
              {isLoading ? (
                    <tr>
                        <td colSpan={5} className="p-4 text-center">
                        Loading...
                        </td>
                    </tr>
                    ) : data?.Items?.length ? (
                    data.Items.map((award, index) => (
                        <tr key={award.Id} className="border-t">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2"> { allSchools?.Items?.find(  (i) => i.id === award.schoolId )?.name}</td>
                        <td className="px-4 py-2">{award.awardedBy}</td>
                        <td className="px-4 py-2">{award.awardDescriptions}</td>
                        <td className="px-4 py-2"> {new Date(award.awardedAt).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                       {canDelete && award.Id && (
                        <DeleteButton
                          onConfirm={async () => {
                            await deleteSchoolAward.mutateAsync(award.Id);
                            toast.success("School award deleted successfully!");
                          }}
                          headerText={<Trash />}
                          content="Are you sure you want to delete this School Award?"
                        />
                      )}

                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={5} className="p-4 text-center italic">
                        No School Awards found.
                        </td>
                    </tr>
                    )}


              </tbody>
            </table>
          </div>
        </div>

            {data && data?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: data.PageIndex,
                firstPage: data.FirstPage,
                lastPage: data.LastPage,
                nextPage: data.NextPage,
                previousPage: data.PreviousPage,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}

        <AddschoolAward form={StudentAwardform} visible={addModal} onClose={() => setAddModal(false)} />
      </div>
    </>
  );
};

export default AllSchoolAwardForm;
