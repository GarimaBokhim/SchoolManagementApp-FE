export interface University {
  id: string;
  name: string;
  country: string;
  descriptions?: string;
  website?: string;
  globalRanking?: number;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface Course {
  id: string;
  title: string;
  studyLevel: number;
  tuationFee: number;
  currency: string;
  universityId: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  // Enriched fields
  universityName?: string;
  country?: string;
}

export interface ApiResponse<T> {
  items: T[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  firstPage: number;
  lastPage: number;
}

export interface FilterParams {
  pageIndex?: number;
  pageSize?: number;
  searchTerm?: string;
  universityId?: string;
  country?: string;
}

export const STUDY_LEVEL_LABELS: Record<number, string> = {
  1: "Bachelor's Degree",
  2: "Master's Degree",
  3: "PhD / Doctorate",
  4: "Diploma",
  5: "Certificate",
  6: "Foundation",
  7: "English Language",
};