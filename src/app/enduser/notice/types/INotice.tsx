export interface INotice {
  id?: string;
  title: string;
  contentHtml: string;
  shortDescription: string;
}
export interface IFilterNotice {
  startDate: string;
  endDate: string;
  title: string;
}
export interface IPublish {
  noticeId: string;
}
