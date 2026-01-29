export interface IEvents {
    id?: string;
    title: string;
    descriptions: string;
    eventsType: string;
    eventsDate: string;
    participants: string;
    eventTime: string;
    venue: string;
    chiefGuest: string;
    organizer: string;
    mentor: string;
    schoolId?: string
}

export interface IfilterEvents {
    startDate: string;
    endDate: string;
} 
 