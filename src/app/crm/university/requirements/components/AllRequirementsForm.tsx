"use client";

import { useState, useEffect, useRef } from "react";
import { Filter, Plus, Edit, BookOpen, MoreVertical, RotateCcw } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { api } from "@/utils/instance";
import AddRequirementsModal from "../pages/Add";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { useForm } from "react-hook-form";

interface RequirementItem {
  id: string;
  descriptions: string;
  courseId: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface ApiResponse {
  Items: RequirementItem[];
  TotalItems: number;
}

interface Course {
  id: string;
  title: string;
}

interface CourseApiResponse {
  Items: Course[];
}

interface FilterFormData {
  search: string;
  startDate: string;
  endDate: string;
}

const AllRequirementsForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus);

  const [requirements, setRequirements] = useState<RequirementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filtered, setFiltered] = useState<RequirementItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [courseMap, setCourseMap] = useState<Record<string, string>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [params, setParams] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<DateRangeFilterRef>(null);

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", startDate: "", endDate: "" },
  });

  const { handleError, clearError } = useErrorHandler();

  const fetchCourses = async () => {
    try {
      const res = await api.get<CourseApiResponse>("api/AcademicPrograms/FilterCourse");
      const items = res.data?.Items ?? [];
      const map: Record<string, string> = {};
      items.forEach((c) => { map[String(c.id)] = c.title; });
      setCourseMap(map);
    } catch {
      toast.error("Failed to load courses.");
    }
  };

  const fetchRequirements = async (queryParams?: string) => {
    try {
      const paramObj: Record<string, unknown> = {};
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => { paramObj[key] = value; });
      }
      const res = await api.get<ApiResponse>(
        "api/AcademicPrograms/FilterRequirements",
        { params: paramObj }
      );
      const items = res.data?.Items ?? [];
      setRequirements(items);
      setFiltered(items);
    } catch {
      toast.error("Failed to load requirements.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCourses();
      await fetchRequirements();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onFilterSubmit = async (formData: FilterFormData) => {
    clearError();
    try {
      const queryParams = [
        formData.search
          ? `search=${encodeURIComponent(formData.search)}`
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
          await fetchRequirements(fullQuery);
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

  const handleClearFilters = () => {
    form.reset({ search: "", startDate: "", endDate: "" });
    setParams("");
    formRef.current?.handleClear();
    fetchRequirements();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/AcademicPrograms/DeleteRequirement/${id}`);
      toast.success("Requirement deleted successfully!");
      fetchRequirements();
    } catch {
      toast.error("Failed to delete requirement.");
    }
  };

  const inputClass = `w-full px-4 py-2.5 pl-4 bg-white dark:bg-[#1f1f22] border border-gray-300
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
    dark:text-white text-sm`;

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Requirements</h1>
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
                  onClick={() => setIsAddModalOpen(true)}
                  className="!font-semibold"
                />
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {openFilter && (
            <div className="bg-white dark:bg-[#2c2c2c] p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 mx-4">
              <form
                onSubmit={form.handleSubmit(onFilterSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                {/* Date Range Quick Filters — Yesterday / 7 Days / This Month / This Year */}
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onFilterSubmit}
                  setParams={setParams}
                />

                {/* Search + Filter/Clear on same row */}
                <div className="flex flex-1 items-end gap-2 min-w-[200px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search Description
                    </label>
                    <input
                      type="text"
                      placeholder="Search by description..."
                      {...form.register("search")}
                      className={inputClass}
                    />
                  </div>
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
                    onClick={handleClearFilters}
                    className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                  <th className="px-4 py-3 text-left">S.N</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Course Name</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Status</th>
                  {(canEdit || canDelete) && (
                    <th className="px-4 py-3 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      Loading requirements...
                    </td>
                  </tr>
                ) : filtered.length ? (
                  filtered.map((req, index) => (
                    <tr
                      key={req.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-emerald-500" />
                          <span>{req.descriptions}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 hidden md:table-cell">
                        {courseMap[req.courseId] ?? "Unknown Course"}
                      </td>
                      <td className="py-2 px-4 hidden lg:table-cell">
                        {req.isActive ? "Active" : "Inactive"}
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="py-2 px-4 text-center">
                          <div
                            className="relative"
                            ref={openMenuId === req.id ? menuRef : null}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === req.id ? null : req.id
                                )
                              }
                            >
                              <MoreVertical size={16} />
                            </button>

                            {openMenuId === req.id && (
                              <div className="absolute right-0 top-8 w-36 bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded shadow-md z-10">
                                {canEdit && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      toast("Edit coming soon");
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <Edit size={14} />
                                    Edit
                                  </button>
                                )}
                                {canDelete && (
                                  <div className="px-1 py-1">
                                    <DeleteButton
                                      onConfirm={() => handleDelete(req.id)}
                                      headerText={<span>Delete</span>}
                                      content="Are you sure you want to delete this requirement?"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center italic">
                      No requirements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddRequirementsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchRequirements();
        }}
      />
    </>
  );
};

export default AllRequirementsForm;