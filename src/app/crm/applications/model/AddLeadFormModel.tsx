'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';

interface InquiryFormData {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: number;
  contactNumber: string;
  permanentAddress: string;
  educationLevel: number;
  completionYear: string;
  currentGpa: string;
  previousAcademicQualification: string;
  source: string;
  feedBackOrSuggestion: string;
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: 1,
    contactNumber: '',
    permanentAddress: '',
    educationLevel: 1,
    completionYear: '',
    currentGpa: '',
    previousAcademicQualification: '',
    source: 'website',
    feedBackOrSuggestion: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'number' || name === 'gender' || name === 'educationLevel') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const apiData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : new Date().toISOString(),
      };

      const response = await api.post('/api/Enrolments/AddInquiry', apiData);
      
      console.log('API Response:', response.data);
      
      toast.success('Inquiry saved successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        dateOfBirth: '',
        gender: 1,
        contactNumber: '',
        permanentAddress: '',
        educationLevel: 1,
        completionYear: '',
        currentGpa: '',
        previousAcademicQualification: '',
        source: 'website',
        feedBackOrSuggestion: '',
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal
      onClose();
      
    } catch (error: any) {
      console.error('Submission error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.title || 
                            JSON.stringify(error.response.data) || 
                            'Server error occurred';
        setError(`Error ${error.response.status}: ${errorMessage}`);
        toast.error(`Failed to save inquiry: ${errorMessage}`);
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
        toast.error('Failed to save inquiry. No response from server.');
      } else {
        setError(error.message || 'An unexpected error occurred');
        toast.error('Failed to save inquiry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Inquiry</h2>
                <p className="text-gray-500 dark:text-gray-400">Create a new student inquiry</p>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <strong className="font-bold">Error: </strong>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <form id="addLeadModalForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column - Personal Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-white">Personal Information</h2>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter email address"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value={1}>Male</option>
                        <option value={2}>Female</option>
                        <option value={3}>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter phone number"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Permanent Address
                      </label>
                      <textarea
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Enter permanent address"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Right column - Academic Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-white">Academic Information</h2>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Education Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value={1}>High School</option>
                        <option value={2}>Bachelor's Degree</option>
                        <option value={3}>Master's Degree</option>
                        <option value={4}>PhD</option>
                        <option value={5}>Diploma</option>
                        <option value={6}>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Completion Year
                      </label>
                      <input
                        type="text"
                        name="completionYear"
                        value={formData.completionYear}
                        onChange={handleChange}
                        placeholder="e.g., 2024"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current GPA
                      </label>
                      <input
                        type="text"
                        name="currentGpa"
                        value={formData.currentGpa}
                        onChange={handleChange}
                        placeholder="e.g., 3.5"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Previous Academic Qualification
                      </label>
                      <input
                        type="text"
                        name="previousAcademicQualification"
                        value={formData.previousAcademicQualification}
                        onChange={handleChange}
                        placeholder="e.g., Bachelor of Science"
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Source <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="social_media">Social Media</option>
                        <option value="walk_in">Walk-in</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Feedback/Suggestions */}
                <div>
                  <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-800 dark:text-white">Feedback or Suggestions</h2>
                  <textarea
                    name="feedBackOrSuggestion"
                    value={formData.feedBackOrSuggestion}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter any feedback or suggestions..."
                    className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </form>
            </div>

            {/* Footer with Save Button */}
            <div className="flex justify-end gap-3 p-6 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="addLeadModalForm"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
              >
                <Save size={18} className="mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Inquiry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLeadModal;