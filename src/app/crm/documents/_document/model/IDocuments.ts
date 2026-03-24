export interface IDocument {
  id: string;
  applicantId: string;
  documentTypeId: string;
  documentStatus: number;
  docLink: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface IDocumentFormData {
  applicantId: string;
  documentTypeId: string;
  documentStatus: number;
}