export interface INotice {
  id?: string;
  title: string;
  contentHtml: string;
  publishStatus: number;
  shortDescription: string;
}

export interface IDisplayNotice {
  id?: string;
  title: string;
  contentHtml: string;
  publishStatus: number;
  shortDescription: string;
  createdAt: string;
}

export interface IFilterNotice {
  startDate: string;
  endDate: string;
  title: string;
}

export interface IPublish {
  noticeId: string;
}