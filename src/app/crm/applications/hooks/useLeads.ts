'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ConvertToApplicantPayload, Lead, UserProfile } from '../types/leads';
import { leadService } from '../services/lead_service';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await leadService.fetchLeads();
      const items = response.Items || [];
      
      const formattedLeads: Lead[] = items.map((item: any, index: number) => ({
        id: index.toString(),
        name: item.fullName || 'N/A',
        email: item.email || 'N/A',
        phone: item.contactNumber || 'N/A',
        source: item.source || 'website',
        countryInterest: 'N/A',
        status: 'new',
      }));

      setLeads(formattedLeads);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch leads');
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const searchProfiles = useCallback(async (query: string) => {
    try {
      setSearchLoading(true);
      const response = await leadService.searchProfiles(query);
      
      if (response.data?.Items) {
        setSearchResults(response.data.Items);
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Failed to search profiles');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const addProfileToLeads = useCallback((profile: UserProfile) => {
    const existingLead = leads.find(lead => lead.email === profile.email);
    
    if (existingLead) {
      toast.success(`Profile ${profile.fullName} already exists in leads`);
    } else {
      const newLead: Lead = {
        id: (leads.length + 1).toString(),
        name: profile.fullName,
        email: profile.email,
        phone: profile.contactNumber,
        source: profile.source || 'search',
        countryInterest: profile.countryInterest || 'N/A',
        status: 'new',
      };
      
      setLeads(prev => [newLead, ...prev]);
      toast.success(`Added ${profile.fullName} to leads`);
    }
  }, [leads]);

  const convertToApplicant = useCallback(async (data: ConvertToApplicantPayload, leadId: string) => {
    try {
      const response = await leadService.convertToApplicant(data);
      toast.success(`Successfully converted to applicant!`);
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to convert to applicant';
      toast.error(`Error: ${errorMessage}`);
      throw error;
    }
  }, []);

  const deleteLead = useCallback((id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
    toast.success('Lead deleted successfully!');
  }, []);

  return {
    leads,
    loading,
    error,
    searchResults,
    searchLoading,
    fetchLeads,
    searchProfiles,
    addProfileToLeads,
    convertToApplicant,
    deleteLead
  };
};