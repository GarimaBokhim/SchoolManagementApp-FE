'use client';

import { useState } from 'react';
import { ConvertToApplicantPayload, Lead } from '../types/leads';

export const useConversion = () => {
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [conversionData, setConversionData] = useState<ConvertToApplicantPayload>({
    userId: '',
    passportNo: '',
    targetCountry: '',
  });

  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead);
    setConversionData({
      userId: lead.id,
      passportNo: '',
      targetCountry: '',
    });
    setShowConvertModal(true);
  };

  const handleConversionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConversionData(prev => ({ ...prev, [name]: value }));
  };

  const closeConversionModal = () => {
    setShowConvertModal(false);
    setSelectedLead(null);
    setConversionData({
      userId: '',
      passportNo: '',
      targetCountry: '',
    });
  };

  return {
    convertingId,
    setConvertingId,
    showConvertModal,
    selectedLead,
    conversionData,
    handleConvertClick,
    handleConversionInputChange,
    closeConversionModal
  };
};