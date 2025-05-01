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
