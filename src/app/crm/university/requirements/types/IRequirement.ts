export interface IRequirement {
  id: string;
  descriptions: string;
  courseId: string;
  courseName?: string; // Optional for display purposes
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  isActive?: boolean;
}

export interface IRequirementFormData {
  descriptions: string;
  courseId: string;
}

export interface ICourse {
  id: string;
  title: string;
  code?: string;
  isActive?: boolean;
}