/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { api } from '@/utils/instance';

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

const AddLeadPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: 1, // Default to Male (assuming 1 = Male)
    contactNumber: '',
    permanentAddress: '',
    educationLevel: 1, // Default to first option
    completionYear: '',
    currentGpa: '',
    previousAcademicQualification: '',
    source: 'website', // Default source
    feedBackOrSuggestion: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle number fields
    if (type === 'number' || name === 'gender' || name === 'educationLevel') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Format the data for the API
      const apiData = {
        ...formData,
        // Ensure date is in ISO format with current time if not provided
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : new Date().toISOString(),
      };

      // Using axios instance instead of fetch
      const response = await api.post('/api/Enrolments/AddInquiry', apiData);

      console.log('API Response:', response.data);
      
      // Show success message
      alert('Inquiry saved successfully!');
      
      // Navigate back to the leads list page
      router.push('/crm/applications/leads');
      
    } catch (error: any) {
      console.error('Submission error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        const errorMessage = error.response.data?.message || 
                            error.response.data?.title || 
                            JSON.stringify(error.response.data) || 
                            'Server error occurred';
        setError(`Error ${error.response.status}: ${errorMessage}`);
        alert(`Failed to save inquiry: ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
        alert('Failed to save inquiry. No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        setError(error.message || 'An unexpected error occurred');
        alert('Failed to save inquiry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Inquiry</h1>
          <p className="text-gray-500 dark:text-gray-400">Create a new student inquiry</p>
        </div>
        <button
          type="submit"
          form="inquiryForm"
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
        >
          <Save size={18} className="mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Inquiry'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form id="inquiryForm" onSubmit={handleSubmit} className="space-y-6">
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
                  <option value={2}>{`Bachelor's Degree`}</option>
                  <option value={3}>{`Master's Degree`}</option>
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
    </div>
  );
};

export default AddLeadPage;