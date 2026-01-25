
export interface ISchoolAward {
  Id: string;
  awardedAt: string;        
  awardedBy: string;
  awardDescriptions: string;
  schoolId: string;
  createdBy: string;
  createdAt: string;          
  modifiedBy: string;
  modifiedAt: string;  
  isActive: boolean;
}
export interface IfilterSchoolAward {
  startDate: string;
  endDate: string;
}
