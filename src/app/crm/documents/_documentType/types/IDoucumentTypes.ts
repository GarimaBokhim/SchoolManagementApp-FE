export interface IDocumentType {
  description: string;
  id: string;
  name: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface IDocumentTypeFormData {
  name: string;
  countryId: string;
}