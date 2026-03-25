"use client";

import { useRef, useState } from "react";
import {
  Search,
  GraduationCap,
  Eye,
  Send,
  Filter,
  RotateCcw,
  Building2,
  Plus,
} from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import { api } from "@/utils/instance";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import AddCourseModal from "./Add";
import { useGetAllUniversities } from "../../_university/hooks";
import { IUniversity } from "../../_university/types/IUniversity";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";

interface Course {
  id: string;
  title: string;
  studyLevel: number;
  tuationFee: number;
  currency: string;
  universityId: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface FilterCourseResponse {
  Items: Course[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

interface FilterFormData {
  search: string;
  startDate: string;
  endDate: string;
}

const STUDY_LEVEL_LABELS: Record<number, string> = {
  1: "Bachelor's Degree",
  2: "Master's Degree",
  3: "PhD / Doctorate",
  4: "Diploma",
  5: "Certificate",
  6: "Foundation",
  7: "English Language",
};

const AllCourseForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);

  const [openFilter, setOpenFilter] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [params, setParams] = useState("");
  const formRef = useRef<DateRangeFilterRef>(null);

  const { data: universitiesData, isLoading: loadingUniversities } =
    useGetAllUniversities();
  const universities: IUniversity[] =
    universitiesData?.Items ?? universitiesData?.items ?? [];

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", startDate: "", endDate: "" },
  });

  const { handleError, clearError } = useErrorHandler();

  // ✅ Now accepts queryParams and sends them to the API
  const fetchCourses = async (queryParams?: string) => {
    setLoadingCourses(true);
    try {
      const paramObj: Record<string, unknown> = {};
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => {
          paramObj[key] = value;
        });
      }
      const response = await api.get<FilterCourseResponse>(
        "api/AcademicPrograms/FilterCourse",
        { params: paramObj }
      );
      if (response.data) {
        setCourses(response.data.Items ?? []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      Toast.error("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  useState(() => {
    fetchCourses();
  });

  const getUniversityName = (universityId: string) =>
    universities.find((u: IUniversity) => u.id === universityId)?.name ??
    "University";

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
          await fetchCourses(fullQuery); // ✅ params now actually sent to API
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
    fetchCourses(); // no params = fetch all
  };

  const handleViewDetails = (_courseId: string) =>
    Toast.info("Viewing course details");
  const handleApplyNow = (_courseId: string) =>
    Toast.success("Application started!");

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#1f1f22] border border-gray-300 
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 
    dark:text-white text-sm appearance-none`;

  const formatCurrency = (amount: number, currency: string) => {
    const currencyMap: Record<string, string> = {
      sg: "SGD",
      usd: "USD",
      eur: "EUR",
      gbp: "GBP",
    };
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyMap[currency.toLowerCase()] || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const loading = loadingCourses || loadingUniversities;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Courses</h1>
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
            <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
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

                {/* Search input + Filter/Clear buttons on the same row */}
                <div className="flex flex-1 items-end gap-2 min-w-[200px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search Courses
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by course or university..."
                        {...form.register("search")}
                        className={inputClass}
                      />
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
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

          {/* Cards Grid */}
          <div className="px-4 pb-4">
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 flex-1">
                          <GraduationCap
                            size={18}
                            className="text-emerald-600 dark:text-emerald-400 flex-shrink-0"
                          />
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
                          <Building2
                            size={16}
                            className="text-emerald-600 dark:text-emerald-400 flex-shrink-0"
                          />
                          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 line-clamp-1">
                            {getUniversityName(course.universityId)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(course.tuationFee, course.currency)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {STUDY_LEVEL_LABELS[course.studyLevel] ||
                            `Level ${course.studyLevel}`}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <ButtonElement
                          icon={<Eye size={14} />}
                          text="View Details"
                          onClick={() => handleViewDetails(course.id)}
                          className="flex-1 !bg-blue-500 hover:!bg-blue-600 !text-white !text-xs !py-2"
                        />
                        <ButtonElement
                          icon={<Send size={14} />}
                          text="Apply Now"
                          onClick={() => handleApplyNow(course.id)}
                          className="flex-1 !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-xs !py-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                      <th className="px-4 py-3 text-left">S.N</th>
                      <th className="px-4 py-3 text-left">Course Title</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">University</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Study Level</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Tuition Fee</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} className="p-4 text-center italic text-gray-500 dark:text-gray-400">
                        No courses found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchCourses();
        }}
      
      />
    </>
  );
};

export default AllCourseForm;