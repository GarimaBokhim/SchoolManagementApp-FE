// types/requirement.ts

export interface IDocumentCheckListDTO {
  documenteTypeId: string;
  isRequired?: boolean;
}

export interface IRequirement {
  id: string;
  descriptions: string;
  countryId?: string;
  courseId: string;
  courseName?: string;
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  isActive?: boolean;
  schoolId?: string;
  DocumentsCheckListDTOs?: IDocumentCheckListDTO[];
}

export interface IRequirementFormData {
  descriptions: string;
  countryId: string;
  courseId: string;
  documentsCheckListDTOs: IDocumentCheckListDTO[];
}

export interface ICourse {
  id: string;
  title: string;
  code?: string;
  isActive?: boolean;
}

// API Response Types
export interface ApiResponse {
  Items: IRequirement[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

export interface CourseApiResponse {
  Items: ICourse[];
}

export interface IDocumentType {
  id: string;
  name: string;
}