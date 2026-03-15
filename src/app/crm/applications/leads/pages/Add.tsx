/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { AppCombobox } from '@/components/Input/ComboBox';
import { useGetAllCountries } from '@/app/crm/university/univer-sity/hooks';
import { useGetCoursesByUniversity, useGetUniversitiesByCountry } from '../hooks/cascadingHooks';

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── API payload shape ─────────────────────────────────────────────────────────

interface InquiryPayload {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: number;
  contactNumber: string;
  permanentAddress: string;
  educationLevel: number;
  // English proficiency
  englishProficiency: number;
  bandScore: number;
  languageRemarks: string;
  // Skill / Training
  skillOrTrainingName: string;
  institutionName: string;
  trainingRemarks: string;
  trainingStartDate: string;
  trainingEndDate: string;
  // Academic
  completionYear: string;
  currentGpa: string;
  previousAcademicQualification: string;
  source: string;
  feedBackOrSuggestion: string;
  // Nested program selection
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

// ── Styles ────────────────────────────────────────────────────────────────────

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`;

// ── Component ─────────────────────────────────────────────────────────────────

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Personal fields ───────────────────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [selectedGender, setSelectedGender] = useState<EnumOption | undefined>(GENDER_OPTIONS[0]);

  // ── Academic fields ───────────────────────────────────────────────────────
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<EnumOption | undefined>(EDUCATION_LEVEL_OPTIONS[0]);
  const [completionYear, setCompletionYear] = useState('');
  const [currentGpa, setCurrentGpa] = useState('');
  const [previousAcademicQualification, setPreviousAcademicQualification] = useState('');
  const [source, setSource] = useState('');

  // ── English proficiency fields ────────────────────────────────────────────
  const [selectedEnglishProficiency, setSelectedEnglishProficiency] = useState<EnumOption | undefined>(ENGLISH_PROFICIENCY_OPTIONS[0]);
  const [bandScore, setBandScore] = useState('');
  const [languageRemarks, setLanguageRemarks] = useState('');

  // ── Skill / Training fields ───────────────────────────────────────────────
  const [skillOrTrainingName, setSkillOrTrainingName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [trainingRemarks, setTrainingRemarks] = useState('');
  const [trainingStartDate, setTrainingStartDate] = useState('');
  const [trainingEndDate, setTrainingEndDate] = useState('');

  // ── Interested Program (cascading) ────────────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState<IdNameOption | undefined>(undefined);
  const [selectedUniversity, setSelectedUniversity] = useState<IdNameOption | undefined>(undefined);
  const [selectedCourse, setSelectedCourse] = useState<IdTitleOption | undefined>(undefined);

  // ── Feedback ──────────────────────────────────────────────────────────────
  const [feedBackOrSuggestion, setFeedBackOrSuggestion] = useState('');

  const comboForm = useForm({
    defaultValues: {
      gender: 1,
      educationLevel: 1,
      englishProficiency: 1,
      countryId: '',
      universityId: '',
      courseId: '',
    },
  });

  // ── Cascading data ────────────────────────────────────────────────────────
  const { data: countries = [], isLoading: countriesLoading } = useGetAllCountries();
  const { data: universities = [], isLoading: universitiesLoading } =
    useGetUniversitiesByCountry(selectedCountry?.id ?? null);
  const { data: courses = [], isLoading: coursesLoading } =
    useGetCoursesByUniversity(selectedUniversity?.id ?? null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCountrySelect = (option: IdNameOption | null) => {
    setSelectedCountry(option ?? undefined);
    setSelectedUniversity(undefined);
    setSelectedCourse(undefined);
    comboForm.setValue('universityId', '');
    comboForm.setValue('courseId', '');
  };

  const handleUniversitySelect = (option: IdNameOption | null) => {
    setSelectedUniversity(option ?? undefined);
    setSelectedCourse(undefined);
    comboForm.setValue('courseId', '');
  };

  const handleCourseSelect = (option: IdTitleOption | null) => {
    setSelectedCourse(option ?? undefined);
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
    setSelectedCountry(undefined);
    setSelectedUniversity(undefined);
    setSelectedCourse(undefined);
    setFeedBackOrSuggestion('');
    comboForm.reset({
      gender: 1,
      educationLevel: 1,
      englishProficiency: 1,
      countryId: '',
      universityId: '',
      courseId: '',
    });
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

    // Build the nested countries payload only if a country was selected
    const countriesPayload: InquiryPayload['countries'] =
      selectedCountry
        ? [
            {
              countryId: selectedCountry.id,
              universities: selectedUniversity
                ? [
                    {
                      universityId: selectedUniversity.id,
                      courseIds: selectedCourse ? [selectedCourse.id] : [],
                    },
                  ]
                : [],
            },
          ]
        : [];

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

  // ── Render ────────────────────────────────────────────────────────────────

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
            <button type="button" onClick={handleClose} className="text-red-400 text-2xl hover:text-red-500">
              <X strokeWidth={3} />
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

            {/* ── Personal Information ───────────────────────────────── */}
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

            {/* ── Academic Information ───────────────────────────────── */}
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

            {/* ── English Proficiency ────────────────────────────────── */}
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

            {/* ── Skill / Training ───────────────────────────────────── */}
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

            {/* ── Interested Program ─────────────────────────────────── */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Interested Program
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start mb-6">

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Country</label>
                <AppCombobox
                  label="" name="countryId" form={comboForm}
                  options={countries} selected={selectedCountry}
                  dropDownWidth="w-full" dropdownPositionClass="absolute"
                  onSelect={handleCountrySelect}
                  getLabel={(o) => o?.name ?? ''} getValue={(o) => o?.id ?? ''}
                  placeholder={countriesLoading ? 'Loading...' : 'Select country...'}
                  disabled={countriesLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>University</label>
                <AppCombobox
                  label="" name="universityId" form={comboForm}
                  options={universities} selected={selectedUniversity}
                  dropDownWidth="w-full" dropdownPositionClass="absolute"
                  onSelect={handleUniversitySelect}
                  getLabel={(o) => o?.name ?? ''} getValue={(o) => o?.id ?? ''}
                  placeholder={
                    !selectedCountry ? 'Select country first'
                    : universitiesLoading ? 'Loading...'
                    : 'Select university...'
                  }
                  disabled={!selectedCountry || universitiesLoading}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Course</label>
                <AppCombobox
                  label="" name="courseId" form={comboForm}
                  options={courses} selected={selectedCourse}
                  dropDownWidth="w-full" dropdownPositionClass="absolute"
                  onSelect={handleCourseSelect}
                  getLabel={(o) => o?.title ?? ''} getValue={(o) => o?.id ?? ''}
                  placeholder={
                    !selectedUniversity ? 'Select university first'
                    : coursesLoading ? 'Loading...'
                    : 'Select course...'
                  }
                  disabled={!selectedUniversity || coursesLoading}
                />
              </div>

            </div>

            {/* ── Feedback ───────────────────────────────────────────── */}
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