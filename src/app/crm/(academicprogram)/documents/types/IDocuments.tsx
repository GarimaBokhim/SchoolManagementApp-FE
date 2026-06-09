
export interface AddDocumentsPayload {
    applicantId: string,
    documentsDTOs: DocumentsDTOs[]
}

export interface DocumentsDTOs {

    documentTypeId: string
    docFile: File | null;
}



export interface AddDocumentsResponse {
    applicantId: string,

}

export interface ApplicantResponse {
    id: string
    fullName: string
    countryName: string
    courseName: string
    universityName: string
}



export interface DocumentsResponse {
    id: string
    applicantId: string
    documentTypeId: string
    docmentTypeName: string
    documentStatus: number
    docLink: string
}

export interface DocumentsIdResponse {
    id: string;
    applicantId: string;
    documentsByIdDTOs: {
        documentTypeId: string;
        documentStatus: number;
        documentsUrl: string;
    };
}



export interface UpdateDocumentsPayload {
    id: string
    applicantId: string,
    documentsByIdDTOs: DocumentsUpdateDTOs[]
}

export interface DocumentsUpdateDTOs {
    documentTypeId: string
    documentStatus: number
    documentsUrl: string
    docFile: File | null;
}