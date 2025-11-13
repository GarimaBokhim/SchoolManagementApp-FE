export interface ITemplate {
  id?: string;
  templateName: string;
  templateType: string;
  htmlTemplate: string;
  templateVersion: string;
}

export interface IFilterTemplateByDate {
  schoolId: string;
  startDate: string;
  endDate: string;
}
