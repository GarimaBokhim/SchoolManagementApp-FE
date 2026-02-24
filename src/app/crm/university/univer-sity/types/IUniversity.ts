export interface IUniversity {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  establishedDate: Date;
  provinceId: number;
  districtId: number;
  municipalityId: number | 0;
  vdcid: number | 0;
  wardNumber?: number | null;
  universityImg: File;
  imageUrl: string;
  universityStatus: 0;
}

export interface IFilterUniversityByDate {
  startDate: string;
  endDate: string;
  name: string;
}