/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { AppCombobox } from '@/components/Input/ComboBox';
import { useGetAllCountries } from '@/app/crm/university/_university/hooks';
import { useGetCoursesByUniversity, useGetUniversitiesByCountry } from '../hooks/cascadingHooks';

interface EnumOption {
  id: number;
  name: string;
}

interface IdNameOption {
  id: string;
  name: string;
}

interface IdTitleOption {
  id: string;
  title: string;
}

// Country selection with universities and courses
interface CountrySelection {
  country: IdNameOption;
  universities: IdNameOption[];
  coursesMap: Record<string, IdTitleOption[]>;
}

const GENDER_OPTIONS: EnumOption[] = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
  { id: 3, name: 'Others' },
];

const EDUCATION_LEVEL_OPTIONS: EnumOption[] = [
  { id: 1, name: 'Plus Two / Intermediate' },
  { id: 2, name: "Bachelor's Degree" },
  { id: 3, name: "Master's Degree" },
  { id: 4, name: 'PhD / Doctorate' },
];

const ENGLISH_PROFICIENCY_OPTIONS: EnumOption[] = [
  { id: 1, name: 'IELTS' },
  { id: 2, name: 'TOEFL' },
  { id: 3, name: 'PTE' },
  { id: 4, name: 'Duolingo' },
  { id: 5, name: 'None' },
];

// API payload shape
interface InquiryPayload {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: number;
  contactNumber: string;
  permanentAddress: string;
  educationLevel: number;
  englishProficiency: number;
  bandScore: number;
  languageRemarks: string;
  skillOrTrainingName: string;
  institutionName: string;
  trainingRemarks: string;
  trainingStartDate: string;
  trainingEndDate: string;
  completionYear: string;
  currentGpa: string;
  previousAcademicQualification: string;
  source: string;
  feedBackOrSuggestion: string;
  countries: {
    countryId: string;
    universities: {
      universityId: string;
      courseIds: string[];
    }[];
  }[];
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Styles
const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`;

// Checkbox Group Component (same as your original)
interface CheckboxGroupProps<T> {
  items: T[];
  selected: T[];
  getLabel: (item: T) => string;
  getId: (item: T) => string;
  onToggle: (item: T) => void;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
}

function CheckboxGroup<T>({
  items,
  selected,
  getLabel,
  getId,
  onToggle,
  loading = false,
  loadingText = 'Loading...',
  emptyText = 'No options available',
}: CheckboxGroupProps<T>) {
  if (loading) return <p className="text-sm text-gray-400 dark:text-gray-500">{loadingText}</p>;
  if (items.length === 0) return <p className="text-sm text-gray-400 dark:text-gray-500">{emptyText}</p>;
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((item) => {
        const id = getId(item);
        const isChecked = selected.some((s) => getId(s) === id);
        return (
          <label key={id} className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(item)}
              className="w-4 h-4 rounded accent-green-500 cursor-pointer"
            />
            <span className={`text-sm transition-colors
              ${isChecked
                ? 'text-green-600 dark:text-green-400 font-medium'
                : 'text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400'
              }`}
            >
              {getLabel(item)}
            </span>
          </label>
        );
      })}
    </div>
  );
}

// Country section with its universities and courses
interface CountrySectionProps {
  country: IdNameOption;
  universities: IdNameOption[];
  selectedUniversities: IdNameOption[];
  coursesMap: Record<string, IdTitleOption[]>;
  onUniversityToggle: (university: IdNameOption) => void;
  onCourseToggle: (universityId: string, course: IdTitleOption) => void;
  onRemoveCountry: () => void;
  universitiesLoading?: boolean;
}

const CountrySection: React.FC<CountrySectionProps> = ({
  country,
  universities,
  selectedUniversities,
  coursesMap,
  onUniversityToggle,
  onCourseToggle,
  onRemoveCountry,
  universitiesLoading = false,
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-6 relative bg-gray-50 dark:bg-gray-800/30">
      <button
        type="button"
        onClick={onRemoveCountry}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
      >
        <X size={18} />
      </button>
      
      <div className="flex flex-col gap-5">
        {/* Country Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Country:
          </span>
          <span className="text-base font-semibold text-green-600 dark:text-green-400">
            {country.name}
          </span>
        </div>

        {/* Universities */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            Universities
            <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">
              — Select one or more
            </span>
          </label>
          <CheckboxGroup<IdNameOption>
            items={universities}
            selected={selectedUniversities}
            getLabel={(u) => u.name}
            getId={(u) => u.id}
            onToggle={onUniversityToggle}
            loading={universitiesLoading}
            loadingText={`Loading universities for ${country.name}...`}
            emptyText={`No universities available for ${country.name}`}
          />
        </div>

        {/* Courses per university */}
        {selectedUniversities.map((uni) => (
          <div key={uni.id} className="ml-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-2">
              <label className="block mb-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
                Courses
                <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">
                  — {uni.name}
                </span>
              </label>
              <UniversityCourses
                universityId={uni.id}
                universityName={uni.name}
                selectedCourses={coursesMap[uni.id] ?? []}
                onToggle={(course) => onCourseToggle(uni.id, course)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Per-university course selector component
interface UniversityCoursesProps {
  universityId: string;
  universityName: string;
  selectedCourses: IdTitleOption[];
  onToggle: (course: IdTitleOption) => void;
}

const UniversityCourses: React.FC<UniversityCoursesProps> = ({
  universityId,
  universityName,
  selectedCourses,
  onToggle,
}) => {
  const { data: courses = [], isLoading } = useGetCoursesByUniversity(universityId);

  if (isLoading) {
    return <p className="text-sm text-gray-400 dark:text-gray-500">Loading courses for {universityName}...</p>;
  }
  
  if (courses.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-gray-500">No courses available for {universityName}</p>;
  }

  return (
    <CheckboxGroup<IdTitleOption>
      items={courses}
      selected={selectedCourses}
      getLabel={(c) => c.title}
      getId={(c) => c.id}
      onToggle={onToggle}
    />
  );
};

// Main Component
const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Personal fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [selectedGender, setSelectedGender] = useState<EnumOption | undefined>(GENDER_OPTIONS[0]);

  // Academic fields
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<EnumOption | undefined>(EDUCATION_LEVEL_OPTIONS[0]);
  const [completionYear, setCompletionYear] = useState('');
  const [currentGpa, setCurrentGpa] = useState('');
  const [previousAcademicQualification, setPreviousAcademicQualification] = useState('');
  const [source, setSource] = useState('');

  // English proficiency fields
  const [selectedEnglishProficiency, setSelectedEnglishProficiency] = useState<EnumOption | undefined>(ENGLISH_PROFICIENCY_OPTIONS[0]);
  const [bandScore, setBandScore] = useState('');
  const [languageRemarks, setLanguageRemarks] = useState('');

  // Skill / Training fields
  const [skillOrTrainingName, setSkillOrTrainingName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [trainingRemarks, setTrainingRemarks] = useState('');
  const [trainingStartDate, setTrainingStartDate] = useState('');
  const [trainingEndDate, setTrainingEndDate] = useState('');

  // Interested Program - Multiple countries
  const [selectedCountries, setSelectedCountries] = useState<IdNameOption[]>([]);
  const [countrySelections, setCountrySelections] = useState<CountrySelection[]>([]);
  const [universitiesData, setUniversitiesData] = useState<Record<string, IdNameOption[]>>({});

  // Feedback
  const [feedBackOrSuggestion, setFeedBackOrSuggestion] = useState('');

  const comboForm = useForm({
    defaultValues: { gender: 1, educationLevel: 1, englishProficiency: 1 },
  });

  // Cascading data
  const { data: countries = [], isLoading: countriesLoading } = useGetAllCountries();

  // Fetch universities for a specific country when needed
  const fetchUniversitiesForCountry = async (countryId: string) => {
    if (universitiesData[countryId]) return;
    
    try {
      const response = await api.get(`/api/AcademicPrograms/UniversityByCountry/${countryId}`);
      const universities = response.data?.Items ?? [];
      setUniversitiesData(prev => ({ ...prev, [countryId]: universities }));
    } catch (error) {
      console.error('Failed to fetch universities:', error);
    }
  };

  // Handle country selection/deselection
  const handleCountryToggle = (country: IdNameOption) => {
    const isSelected = selectedCountries.some(c => c.id === country.id);
    
    if (isSelected) {
      // Remove country
      setSelectedCountries(prev => prev.filter(c => c.id !== country.id));
      setCountrySelections(prev => prev.filter(s => s.country.id !== country.id));
    } else {
      // Add country
      setSelectedCountries(prev => [...prev, country]);
      setCountrySelections(prev => [
        ...prev,
        {
          country,
          universities: [],
          coursesMap: {},
        },
      ]);
      fetchUniversitiesForCountry(country.id);
    }
  };

  const handleRemoveCountry = (countryId: string) => {
    setSelectedCountries(prev => prev.filter(c => c.id !== countryId));
    setCountrySelections(prev => prev.filter(s => s.country.id !== countryId));
  };

  const handleUniversityToggle = (countryId: string, university: IdNameOption) => {
    setCountrySelections(prev => {
      const index = prev.findIndex(s => s.country.id === countryId);
      if (index === -1) return prev;
      
      const updated = [...prev];
      const selection = updated[index];
      const exists = selection.universities.some(u => u.id === university.id);
      
      if (exists) {
        // Remove university and its courses
        const updatedUniversities = selection.universities.filter(u => u.id !== university.id);
        const updatedCoursesMap = { ...selection.coursesMap };
        delete updatedCoursesMap[university.id];
        updated[index] = {
          ...selection,
          universities: updatedUniversities,
          coursesMap: updatedCoursesMap,
        };
      } else {
        // Add university
        updated[index] = {
          ...selection,
          universities: [...selection.universities, university],
        };
      }
      return updated;
    });
  };

  const handleCourseToggle = (countryId: string, universityId: string, course: IdTitleOption) => {
    setCountrySelections(prev => {
      const index = prev.findIndex(s => s.country.id === countryId);
      if (index === -1) return prev;
      
      const updated = [...prev];
      const selection = updated[index];
      const currentCourses = selection.coursesMap[universityId] ?? [];
      const exists = currentCourses.some(c => c.id === course.id);
      
      updated[index] = {
        ...selection,
        coursesMap: {
          ...selection.coursesMap,
          [universityId]: exists
            ? currentCourses.filter(c => c.id !== course.id)
            : [...currentCourses, course],
        },
      };
      return updated;
    });
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setDateOfBirth('');
    setContactNumber('');
    setPermanentAddress('');
    setSelectedGender(GENDER_OPTIONS[0]);
    setSelectedEducationLevel(EDUCATION_LEVEL_OPTIONS[0]);
    setCompletionYear('');
    setCurrentGpa('');
    setPreviousAcademicQualification('');
    setSource('');
    setSelectedEnglishProficiency(ENGLISH_PROFICIENCY_OPTIONS[0]);
    setBandScore('');
    setLanguageRemarks('');
    setSkillOrTrainingName('');
    setInstitutionName('');
    setTrainingRemarks('');
    setTrainingStartDate('');
    setTrainingEndDate('');
    setSelectedCountries([]);
    setCountrySelections([]);
    setUniversitiesData({});
    setFeedBackOrSuggestion('');
    comboForm.reset({ gender: 1, educationLevel: 1, englishProficiency: 1 });
    setError(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Build nested payload for multiple countries
    const countriesPayload: InquiryPayload['countries'] = countrySelections.map(selection => ({
      countryId: selection.country.id,
      universities: selection.universities.map(uni => ({
        universityId: uni.id,
        courseIds: (selection.coursesMap[uni.id] ?? []).map(c => c.id),
      })),
    }));

    const payload: InquiryPayload = {
      fullName,
      email,
      dateOfBirth: dateOfBirth
        ? new Date(dateOfBirth).toISOString()
        : new Date().toISOString(),
      gender: selectedGender?.id ?? 1,
      contactNumber,
      permanentAddress,
      educationLevel: selectedEducationLevel?.id ?? 1,
      englishProficiency: selectedEnglishProficiency?.id ?? 1,
      bandScore: parseFloat(bandScore) || 0,
      languageRemarks,
      skillOrTrainingName,
      institutionName,
      trainingRemarks,
      trainingStartDate,
      trainingEndDate,
      completionYear,
      currentGpa,
      previousAcademicQualification,
      source,
      feedBackOrSuggestion,
      countries: countriesPayload,
    };

    try {
      const response = await api.post('/api/Enrolments/AddInquiry', payload);
      console.log('API Response:', response.data);
      toast.success('Inquiry saved successfully!');
      resetForm();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Submission error:', err);
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.title ||
          JSON.stringify(err.response.data) ||
          'Server error occurred';
        setError(`Error ${err.response.status}: ${errorMessage}`);
        toast.error(`Failed to save inquiry: ${errorMessage}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
        toast.error('Failed to save inquiry. No response from server.');
      } else {
        setError(err.message || 'An unexpected error occurred');
        toast.error('Failed to save inquiry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Render
  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={handleClose}
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a]
                   w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
                   max-h-[95vh] md:max-h-[92vh]
                   rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <fieldset disabled={isSubmitting} className="min-w-0">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add New Inquiry
            </h1>
            <button type="button" onClick={handleClose} className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          )}

          <form id="addLeadModalForm" onSubmit={handleSubmit}>

            {/* Personal Information */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Personal Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                <input type="text" required placeholder="Enter full name"
                  value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                <input type="email" required placeholder="Enter email address"
                  value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" required
                  value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                <AppCombobox
                  label="" name="gender" form={comboForm}
                  options={GENDER_OPTIONS} selected={selectedGender}
                  dropDownWidth="w-full" dropdownPositionClass="absolute"
                  onSelect={(o) => setSelectedGender(o ?? undefined)}
                  getLabel={(o) => o?.name ?? ''} getValue={(o) => o?.id ?? 1}
                  placeholder="Select gender..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Contact Number <span className="text-red-500">*</span></label>
                <input type="tel" required placeholder="Enter phone number"
                  value={contactNumber} onChange={e => setContactNumber(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Permanent Address</label>
                <input type="text" placeholder="Enter permanent address"
                  value={permanentAddress} onChange={e => setPermanentAddress(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Academic Information */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Academic Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Education Level <span className="text-red-500">*</span></label>
                <AppCombobox
                  label="" name="educationLevel" form={comboForm}
                  options={EDUCATION_LEVEL_OPTIONS} selected={selectedEducationLevel}
                  dropDownWidth="w-full" dropdownPositionClass="absolute"
                  onSelect={(o) => setSelectedEducationLevel(o ?? undefined)}
                  getLabel={(o) => o?.name ?? ''} getValue={(o) => o?.id ?? 1}
                  placeholder="Select education level..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Completion Year</label>
                <input type="text" placeholder="e.g., 2024"
                  value={completionYear} onChange={e => setCompletionYear(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Current GPA</label>
                <input type="text" placeholder="e.g., 3.5"
                  value={currentGpa} onChange={e => setCurrentGpa(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Previous Academic Qualification</label>
                <input type="text" placeholder="e.g., Bachelor of Science"
                  value={previousAcademicQualification} onChange={e => setPreviousAcademicQualification(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Source <span className="text-red-500">*</span></label>
                <input type="text" required placeholder="e.g. Website, Referral, Social Media..."
                  value={source} onChange={e => setSource(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* English Proficiency */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              English Proficiency
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Proficiency Type</label>
                <AppCombobox
                  label="" name="englishProficiency" form={comboForm}
                  options={ENGLISH_PROFICIENCY_OPTIONS} selected={selectedEnglishProficiency}
                  dropDownWidth="w-full" dropdownPositionClass="absolute"
                  onSelect={(o) => setSelectedEnglishProficiency(o ?? undefined)}
                  getLabel={(o) => o?.name ?? ''} getValue={(o) => o?.id ?? 1}
                  placeholder="Select proficiency..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Band Score</label>
                <input type="number" step="0.1" min="0" max="9" placeholder="e.g., 7.5"
                  value={bandScore} onChange={e => setBandScore(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Language Remarks</label>
                <input type="text" placeholder="Any remarks about language proficiency"
                  value={languageRemarks} onChange={e => setLanguageRemarks(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Skill / Training */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Skill / Training
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Skill / Training Name</label>
                <input type="text" placeholder="e.g., Web Development"
                  value={skillOrTrainingName} onChange={e => setSkillOrTrainingName(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Institution Name</label>
                <input type="text" placeholder="e.g., Coursera, Local College"
                  value={institutionName} onChange={e => setInstitutionName(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Training Remarks</label>
                <input type="text" placeholder="Any additional remarks"
                  value={trainingRemarks} onChange={e => setTrainingRemarks(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Training Start Date</label>
                <input type="date"
                  value={trainingStartDate} onChange={e => setTrainingStartDate(e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Training End Date</label>
                <input type="date"
                  value={trainingEndDate} onChange={e => setTrainingEndDate(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Interested Program - Multiple Countries with Checkboxes */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Interested Program
            </p>
            
            {/* Countries as checkboxes (matching original styling) */}
            <div className="flex flex-col gap-2 mb-6">
              <label className={labelClass}>
                Countries
                <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">
                  — Select one or more countries
                </span>
              </label>
              <CheckboxGroup<IdNameOption>
                items={countries}
                selected={selectedCountries}
                getLabel={(c) => c.name}
                getId={(c) => c.id}
                onToggle={handleCountryToggle}
                loading={countriesLoading}
                loadingText="Loading countries..."
                emptyText="No countries available"
              />
            </div>
            
            {/* Display each selected country's universities and courses */}
            {countrySelections.map((selection) => (
              <CountrySection
                key={selection.country.id}
                country={selection.country}
                universities={universitiesData[selection.country.id] || []}
                selectedUniversities={selection.universities}
                coursesMap={selection.coursesMap}
                onUniversityToggle={(uni) => handleUniversityToggle(selection.country.id, uni)}
                onCourseToggle={(uniId, course) => handleCourseToggle(selection.country.id, uniId, course)}
                onRemoveCountry={() => handleRemoveCountry(selection.country.id)}
                universitiesLoading={!universitiesData[selection.country.id]}
              />
            ))}

            {/* Feedback or Suggestions */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Feedback or Suggestions
            </p>
            <textarea
              rows={3}
              placeholder="Enter any feedback or suggestions..."
              value={feedBackOrSuggestion}
              onChange={e => setFeedBackOrSuggestion(e.target.value)}
              className={`${inputClass} resize-none`}
            />

            {/* Submit */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700
                           text-white rounded-lg font-medium shadow-md transition-colors
                           disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isSubmitting ? 'Saving...' : 'Save Inquiry'}
              </button>
            </div>

          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddLeadModal;