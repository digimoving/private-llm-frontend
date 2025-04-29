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
  description?: string;
  archived: boolean;
  dateCreated: string;
  lastUpdated: string;
  tags?: string[];
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
