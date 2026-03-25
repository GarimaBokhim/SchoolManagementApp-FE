export interface IUniversity {
  id: string;
  name: string;
  country: string;
  descriptions: string;
  website: string;
  globalRanking: number;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface IUniversityUI extends IUniversity {
  location?: string; 
  programs?: number; 
  students?: number; 
}


export interface IUniversityFormData {
  name: string;
  countryId: string; 
  descriptions: string;
  website: string;
  globalRanking: number;
}