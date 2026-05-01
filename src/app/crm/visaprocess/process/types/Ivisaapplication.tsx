export interface IVisaApplication {
  id: string
  applicantId: string
  countryId: string
  universityId: string
  courseId: string
  intakeId: string
  appliedDate: string
  visaStatusId: string
  visaDetails: string
  emailSent: boolean
  emailContent: string
  visaApplicationDocumentsDTOs: IVisaApplicationDocument[]
}

export interface IVisaApplicationDocument {
  id: string
  documentTypeId: string
  documentStatus: number
  docLink: string
  isActive: boolean
  schoolId: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
}
