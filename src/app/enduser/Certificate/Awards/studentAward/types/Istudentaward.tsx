export interface Istudentaward {
    Id: string;
    studentId: string;
    awardedAt: string;
    awardedBy: string;
    awardDescriptions: string;
    certificateTemplateId: string;
    eventsId: string;
    contentHtml: string;
    schoolId: string
}
 
export interface IfilterStudentAward {
    studentId: string;
    startDate: string;
    endDate: string;
}