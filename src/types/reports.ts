export interface Report {
  id: string;
  name: string;
  date: string;
  models: string[];
  metrics: string;
  format: string;
  timeRange: string;
}

export interface ReportListResponse {
  reports: Report[];
  total: number;
}
