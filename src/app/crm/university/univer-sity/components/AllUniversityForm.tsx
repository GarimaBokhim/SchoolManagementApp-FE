"use client";

import { useState } from "react";
import { GraduationCap, Search, MapPin, ChevronDown, Filter, RotateCcw, Award, Building2 } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";

// Static university data
const STATIC_UNIVERSITIES = [
  {
    id: "uni1",
    name: "Stanford University",
    country: "United States",
    location: "Stanford, California",
    globalRanking: 3,
    description: "Private research university known for innovation and entrepreneurship",
    programs: 150,
    students: 17000,
  },
  {
    id: "uni2",
    name: "Harvard University",
    country: "United States",
    location: "Cambridge, Massachusetts",
    globalRanking: 1,
    description: "Ivy League research university, oldest institution of higher learning in the US",
    programs: 200,
    students: 21000,
  },
  {
    id: "uni3",
    name: "MIT",
    country: "United States",
    location: "Cambridge, Massachusetts",
    globalRanking: 2,
    description: "World leader in science, engineering, and technology education",
    programs: 120,
    students: 11500,
  },
  {
    id: "uni4",
    name: "University of Oxford",
    country: "United Kingdom",
    location: "Oxford, England",
    globalRanking: 4,
    description: "Oldest university in the English-speaking world",
    programs: 180,
    students: 24000,
  },
  {
    id: "uni5",
    name: "University of Melbourne",
    country: "Australia",
    location: "Melbourne, Victoria",
    globalRanking: 33,
    description: "Australia's leading research university",
    programs: 140,
    students: 50000,
  },
  {
    id: "uni6",
    name: "University of Toronto",
    country: "Canada",
    location: "Toronto, Ontario",
    globalRanking: 18,
    description: "Canada's top research university",
    programs: 160,
    students: 60000,
  },
  {
    id: "uni7",
    name: "University of Cambridge",
    country: "United Kingdom",
    location: "Cambridge, England",
    globalRanking: 5,
    description: "World-renowned collegiate research university",
    programs: 170,
    students: 20000,
  },
  {
    id: "uni8",
    name: "Columbia University",
    country: "United States",
    location: "New York City, New York",
    globalRanking: 7,
    description: "Ivy League university in the heart of NYC",
    programs: 140,
    students: 30000,
  },
  {
    id: "uni9",
    name: "ETH Zurich",
    country: "Switzerland",
    location: "Zurich",
    globalRanking: 8,
    description: "Leading STEM university in continental Europe",
    programs: 100,
    students: 22000,
  },
];

interface FilterFormData {
  search: string;
  country: string;
}

const AllUniversityForm = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUniversities, setFilteredUniversities] = useState(STATIC_UNIVERSITIES);
  const pageSize = 9;

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", country: "" },
  });

  // Get unique countries
  const uniqueCountries = [...new Set(STATIC_UNIVERSITIES.map(u => u.country))];

  const onFilterSubmit = (data: FilterFormData) => {
    let filtered = [...STATIC_UNIVERSITIES];

    if (data.search) {
      const searchLower = data.search.toLowerCase();
      filtered = filtered.filter(uni => 
        uni.name.toLowerCase().includes(searchLower) ||
        uni.location.toLowerCase().includes(searchLower)
      );
    }

    if (data.country) {
      filtered = filtered.filter(uni => uni.country === data.country);
    }

    setFilteredUniversities(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    form.reset({ search: "", country: "" });
    setFilteredUniversities(STATIC_UNIVERSITIES);
    setCurrentPage(1);
  };

  const handleViewDetails = (universityId: string) => {
    // Static UI - no action needed
    console.log("View details clicked for university:", universityId);
  };

  const paginationForm = useForm({
    defaultValues: { pageSize, pageIndex: currentPage, isPagination: true },
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUniversities.length / pageSize);

  const inputClass = `w-full px-4 py-2.5 pl-10 bg-white dark:bg-[#1f1f22] border border-gray-300 
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 
    dark:text-white text-sm appearance-none`;

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Universities</h1>
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
                  Search Universities
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or location..."
                    {...form.register("search")}
                    className={inputClass}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              {/* Country */}
              <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <div className="relative">
                  <select {...form.register("country")} className={inputClass}>
                    <option value="">All Countries</option>
                    {uniqueCountries.map((country, index) => (
                      <option key={index} value={country}>{country}</option>
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
          Showing {filteredUniversities.length} {filteredUniversities.length === 1 ? 'university' : 'universities'}
        </div>

        {/* Cards Grid */}
        <div className="px-4 pb-4">
          {filteredUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedUniversities.map((university) => (
                <div
                  key={university.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-5">
                    {/* University Name with Icon */}
                    <div className="flex items-start gap-2 mb-3">
                      <GraduationCap size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                        {university.name}
                      </h3>
                    </div>

                    {/* Location with Map Pin */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
                        <MapPin size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 line-clamp-1">
                          {university.location}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {university.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                        <Award size={14} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">Rank #{university.globalRanking}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                        <GraduationCap size={14} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">{university.programs}+ Programs</p>
                      </div>
                    </div>

                    {/* Single action button */}
                    <div className="flex gap-2">
                      <ButtonElement
                        icon={<Search size={14} />}
                        text="View Details"
                        onClick={() => handleViewDetails(university.id)}
                        className="w-full !bg-blue-500 hover:!bg-blue-600 !text-white !text-xs !py-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <GraduationCap size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No universities found</h3>
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
      {filteredUniversities.length > 0 && totalPages > 1 && (
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

export default AllUniversityForm;