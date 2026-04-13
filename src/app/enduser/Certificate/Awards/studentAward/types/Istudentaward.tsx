export interface Istudentaward {
    Id: string;
    studentId: string;
    awardedAt: string;
    awardedBy: string;
    awardTitle: string;
    createdAt: string;
    createdBy: string;
    modifiedBy: string;
    modifiedAt: string;
    awardDescriptions: string;
    certificateTemplateId: string;
    eventsId: string;
    contentHtml: string;
    schoolId: string;
    isActive: boolean;
}
 
export interface IfilterStudentAward {
    studentId: string;
    startDate: string;
    endDate: string;
}