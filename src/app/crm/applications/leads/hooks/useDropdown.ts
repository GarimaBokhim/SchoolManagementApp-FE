'use client';

import { useState, useCallback } from 'react';

const useDropdown = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const openDropdown = useCallback((id: string) => {
    setOpenMenuId(id);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenMenuId(null);
  }, []);

  const toggleDropdown = useCallback((id: string) => {
    setOpenMenuId(prev => prev === id ? null : id);
  }, []);

  const isDropdownOpen = useCallback((id: string) => {
    return openMenuId === id;
  }, [openMenuId]);

  return {
    openMenuId,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    isDropdownOpen
  };
};

export default useDropdown;