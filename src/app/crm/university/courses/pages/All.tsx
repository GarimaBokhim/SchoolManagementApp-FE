"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, ChevronDown, GraduationCap, Award, Eye, Send, Filter, X } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import Pagination from "@/components/Pagination";
import { useForm } from "react-hook-form";
import { useCourses } from "../hooks/useCourses";
import { STUDY_LEVEL_LABELS } from "../types/ICourses";

// Mock scholarship data (you can replace this with real data from your API)
const COURSE_SCHOLARSHIPS: Record<string, boolean> = {
  // This would come from your backend
  "ea454396-eab8-4cbe-8a11-e754f1405f53": true,
};

interface FilterFormData {
  search: string;
  university: string;
  location: string;
}

const AllCourseForm = () => {
  const {
    courses,
    universities,
    loading,
    error,
    totalPages,
    currentPage,
    pageSize,
    setPage,
    setFilters,
    filters,
  } = useCourses(9); // Show 9 items per page (3x3 grid)

  const [openMobileFilter, setOpenMobileFilter] = useState(false);
  
  const form = useForm<FilterFormData>({
    defaultValues: {
      search: "",
      university: "",
      location: "",
    },
  });

  // Get unique locations from universities
  const uniqueLocations = useMemo(() => {
    const locations = universities.map(u => u.country).filter(Boolean);
    return [...new Set(locations)];
  }, [universities]);

  // Handle filter changes
  const onFilterSubmit = (data: FilterFormData) => {
    setFilters({
      pageIndex: 1,
      pageSize: pageSize,
      searchTerm: data.search || undefined,
      universityId: universities.find(u => u.name === data.university)?.id || undefined,
      country: data.location || undefined,
    });
    setPage(1);
    setOpenMobileFilter(false);
  };

  const handleClearFilters = () => {
    form.reset({
      search: "",
      university: "",
      location: "",
    });
    setFilters({
      pageIndex: 1,
      pageSize: pageSize,
    });
    setPage(1);
  };

  const handleViewDetails = (courseId: string) => {
    Toast.info(`Viewing course details`);
    // Navigate to course details page or open modal
    // router.push(`/courses/${courseId}`);
  };

  const handleApplyNow = (courseId: string) => {
    Toast.success(`Application started!`);
    // Navigate to application form
    // router.push(`/courses/${courseId}/apply`);
  };

  // Check if any filters are active
  const hasActiveFilters = form.watch("search") || form.watch("university") || form.watch("location");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Explore Courses & Programs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover thousands of courses from top universities worldwide
            </p>
          </div>

          {/* Desktop Filter Bar - 3 equal columns */}
          <div className="hidden md:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-8">
            <form onSubmit={form.handleSubmit(onFilterSubmit)} className="flex items-end gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search Courses
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by course or university..."
                    {...form.register("search")}
                    className="w-full px-4 py-2.5 pl-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* University Dropdown */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  University
                </label>
                <div className="relative">
                  <select
                    {...form.register("university")}
                    className="w-full px-4 py-2.5 pl-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none dark:text-white"
                  >
                    <option value="">All Universities</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.name}>{uni.name}</option>
                    ))}
                  </select>
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Location Dropdown */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <div className="relative">
                  <select
                    {...form.register("location")}
                    className="w-full px-4 py-2.5 pl-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none dark:text-white"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((loc, index) => (
                      <option key={index} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-2">
                <ButtonElement
                  type="submit"
                  text="Apply"
                  icon={<Filter size={14} />}
                  className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !py-2.5"
                />
                {hasActiveFilters && (
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<X size={14} />}
                    onClick={handleClearFilters}
                    className="!bg-gray-500 hover:!bg-gray-600 !text-white !py-2.5"
                  />
                )}
              </div>
            </form>
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <ButtonElement
              type="button"
              text="Filter Courses"
              icon={<Filter size={16} />}
              onClick={() => setOpenMobileFilter(!openMobileFilter)}
              className="!bg-emerald-600 hover:!bg-emerald-700 !text-white w-full !py-3"
            />
            
            {/* Mobile Filter Panel */}
            {openMobileFilter && (
              <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <form onSubmit={form.handleSubmit(onFilterSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Search Courses
                    </label>
                    <input
                      type="text"
                      placeholder="Search..."
                      {...form.register("search")}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      University
                    </label>
                    <select
                      {...form.register("university")}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      <option value="">All Universities</option>
                      {universities.map((uni) => (
                        <option key={uni.id} value={uni.name}>{uni.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <select
                      {...form.register("location")}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      <option value="">All Locations</option>
                      {uniqueLocations.map((loc, index) => (
                        <option key={index} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <ButtonElement
                      type="submit"
                      text="Apply Filters"
                      className="flex-1 !bg-emerald-600 hover:!bg-emerald-700 !text-white"
                    />
                    <ButtonElement
                      type="button"
                      text="Clear"
                      onClick={handleClearFilters}
                      className="flex-1 !bg-gray-500 hover:!bg-gray-600 !text-white"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            {hasActiveFilters && ' (filtered)'}
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <ButtonElement
                type="button"
                text="Try Again"
                onClick={() => window.location.reload()}
                className="mt-4 !bg-emerald-600 hover:!bg-emerald-700 !text-white"
              />
            </div>
          ) : courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                  >
                    <div className="p-5">
                      {/* Course Title and Scholarship Badge */}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                          {course.title}
                        </h3>
                        {COURSE_SCHOLARSHIPS[course.id] && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-800 ml-2 whitespace-nowrap">
                            <Award size={12} className="mr-1" />
                            Scholarship
                          </span>
                        )}
                      </div>

                      {/* University Name */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        {course.universityName}
                      </p>

                      {/* Location and Study Level */}
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-gray-500 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {course.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap size={12} />
                          {STUDY_LEVEL_LABELS[course.studyLevel] || `Level ${course.studyLevel}`}
                        </span>
                      </div>

                      {/* Fee Information */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Tuition Fee: {course.tuationFee} {course.currency.toUpperCase()}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <ButtonElement
                          icon={<Eye size={14} />}
                          text="View Details"
                          onClick={() => handleViewDetails(course.id)}
                          className="flex-1 !bg-blue-500 hover:!bg-blue-600 !text-white !text-xs !py-2 transition-colors"
                        />
                        <ButtonElement
                          icon={<Send size={14} />}
                          text="Apply Now"
                          onClick={() => handleApplyNow(course.id)}
                          className="flex-1 !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-xs !py-2 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    form={useForm({ defaultValues: { pageSize, pageIndex: currentPage, isPagination: true } })}
                    pagination={{
                      currentPage: currentPage,
                      firstPage: 1,
                      lastPage: totalPages,
                      nextPage: currentPage < totalPages ? currentPage + 1 : currentPage,
                      previousPage: currentPage > 1 ? currentPage - 1 : 1,
                    }}
                    handleSearch={(params) => setPage(params.pageIndex)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <GraduationCap size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              {hasActiveFilters && (
                <ButtonElement
                  type="button"
                  text="Clear Filters"
                  onClick={handleClearFilters}
                  className="mt-6 !bg-emerald-600 hover:!bg-emerald-700 !text-white"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCourseForm;