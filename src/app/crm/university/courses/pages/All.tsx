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
import CourseCard from "../components/CourseCard";


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

  const getStudyLevelLabel = (studyLevel: number) =>
    STUDY_LEVEL_LABELS[studyLevel] || `Level ${studyLevel}`;

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
          await fetchCourses(fullQuery);
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
    fetchCourses();
  };

  const handleViewDetails = (_courseId: string) =>
    Toast.info("Viewing course details");
  const handleApplyNow = (_courseId: string) =>
    Toast.success("Application started!");

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#2a2a2e] border border-gray-200
    dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40
    focus:border-emerald-500 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500
    transition-all duration-150`;

  const loading = loadingCourses || loadingUniversities;

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          {/* Skeleton header */}
          <div className="flex justify-between items-center p-3 px-4 pt-4 border-b border-gray-100 dark:border-gray-700">
            <div className="h-6 w-32 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="h-9 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
          </div>
          {/* Skeleton cards */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-700 p-5 space-y-3 animate-pulse">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                <div className="space-y-1.5">
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-4/5" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-14 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                  <div className="h-14 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                </div>
                <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />
              </div>
            ))}
          </div>
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
                  icon={<Plus size={24} />}
                  type="button"
                  text="Add New Course"
                  onClick={() => setIsAddModalOpen(true)}
                  className="!text-md !font-bold"
                />
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {openFilter && (
            <div className="mb-6 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form
                onSubmit={form.handleSubmit(onFilterSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onFilterSubmit}
                  setParams={setParams}
                />

                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by course or university..."
                      {...form.register("search")}
                      className={inputClass}
                    />
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={15}
                    />
                  </div>
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
                  <CourseCard
                    key={course.id}
                    course={course}
                    universityName={getUniversityName(course.universityId)}
                    studyLevelLabel={getStudyLevelLabel(course.studyLevel)}
                    formattedFee={formatCurrency(course.tuationFee, course.currency)}
                    onViewDetails={handleViewDetails}
                    onApplyNow={handleApplyNow}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700/30 flex items-center justify-center mb-4">
                  <GraduationCap size={28} className="text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                  No courses found
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs">
                  Try adjusting your filters or add a new course to get started.
                </p>
                {canAdd && (
                  <ButtonElement
                    type="button"
                    text="Add First Course"
                    icon={<Plus size={24} />}
                    onClick={() => setIsAddModalOpen(true)}
                    className="!mt-5 !text-md !font-bold"
                  />
                )}
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