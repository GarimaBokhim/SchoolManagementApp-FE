export interface EventScheduleItem {
  id: string; // real event id for API calls
  title: string;
  descriptions: string;
  eventsType: number;
  eventsDate: string;
  participants: string;
  eventTime: string;
  venue: string;
  chiefGuest: string;
  organizer: string;
  mentor: string;
}

export interface EventScheduleResponse {
  eventsList: Array<{
    eventsDetails: Record<string, EventScheduleItem>;
  }>;
}

export interface FlatEventSchedule {
  id: string;       // synthetic composite key for React
  eventsId: string; // real event id from API — used for ActivityByEvents call
  date: Date;
  title: string;
  descriptions: string;
  eventsType: number;
  eventsDate: string;
  participants: string;
  eventTime: string;
  venue: string;
  chiefGuest: string;
  organizer: string;
  mentor: string;
}

// ── Activity by Event ─────────────────────────────────────────────

export interface ActivityByEvent {
  title: string;
  descriptions: string;
  eventsType: number;
  eventsDate: string;
  eventTime: string;
  venue: string;
  chiefGuest: string;
  organizer: string;
  mentor: string;
  ActivityName: string;
  activityCategory: number;
  startTime: string;
  endTime: string;
  activityDate: string;
}

export interface ActivityByEventResponse {
  Items: ActivityByEvent[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}