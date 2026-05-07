// src/app/crm/applications/leads/components/LeadEnquiryCard.tsx
'use client';

import { MapPin, Building2, BookOpen, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useLeadEnquiryDetails } from '../hooks';

interface LeadEnquiryCardProps {
  leadId: string;
  leadName: string;
}

const LeadEnquiryCard = ({ leadId, leadName }: LeadEnquiryCardProps) => {
  const { data, isLoading, isError } = useLeadEnquiryDetails(leadId);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [expandedUniversity, setExpandedUniversity] = useState<string | null>(null);

  // Deduplicate countries
  const countries = data?.Countries
    ? Array.from(new Map(data.Countries.map((c) => [c.countryId, c])).values())
    : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400 dark:text-gray-500">
        <Loader2 size={28} className="animate-spin text-purple-500" />
        <p className="text-sm">Loading enquiry details...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400 dark:text-gray-500">
        <BookOpen size={28} />
        <p className="text-sm text-center">Could not load enquiry details for this lead.</p>
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400 dark:text-gray-500">
        <MapPin size={28} />
        <p className="text-sm text-center">No enquiry data found for this lead.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Card Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <BookOpen size={15} className="text-purple-500" />
          Lead Enquiry Details
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Interests submitted by{' '}
          <span className="font-medium text-gray-600 dark:text-gray-300">{leadName}</span>
        </p>
      </div>

      {/* Countries List */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
        {countries.map((country) => {
          const isCountryOpen = expandedCountry === country.countryId;

          return (
            <div
              key={country.countryId}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Country Row */}
              <button
                type="button"
                onClick={() =>
                  setExpandedCountry(isCountryOpen ? null : country.countryId)
                }
                className="w-full flex items-center justify-between px-3 py-2.5 
                           bg-purple-50 dark:bg-purple-900/20 
                           hover:bg-purple-100 dark:hover:bg-purple-900/30 
                           transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-purple-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {country.countryId}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded-full">
                    {country.Universities.length}{' '}
                    {country.Universities.length === 1 ? 'uni' : 'unis'}
                  </span>
                  {isCountryOpen ? (
                    <ChevronUp size={14} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-500" />
                  )}
                </div>
              </button>

              {/* Universities */}
              {isCountryOpen && (
                <div className="px-3 py-2 flex flex-col gap-1.5 bg-white dark:bg-[#1a1a1d]">
                  {country.Universities.map((uni) => {
                    const uniKey = `${country.countryId}-${uni.universityId}`;
                    const isUniOpen = expandedUniversity === uniKey;

                    return (
                      <div
                        key={uni.universityId}
                        className="border border-gray-100 dark:border-gray-700/60 rounded-md overflow-hidden"
                      >
                        {/* University Row */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedUniversity(isUniOpen ? null : uniKey)
                          }
                          className="w-full flex items-center justify-between px-2.5 py-2 
                                     bg-gray-50 dark:bg-[#232326] 
                                     hover:bg-gray-100 dark:hover:bg-gray-700/40 
                                     transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Building2 size={12} className="text-blue-500 shrink-0" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                              {uni.universityId}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full">
                              {uni.CourseIds.length}{' '}
                              {uni.CourseIds.length === 1 ? 'course' : 'courses'}
                            </span>
                            {isUniOpen ? (
                              <ChevronUp size={12} className="text-gray-400" />
                            ) : (
                              <ChevronDown size={12} className="text-gray-400" />
                            )}
                          </div>
                        </button>

                        {/* Courses */}
                        {isUniOpen && uni.CourseIds.length > 0 && (
                          <div className="px-3 py-2 flex flex-col gap-1 bg-white dark:bg-[#1f1f22]">
                            {uni.CourseIds.map((courseId) => (
                              <div
                                key={courseId}
                                className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 py-0.5"
                              >
                                <BookOpen size={11} className="text-emerald-500 shrink-0" />
                                <span className="truncate">{courseId}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {isUniOpen && uni.CourseIds.length === 0 && (
                          <div className="px-3 py-1.5 text-xs text-gray-400 dark:text-gray-500 italic bg-white dark:bg-[#1f1f22]">
                            No courses listed
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadEnquiryCard;