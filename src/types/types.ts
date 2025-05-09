// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "reports" | "training" | "system" | "alerts";
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  archived: boolean;
  createdAt: string;
  lastUpdated: string;
  apiAccess?: boolean;
  requestLogging?: boolean;
  autoScaling?: boolean;
  cacheResults?: boolean;
}

// LLM Types
export interface LLMResourceInput {
  name: string;
  type: string;
  description?: string;
  maxTokens?: number;
  temperature?: number;
  tags?: string[];
  trainingFiles?: string[];
}

export interface LLMResource extends LLMResourceInput {
  id: string;
  projectId: string;
  archived: boolean;
  paused: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LLMListParams {
  status?: "active" | "archived" | "all";
  tags?: string[];
  sort?:
    | "newest"
    | "oldest"
    | "name_asc"
    | "name_desc"
    | "updated_desc"
    | "updated_asc";
}

export interface LLM {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "active" | "paused";
  archived: boolean;
  createdAt: string;
  lastUpdated: string;
  projectId: string;
}

// File Types
export interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  tags: string[];
  url?: string;
}

export interface FileUploadResponse {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface FileListResponse {
  files: File[];
  total: number;
}

// Report Types
export interface Report {
  id: string;
  name: string;
  date: string;
  models: string[];
  metrics: string[];
  format: string;
  timeRange: string;
  fileUrl?: string;
}

export interface ReportListResponse {
  reports: Report[];
  total: number;
}

// Log Types
export interface LogEntry {
  time: string;
  requestId: string;
  model: string;
  user: string;
  prompt: string;
  tokens: number;
  latency: string;
  status: string;
}

// Metrics Types
export interface MetricsSummary {
  totalRequests: number;
  avgRequestsPerDay: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface MetricsTimeSeries {
  date: string; // e.g. '2024-06-01'
  requests: number;
  tokens: number;
}

export interface MetricsOverview {
  summary: MetricsSummary;
  timeSeries: MetricsTimeSeries[];
  tags: string[];
}
