
export interface AddRequirementsPayload {
    title: string,
    descriptions: string
    universityId: string
    countryId: string
    courseId: string
    documentsCheckListDTOs: DocumentsCheckListDTOs[]
}

export interface RequirementsFormPayload {
    title: string
    descriptions: string
    universityId: string
    countryId: string
    courseId: string
    documentsCheckListDTOs: RequirementsFormDocument[]
}

export interface RequirementsFormDocument {
    id?: string
    documenteTypeId: string
    isRequired?: boolean
}


export interface DocumentsCheckListDTOs {

    documenteTypeId: string
}


export interface RequiredDocTypeStatusPayload {
    documentCheckListId: string
}

export interface RequiredDocTypeStatusResponse {
    documentCheckListId: string
}

export interface AddRequirementsResponse {
    descriptions: string
    countryId: string
    courseId: string

}



export interface RequirementsResponse {
    id: string
    title: string
    descriptions: string,
    universityName: string,
    universityAddress: string,
    courseId: string
    courseName: string
    countryId: string
    countryName: string
    universityId: string
    DocumentsCheckListDTOs: DocCheckListResponseDTOs[]
}


export interface DocCheckListResponseDTOs {
    id: string
    documenteTypeId: string
    documenteTypeName: string
    isRequired: boolean
}

export interface UpdateRequirementsPayload {
    id: string
    title: string
    descriptions: string
    universityId: string
    countryId: string
    courseId: string
    documentsCheckListDTOs: UpdateDocumentsCheckListDTOs[]
}

export interface UpdateDocumentsCheckListDTOs {
    id: string
    documenteTypeId: string
    isRequired: boolean
}