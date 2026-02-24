"use client";

import { useState } from "react";
import { Search, MapPin, ChevronDown, GraduationCap, Award, Eye, Send, Filter, RotateCcw, Building2 } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import Pagination from "@/components/Pagination";
import { useForm } from "react-hook-form";

// Static data
const STATIC_COURSES = [
  {
    id: "1",
    title: "Bachelor of Computer Science",
    studyLevel: 1,
    tuationFee: 15000,
    currency: "usd",
    universityId: "uni1",
    universityName: "Stanford University",
    country: "United States",
    hasScholarship: true,
  },
  {
    id: "2",
    title: "Master of Business Administration",
    studyLevel: 2,
    tuationFee: 25000,
    currency: "usd",
    universityId: "uni2",
    universityName: "Harvard University",
    country: "United States",
    hasScholarship: false,
  },
  {
    id: "3",
    title: "PhD in Artificial Intelligence",
    studyLevel: 3,
    tuationFee: 18000,
    currency: "usd",
    universityId: "uni3",
    universityName: "MIT",
    country: "United States",
    hasScholarship: true,
  },
  {
    id: "4",
    title: "Bachelor of Business Administration",
    studyLevel: 1,
    tuationFee: 12000,
    currency: "gbp",
    universityId: "uni4",
    universityName: "University of Oxford",
    country: "United Kingdom",
    hasScholarship: false,
  },
  {
    id: "5",
    title: "Master of Data Science",
    studyLevel: 2,
    tuationFee: 22000,
    currency: "aud",
    universityId: "uni5",
    universityName: "University of Melbourne",
    country: "Australia",
    hasScholarship: true,
  },
  {
    id: "6",
    title: "Bachelor of Engineering",
    studyLevel: 1,
    tuationFee: 14000,
    currency: "cad",
    universityId: "uni6",
    universityName: "University of Toronto",
    country: "Canada",
    hasScholarship: false,
  },
  {
    id: "7",
    title: "Master of Finance",
    studyLevel: 2,
    tuationFee: 20000,
    currency: "usd",
    universityId: "uni2",
    universityName: "Harvard University",
    country: "United States",
    hasScholarship: true,
  },
  {
    id: "8",
    title: "Bachelor of Psychology",
    studyLevel: 1,
    tuationFee: 11000,
    currency: "gbp",
    universityId: "uni7",
    universityName: "University of Cambridge",
    country: "United Kingdom",
    hasScholarship: false,
  },
  {
    id: "9",
    title: "Master of International Relations",
    studyLevel: 2,
    tuationFee: 19000,
    currency: "usd",
    universityId: "uni8",
    universityName: "Columbia University",
    country: "United States",
    hasScholarship: true,
  },
];

const STATIC_UNIVERSITIES = [
  { id: "uni1", name: "Stanford University", country: "United States" },
  { id: "uni2", name: "Harvard University", country: "United States" },
  { id: "uni3", name: "MIT", country: "United States" },
  { id: "uni4", name: "University of Oxford", country: "United Kingdom" },
  { id: "uni5", name: "University of Melbourne", country: "Australia" },
  { id: "uni6", name: "University of Toronto", country: "Canada" },
  { id: "uni7", name: "University of Cambridge", country: "United Kingdom" },
  { id: "uni8", name: "Columbia University", country: "United States" },
  { id: "uni9", name: "ETH Zurich", country: "Switzerland" },
  { id: "uni10", name: "National University of Singapore", country: "Singapore" },
];

const STUDY_LEVEL_LABELS: Record<number, string> = {
  1: "Bachelor's Degree",
  2: "Master's Degree",
  3: "PhD / Doctorate",
  4: "Diploma",
  5: "Certificate",
  6: "Foundation",
  7: "English Language",
};

interface FilterFormData {
  search: string;
  university: string;
  location: string;
}

const AllCourseForm = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCourses, setFilteredCourses] = useState(STATIC_COURSES);
  const pageSize = 9;

  const form = useForm<FilterFormData>({
    defaultValues: {
      search: "",
      university: "",
      location: "",
    },
  });

  // Get unique locations from universities
  const uniqueLocations = [...new Set(STATIC_UNIVERSITIES.map(u => u.country))];

  const onFilterSubmit = (data: FilterFormData) => {
    let filtered = [...STATIC_COURSES];

    if (data.search) {
      const searchLower = data.search.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.universityName.toLowerCase().includes(searchLower)
      );
    }

    if (data.university) {
      filtered = filtered.filter(course => course.universityName === data.university);
    }

    if (data.location) {
      filtered = filtered.filter(course => course.country === data.location);
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    form.reset({ search: "", university: "", location: "" });
    setFilteredCourses(STATIC_COURSES);
    setCurrentPage(1);
  };

  const handleViewDetails = (courseId: string) => {
    Toast.info(`Viewing course details`);
  };

  const handleApplyNow = (courseId: string) => {
    Toast.success(`Application started!`);
  };

  const paginationForm = useForm({
    defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCourses.length / pageSize);

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#1f1f22] border border-gray-300 
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 
    dark:text-white text-sm appearance-none`;

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

        {/* Filter panel */}
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
                    {STATIC_UNIVERSITIES.map((uni) => (
                      <option key={uni.id} value={uni.name}>{uni.name}</option>
                    ))}
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
                    {uniqueLocations.map((loc, index) => (
                      <option key={index} value={loc}>{loc}</option>
                    ))}
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
          Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
        </div>

        {/* Cards Grid */}
        <div className="px-4 pb-4">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Course Title with Graduation Hat Icon */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <GraduationCap size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {course.title}
                        </h3>
                      </div>
                      {course.hasScholarship && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-800 ml-2 whitespace-nowrap">
                          <Award size={12} className="mr-1" />
                          Scholarship
                        </span>
                      )}
                    </div>

                    {/* Highlighted University Name with Building Icon */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
                        <Building2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 line-clamp-1">
                          {course.universityName}
                        </p>
                      </div>
                    </div>

                    {/* Location Only (No Fee) */}
                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-500">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{course.country}</span>
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

      {/* Pagination */}
      {filteredCourses.length > 0 && totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            form={paginationForm}
            pagination={{
              currentPage,
              firstPage: 1,
              lastPage: totalPages,
              nextPage: currentPage < totalPages ? currentPage + 1 : currentPage,
              previousPage: currentPage > 1 ? currentPage - 1 : 1,
            }}
            handleSearch={(params) => setCurrentPage(params.pageIndex)}
          />
        </div>
      )}
    </div>
  );
};

export default AllCourseForm;