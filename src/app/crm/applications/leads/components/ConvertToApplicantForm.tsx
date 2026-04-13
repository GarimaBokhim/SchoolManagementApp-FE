'use client';

import { UserPlus, X } from 'lucide-react';
import { ConvertToApplicantFormProps } from '../types/ILeads';
import { useGetAllCountries } from '@/app/crm/university/_university/hooks';
import { 
  useGetCoursesByUniversity, 
  useGetUniversitiesByCountry,
  IUniversityByCountry,
  ICourseByUniversity
} from '../hooks/cascadingHooks';
import LeadEnquiryCard from './LeadInquiryCard';
import { AppCombobox } from '@/components/Input/ComboBox'; 
import { ICountry } from '@/app/crm/university/_university/types/ICountry';
import { useForm } from 'react-hook-form';

interface ConversionFormData {
  passportNo: string;
  countryId: string;
  universityId: string;
  courseId: string;
}

const ConvertToApplicantForm = ({
  selectedLead,
  conversionData,
  convertingId,
  onInputChange,
  onSubmit,
  onClose,
}: ConvertToApplicantFormProps) => {
  
  // Use react-hook-form for better integration with AppCombobox
  const form = useForm<ConversionFormData>({
    defaultValues: {
      passportNo: conversionData?.passportNo ?? '',
      countryId: conversionData?.countryId ?? '',
      universityId: conversionData?.universityId ?? '',
      courseId: conversionData?.courseId ?? '',
    },
  });

  const selectedCountryId = form.watch('countryId');
  const selectedUniversityId = form.watch('universityId');
  const passportValue = form.watch('passportNo');

  const { data: countries = [], isLoading: loadingCountries } = useGetAllCountries();
  const { data: universities = [], isLoading: loadingUniversities } =
    useGetUniversitiesByCountry(selectedCountryId || null);
  const { data: courses = [], isLoading: loadingCourses } =
    useGetCoursesByUniversity(selectedUniversityId || null);

  const selectedCountryObj = countries.find((c) => c.id === selectedCountryId) ?? null;
  const selectedUniversityObj = universities.find((u) => u.id === selectedUniversityId) ?? null;
  const selectedCourseObj = courses.find((c) => c.id === form.watch('courseId')) ?? null;

  const handleFormSubmit = (data: ConversionFormData) => {
    // Create a synthetic event to match the expected onInputChange signature
    const syntheticEvent = {
      target: { 
        name: 'passportNo', 
        value: data.passportNo 
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange?.(syntheticEvent);
    
    // Update conversionData with all form values
    const updatedData = {
      ...conversionData,
      passportNo: data.passportNo,
      countryId: data.countryId,
      universityId: data.universityId,
      courseId: data.courseId,
    };
    
    // Call onSubmit with the updated data
    onSubmit?.(updatedData as any);
  };

  const handleCountrySelect = (option: ICountry | null) => {
    form.setValue('countryId', option?.id ?? '');
    form.setValue('universityId', '');
    form.setValue('courseId', '');
  };

  const handleUniversitySelect = (option: IUniversityByCountry | null) => {
    form.setValue('universityId', option?.id ?? '');
    form.setValue('courseId', '');
  };

  const handleCourseSelect = (option: ICourseByUniversity | null) => {
    form.setValue('courseId', option?.id ?? '');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 h-full">

      {/* ── Left Panel: Convert Form ── */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50 flex items-center gap-2">
            <UserPlus size={20} className="text-purple-600" />
            Convert to Applicant
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Converting{' '}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {selectedLead.name}
          </span>{' '}
          to an applicant.
        </p>

        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start">

            {/* Passport Number - With floating label matching AppCombobox exactly */}
            <div className="w-full">
              <div className="relative mt-1">
                <div className="relative items-center flex">
                  <input
                    type="text"
                    id="passportNo"
                    {...form.register('passportNo', { required: 'Passport number is required' })}
                    placeholder="e.g., AB1234567"
                    className={`w-full p-2 py-1.5 border rounded-md outline-none peer placeholder:opacity-0 bg-white dark:bg-[#353535] focus:border-[#4788CD] border-gray-400 dark:border-gray-600 dark:text-white text-sm
                      ${form.formState.errors.passportNo ? 'border-red-500' : 'border-gray-400'}`}
                  />
                  <label
                    htmlFor="passportNo"
                    className={`absolute flex items-center left-1 scale-90 peer-placeholder-shown:scale-100 peer-focus:scale-90 -top-[1.2em] px-2 origin-left peer-placeholder-shown:top-2 peer-focus:-top-[1.1rem] peer-focus:text-[#4788CD] dark:peer-focus:text-gray-200 dark:peer-focus:bg-[#353535] peer-focus:bg-white text-gray-500 transition-all pointer-events-none
                      ${passportValue ? 'bg-white dark:bg-[#353535] dark:text-white' : ''}`}
                  >
                    <span className="text-red-500 text-xl mr-1">*</span>
                    Passport Number
                  </label>
                </div>
                {form.formState.errors.passportNo && (
                  <span className="text-red-500 text-sm mt-1">
                    {form.formState.errors.passportNo.message}
                  </span>
                )}
              </div>
            </div>

            {/* Country Combobox */}
            <div className="w-full">
              <AppCombobox<ICountry>
                label="Country"
                name="countryId"
                form={form}
                required
                options={countries}
                selected={selectedCountryObj ?? undefined}
                onSelect={handleCountrySelect}
                getLabel={(c) => c.name}
                getValue={(c) => c.id}
                placeholder="Search country..."
                disabled={loadingCountries}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
              />
            </div>

            {/* University Combobox */}
            <div className="w-full">
              <AppCombobox<IUniversityByCountry>
                label="University"
                name="universityId"
                form={form}
                required
                options={universities}
                selected={selectedUniversityObj ?? undefined}
                onSelect={handleUniversitySelect}
                getLabel={(u) => u.name}
                getValue={(u) => u.id}
                placeholder="Search university..."
                disabled={!selectedCountryId || loadingUniversities}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
              />
            </div>

            {/* Course Combobox */}
            <div className="w-full">
              <AppCombobox<ICourseByUniversity>
                label="Course"
                name="courseId"
                form={form}
                required
                options={courses}
                selected={selectedCourseObj ?? undefined}
                onSelect={handleCourseSelect}
                getLabel={(c) => c.title}
                getValue={(c) => c.id}
                placeholder="Search course..."
                disabled={!selectedUniversityId || loadingCourses}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
              />
            </div>

          </div>

          <div className="flex justify-end mt-12 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="submit"
              disabled={convertingId === selectedLead.id}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 
                         font-medium shadow-sm transition-all active:scale-95"
            >
              {convertingId === selectedLead.id ? (
                <>
                  <span className="animate-spin border-2 border-white/30 border-t-white rounded-full h-4 w-4" />
                  Converting...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Convert to Applicant
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Right Panel: Lead Enquiry Details ── */}
      <div className="lg:w-80 xl:w-96 shrink-0 lg:border-l border-gray-200 dark:border-gray-800 lg:pl-8 pt-6 lg:pt-0">
        <LeadEnquiryCard leadId={selectedLead.id} leadName={selectedLead.name} />
      </div>

    </div>
  );
};

export default ConvertToApplicantForm;