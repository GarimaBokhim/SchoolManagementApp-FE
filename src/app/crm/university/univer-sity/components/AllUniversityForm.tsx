"use client";

import { useState } from "react";
import { CalendarDays, Search, GraduationCap, MapPin, ChevronDown, Filter, RotateCcw } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm } from "react-hook-form";

interface FilterFormData {
  search: string;
  university: string;
  location: string;
}

const AllIntakeForm = () => {
  const [openFilter, setOpenFilter] = useState(false);

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", university: "", location: "" },
  });

  const onFilterSubmit = (data: FilterFormData) => {
    // TODO: wire up to API when ready
  };

  const handleClearFilters = () => {
    form.reset({ search: "", university: "", location: "" });
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

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-5">
            <CalendarDays size={40} className="text-blue-500 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Intake Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Intake periods, schedules, and enrollment windows are coming soon. Check back later!
          </p>
          <span className="mt-6 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            Coming Soon
          </span>
        </div>

      </div>
    </div>
  );
};

export default AllIntakeForm;