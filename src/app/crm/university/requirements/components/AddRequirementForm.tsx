'use client';

import React, { useState, useMemo } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';
import { AppCombobox } from '@/components/Input/ComboBox';
import { IRequirementFormData, ICourse } from '../types/IRequirement';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { ICountry } from '../../_university/types/ICountry';
import { useGetAllCountries } from '../../_university/hooks';
import { useGetAllDocumentTypesList } from '@/app/crm/documents/_document/hooks';


interface AddRequirementFormProps {
  form: UseFormReturn<IRequirementFormData>;
  courses: ICourse[];
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass = `w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 
  bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
  focus:ring-2 focus:ring-green-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm`;

const labelClass = `block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300`;

export const AddRequirementForm: React.FC<AddRequirementFormProps> = ({
  form,
  courses,
  onClose,
  onSuccess,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<{ id: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError, clearError } = useErrorHandler();

  const { data: countries = [] } = useGetAllCountries();
  const { data: documentTypes = [] } = useGetAllDocumentTypesList();

  // Watch the current documentsCheckListDTOs from form
  const docChecklist = form.watch('documentsCheckListDTOs') ?? [];

  // Filter out already selected document types
  const availableDocumentTypes = useMemo(() => {
    const selectedIds = new Set(docChecklist.map(d => d.documenteTypeId));
    return documentTypes.filter(doc => !selectedIds.has(doc.id));
  }, [documentTypes, docChecklist]);

  const handleAddDocumentType = () => {
    if (!selectedDocType) return;

    form.setValue('documentsCheckListDTOs', [
      ...docChecklist,
      { documenteTypeId: selectedDocType.id },
    ]);
    setSelectedDocType(null);
  };

  const handleRemoveDocumentType = (id: string) => {
    form.setValue(
      'documentsCheckListDTOs',
      docChecklist.filter((d) => d.documenteTypeId !== id)
    );
  };

  const getDocumentTypeName = (id: string) =>
    documentTypes.find((d) => d.id === id)?.name ?? id;

  const handleSubmit = async (data: IRequirementFormData) => {
    clearError();

    if (!data.countryId) {
      setError('Please select a country.');
      return;
    }
    if (!data.courseId) {
      setError('Please select a course.');
      return;
    }
    if (!data.descriptions.trim()) {
      setError('Please enter a description.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/api/AcademicPrograms/AddRequirements', data);
      toast.success('Requirement added successfully!');
      form.reset();
      setSelectedCourse(null);
      setSelectedCountry(null);
      setSelectedDocType(null);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = handleError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <fieldset disabled={isSubmitting} className="min-w-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
          Add New Requirement
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="text-red-400 text-2xl hover:text-red-500"
        >
          <X strokeWidth={3} />
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Requirement Information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-4">
          {/* Country */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Country <span className="text-red-500">*</span>
            </label>
            <AppCombobox
              label="Select Country"
              name="countryId"
              form={form}
              options={countries}
              selected={selectedCountry}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              onSelect={(country) => {
                setSelectedCountry(country);
                form.setValue('countryId', country?.id ?? '', { shouldValidate: true });
                setError(null);
              }}
              getLabel={(country) => country?.name ?? ''}
              getValue={(country) => country?.id ?? ''}
              placeholder="Search country..."
            />
            {form.formState.errors.countryId && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.countryId.message}
              </p>
            )}
          </div>

          {/* Course */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Course <span className="text-red-500">*</span>
            </label>
            <AppCombobox
              label="Select Course"
              name="courseId"
              form={form}
              options={courses}
              selected={selectedCourse}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              onSelect={(course) => {
                setSelectedCourse(course);
                form.setValue('courseId', course?.id ?? '', { shouldValidate: true });
                setError(null);
              }}
              getLabel={(course) => course?.title ?? ''}
              getValue={(course) => course?.id ?? ''}
              placeholder="Search course..."
            />
            {form.formState.errors.courseId && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.courseId.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 mb-4">
          <label className={labelClass}>
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...form.register('descriptions', {
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' },
            })}
            rows={4}
            placeholder="Enter requirement description..."
            className={`${inputClass} resize-none`}
          />
          {form.formState.errors.descriptions && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.descriptions.message}
            </p>
          )}
        </div>

        {/* Document Checklist */}
        <div className="flex flex-col gap-3 mb-6">
          <label className={labelClass}>Document Checklist</label>

          {/* Document type selection field */}
          <div className="w-full">
            <AppCombobox
              label="Select Document Type"
              name="documentTypeSelector"
              form={form}
              options={availableDocumentTypes}
              selected={selectedDocType}
              dropDownWidth="w-full"
              dropdownPositionClass="absolute"
              onSelect={(doc) => setSelectedDocType(doc)}
              getLabel={(doc) => doc?.name ?? ''}
              getValue={(doc) => doc?.id ?? ''}
              placeholder="Search document type..."
            />
          </div>

          {/* Add button - now below the selection field */}
          <div>
            <button
              type="button"
              onClick={handleAddDocumentType}
              disabled={!selectedDocType}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700
                         text-white rounded-lg text-sm font-medium transition-colors
                         disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Add Document Type
            </button>
          </div>

          {/* Added document types list */}
          {docChecklist.length > 0 && (
            <div className="mt-2">
              <label className={`${labelClass} mb-2`}>Added Documents</label>
              <ul className="flex flex-col gap-2">
                {docChecklist.map((doc, index) => (
                  <li
                    key={doc.documenteTypeId}
                    className="flex items-center justify-between px-3 py-2 rounded-lg
                               bg-gray-50 dark:bg-[#1f1f22] border border-gray-200 dark:border-gray-700 text-sm"
                  >
                    <span className="text-gray-700 dark:text-gray-200">
                      <span className="text-gray-400 dark:text-gray-500 mr-2">{index + 1}.</span>
                      {getDocumentTypeName(doc.documenteTypeId)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocumentType(doc.documenteTypeId)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700
                       text-white rounded-lg font-medium shadow-md transition-colors
                       disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Requirement'}
          </button>
        </div>
      </form>
    </fieldset>
  );
};