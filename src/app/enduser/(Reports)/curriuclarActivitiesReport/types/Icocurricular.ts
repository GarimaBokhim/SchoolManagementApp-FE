export enum ActivityCategory {
  Sports = 1,
  Academics = 2,
  CreativeArts = 3,
  Environmental = 4,
  PerformingArts = 5,
  Technical = 6,
  SocialService = 7,
  Vocational = 8,
}

export const ActivityCategoryLabel: Record<ActivityCategory, string> = {
  [ActivityCategory.Sports]: "Sports",
  [ActivityCategory.Academics]: "Academics",
  [ActivityCategory.CreativeArts]: "Creative Arts",
  [ActivityCategory.Environmental]: "Environmental",
  [ActivityCategory.PerformingArts]: "Performing Arts",
  [ActivityCategory.Technical]: "Technical",
  [ActivityCategory.SocialService]: "Social Service",
  [ActivityCategory.Vocational]: "Vocational",
};

export const ActivityCategoryBadgeClass: Record<ActivityCategory, string> = {
  [ActivityCategory.Sports]: "bg-green-100 text-green-700",
  [ActivityCategory.Academics]: "bg-blue-100 text-blue-700",
  [ActivityCategory.CreativeArts]: "bg-pink-100 text-pink-700",
  [ActivityCategory.Environmental]: "bg-emerald-100 text-emerald-700",
  [ActivityCategory.PerformingArts]: "bg-purple-100 text-purple-700",
  [ActivityCategory.Technical]: "bg-cyan-100 text-cyan-700",
  [ActivityCategory.SocialService]: "bg-orange-100 text-orange-700",
  [ActivityCategory.Vocational]: "bg-yellow-100 text-yellow-700",
};

export interface IActivity {
  ActivityName: string;
  ActivityCategory: ActivityCategory;
  Participants: number;
  ClassIds: string[];
}

export interface ICoCurricularEvent {
  EventsId: string;
  ActivityDate: string;
  Activities: IActivity[];
}

export interface ICoCurricularResponse {
  Items: ICoCurricularEvent[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}