
export interface AddAnnouncementPayload {
    title: string
    description: string
    announcementPriority: number
}



export interface AddAnnouncementResponse {
    id: string
    title: string
    description: string
    announcementPriority: number
}



export interface AnnouncementResponse {
    id: string
    title: string
    description: string
    announcementPriority: number
    publishStatus: number
    isPinned: number
    createdAt: string

}



export interface UpdateAnnouncementPayload {
    id: string
    title: string
    description: string
    announcementPriority: number
}

export interface IPin {
    announcementId: string;
}

export interface PinRequest {
    announcementId: string;
};

export interface IPublish {
    announcementId: string;
}

export interface PublishRequest {
    announcementId: string;
};
