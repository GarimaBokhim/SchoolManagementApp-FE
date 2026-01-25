export interface Istudentaward {
    id: string;
    studentId: string;
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
 
export interface IfilterStudentAward {
    studentId: string;
    startDate: string;
    endDate: string;
}