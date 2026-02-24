"use client";

import { useState } from "react";
import { CalendarDays, Search, GraduationCap, MapPin, ChevronDown, Filter, RotateCcw, Building2, Clock } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";

// Static intake data
const STATIC_INTAKES = [
  {
    id: "1",
    title: "Fall Semester 2024",
    universityName: "Stanford University",
    country: "United States",
    intakeDate: "September 2024",
    applicationDeadline: "April 15, 2024",
    status: "Open",
  },
  {
    id: "2",
    title: "Spring Semester 2025",
    universityName: "Harvard University",
    country: "United States",
    intakeDate: "January 2025",
    applicationDeadline: "October 1, 2024",
    status: "Open",
  },
  {
    id: "3",
    title: "Winter Intake 2024",
    universityName: "University of Oxford",
    country: "United Kingdom",
    intakeDate: "January 2024",
    applicationDeadline: "Closed",
    status: "Closed",
  },
  {
    id: "4",
    title: "Summer Semester 2024",
    universityName: "MIT",
    country: "United States",
    intakeDate: "June 2024",
    applicationDeadline: "February 28, 2024",
    status: "Closing Soon",
  },
  {
    id: "5",
    title: "Fall Semester 2024",
    universityName: "University of Melbourne",
    country: "Australia",
    intakeDate: "July 2024",
    applicationDeadline: "March 30, 2024",
    status: "Open",
  },
  {
    id: "6",
    title: "Winter Intake 2025",
    universityName: "University of Toronto",
    country: "Canada",
    intakeDate: "January 2025",
    applicationDeadline: "September 15, 2024",
    status: "Open",
  },
  {
    id: "7",
    title: "Spring Semester 2024",
    universityName: "University of Cambridge",
    country: "United Kingdom",
    intakeDate: "April 2024",
    applicationDeadline: "December 1, 2023",
    status: "Closed",
  },
  {
    id: "8",
    title: "Fall Semester 2024",
    universityName: "Columbia University",
    country: "United States",
    intakeDate: "September 2024",
    applicationDeadline: "May 1, 2024",
    status: "Open",
  },
  {
    id: "9",
    title: "Summer Intake 2024",
    universityName: "ETH Zurich",
    country: "Switzerland",
    intakeDate: "June 2024",
    applicationDeadline: "January 31, 2024",
    status: "Closing Soon",
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

interface FilterFormData {
  search: string;
  university: string;
  location: string;
}

const AllIntakeForm = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredIntakes, setFilteredIntakes] = useState(STATIC_INTAKES);
  const pageSize = 9;

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", university: "", location: "" },
  });

  // Get unique locations
  const uniqueLocations = [...new Set(STATIC_UNIVERSITIES.map(u => u.country))];

  const onFilterSubmit = (data: FilterFormData) => {
    let filtered = [...STATIC_INTAKES];

    if (data.search) {
      const searchLower = data.search.toLowerCase();
      filtered = filtered.filter(intake => 
        intake.title.toLowerCase().includes(searchLower) ||
        intake.universityName.toLowerCase().includes(searchLower)
      );
    }

    if (data.university) {
      filtered = filtered.filter(intake => intake.universityName === data.university);
    }

    if (data.location) {
      filtered = filtered.filter(intake => intake.country === data.location);
    }

    setFilteredIntakes(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    form.reset({ search: "", university: "", location: "" });
    setFilteredIntakes(STATIC_INTAKES);
    setCurrentPage(1);
  };

  const handleViewDetails = (intakeId: string) => {
    // TODO: Implement view details
  };

  const handleApplyNow = (intakeId: string) => {
    // TODO: Implement apply
  };

  const paginationForm = useForm({
    defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedIntakes = filteredIntakes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredIntakes.length / pageSize);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Open":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
      case "Closed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
      case "Closing Soon":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-200 dark:border-gray-800";
    }
  };

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#1f1f22] border border-gray-300 
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 
    dark:text-white text-sm appearance-none`;

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Intakes</h1>
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

        {/* Filter Panel */}
        {openFilter && (
          <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <form
              onSubmit={form.handleSubmit(onFilterSubmit)}
              className="flex flex-wrap items-end gap-4 md:gap-6"
            >
              {/* Search */}
              <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Search Intakes
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by intake or university..."
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
                  <select {...form.register("university")} className={inputClass}>
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
                  <select {...form.register("location")} className={inputClass}>
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
          Showing {filteredIntakes.length} {filteredIntakes.length === 1 ? 'intake' : 'intakes'}
        </div>

        {/* Cards Grid */}
        <div className="px-4 pb-4">
          {filteredIntakes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedIntakes.map((intake) => (
                <div
                  key={intake.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Intake Title with Calendar Icon */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <CalendarDays size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {intake.title}
                        </h3>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 whitespace-nowrap ${getStatusBadge(intake.status)}`}>
                        {intake.status}
                      </span>
                    </div>

                    {/* Highlighted University Name with Building Icon */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
                        <Building2 size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 line-clamp-1">
                          {intake.universityName}
                        </p>
                      </div>
                    </div>

                    {/* Location and Dates */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{intake.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock size={14} className="text-gray-400" />
                        <span>Intake: {intake.intakeDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <CalendarDays size={14} className="text-gray-400" />
                        <span>Deadline: {intake.applicationDeadline}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4">
                      <ButtonElement
                        icon={<Search size={14} />}
                        text="View Details"
                        onClick={() => handleViewDetails(intake.id)}
                        className="flex-1 !bg-blue-500 hover:!bg-blue-600 !text-white !text-xs !py-2"
                      />
                      <ButtonElement
                        icon={<CalendarDays size={14} />}
                        text="Apply Now"
                        onClick={() => handleApplyNow(intake.id)}
                        className="flex-1 !bg-emerald-600 hover:!bg-emerald-700 !text-white !text-xs !py-2"
                        disabled={intake.status === "Closed"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <CalendarDays size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No intakes found</h3>
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
      {filteredIntakes.length > 0 && totalPages > 1 && (
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

export default AllIntakeForm;