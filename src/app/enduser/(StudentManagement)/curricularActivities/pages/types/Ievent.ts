export interface EventScheduleItem {
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
  id: string;
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