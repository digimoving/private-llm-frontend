// Route metadata configuration
import type { RouteMeta } from "vue-router";

export interface RouteMetadata extends RouteMeta {
  title: string;
  subtitle: string;
}

// Dashboard routes
export const dashboardMetadata: Record<string, RouteMetadata> = {
  projects: {
    title: "Projects",
    subtitle: "Manage your private AI models and projects.",
  },
  notifications: {
    title: "Notifications",
    subtitle: "View and manage your system notifications.",
  },
};

// Project routes
export const projectMetadata: Record<string, RouteMetadata> = {
  "project-llms": {
    title: "LLM Resources",
    subtitle:
      "Manage and configure your language models, including their status, tags, and settings.",
  },
  "project-metrics": {
    title: "Usage Metrics",
    subtitle:
      "View and analyse usage statistics and performance metrics for your project.",
  },
  "project-files": {
    title: "Files",
    subtitle: "Upload, manage, and organise your project files and resources.",
  },
  "project-settings": {
    title: "Settings",
    subtitle:
      "Configure project settings, access controls, and integration options.",
  },
};
