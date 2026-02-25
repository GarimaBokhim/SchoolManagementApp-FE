"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, GraduationCap, Award, Eye, Send, Filter, RotateCcw, Building2 } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useForm } from "react-hook-form";
import { api } from "../../api/api_helper";

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
  university: string;
  location: string;
}

// University name mapping (you can expand this)
const UNIVERSITY_NAMES: Record<string, string> = {
  "e4c485ed-1292-4287-bb38-64d4f5b1d405": "University Name",
  // Add more as you discover them
};

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
  const [openFilter, setOpenFilter] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  const form = useForm<FilterFormData>({
    defaultValues: {
      search: "",
      university: "",
      location: "",
    },
  });

  // Simple API call to fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get<FilterCourseResponse>(
        'api/AcademicPrograms/FilterCourse'
      );

      if (response.data) {
        setCourses(response.data.Items ?? []);  // Fixed: PascalCase Items
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      Toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter UI functions (UI only)
  const onFilterSubmit = (data: FilterFormData) => {
    Toast.info("Filter feature coming soon");
  };

  const handleClearFilters = () => {
    form.reset({ search: "", university: "", location: "" });
  };

  const handleViewDetails = (courseId: string) => {
    Toast.info(`Viewing course details`);
  };

  const handleApplyNow = (courseId: string) => {
    Toast.success(`Application started!`);
  };

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#1f1f22] border border-gray-300 
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 
    dark:text-white text-sm appearance-none`;

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    const currencyMap: Record<string, string> = {
      'sg': 'SGD',
      'usd': 'USD',
      'eur': 'EUR',
      'gbp': 'GBP'
    };
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyMap[currency.toLowerCase()] || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Explore Courses</h1>
          <div className="flex items-center space-x-3">
            <ButtonElement
              type="button"
              text="Filter"
              icon={<Filter size={14} />}
              onClick={() => setOpenFilter(!openFilter)}
              className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold"
            />
          </div>
        </div>

        {/* Filter panel - UI only */}
        {openFilter && (
          <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <form
              onSubmit={form.handleSubmit(onFilterSubmit)}
              className="flex flex-wrap items-end gap-4 md:gap-6"
            >
              {/* Search */}
              <div className="flex-1 min-w-[200px] flex flex-col gap-1">
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              {/* University */}
              <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  University
                </label>
                <div className="relative">
                  <select
                    {...form.register("university")}
                    className={inputClass}
                  >
                    <option value="">All Universities</option>
                    <option value="e4c485ed-1292-4287-bb38-64d4f5b1d405">University 1</option>
                  </select>
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Location */}
              <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <div className="relative">
                  <select
                    {...form.register("location")}
                    className={inputClass}
                  >
                    <option value="">All Locations</option>
                    <option value="USA">United States</option>
                  </select>
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 ml-auto">
                <ButtonElement
                  type="submit"
                  text="Filter"
                  icon={<Filter size={14} />}
                  className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150 !text-white"
                />
                <ButtonElement
                  type="button"
                  text="Clear"
                  icon={<RotateCcw size={14} />}
                  onClick={handleClearFilters}
                  className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150 !text-white"
                />
              </div>
            </form>
          </div>
        )}

        {/* Results count */}
        <div className="px-4 pb-3 text-sm text-gray-500 dark:text-gray-400">
          Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
        </div>

        {/* Cards Grid - Dynamic from API */}
        <div className="px-4 pb-4">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Course Title */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <GraduationCap size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    {/* University Name */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
                        <Building2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 line-clamp-1">
                          {UNIVERSITY_NAMES[course.universityId] || "University"}
                        </p>
                      </div>
                    </div>

                    {/* Fee and Study Level */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(course.tuationFee, course.currency)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {STUDY_LEVEL_LABELS[course.studyLevel] || `Level ${course.studyLevel}`}
                      </div>
                    </div>

                    {/* Action buttons */}
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
            <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <GraduationCap size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search or filter criteria.
              </p>
              <ButtonElement
                type="button"
                text="Clear Filters"
                onClick={handleClearFilters}
                className="mt-6 !bg-emerald-600 hover:!bg-emerald-700 !text-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCourseForm;