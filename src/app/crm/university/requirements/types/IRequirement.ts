export interface IDocumentCheckListDTO {
  documenteTypeId: string;
}

export interface IRequirement {
  id: string;
  descriptions: string;
  countryId: string;
  courseId: string;
  courseName?: string;
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  isActive?: boolean;
  documentsCheckListDTOs?: IDocumentCheckListDTO[];
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