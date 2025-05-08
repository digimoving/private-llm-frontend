import type {
  Project,
  Notification,
  LLMResource,
  LLMResourceInput,
  LLMListParams,
} from "../types/types";
import type { FileUploadResponse } from "../types/types";
import { projects } from "./data/projects";
import { notifications } from "./data/notifications";
import { llms } from "./data/llms";
import { mockFiles } from "./data/files";
import { mockReports } from "./data/reports";
import { useFileSize } from "../composables/useFileSize";
import { mockLogs } from "./data/logs";
import { mockMetrics } from "./data/metrics";

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Use the imported llms data
let llmsData = [...llms];

// Initialize the file size formatter
const { format: formatFileSize } = useFileSize();

export const projectsApi = {
  // Get all projects with optional filtering
  async list(
    params: { archived?: boolean } = {}
  ): Promise<{ data: Project[] }> {
    await delay(500);
    let filteredProjects = [...projects];

    if (params.archived !== undefined) {
      filteredProjects = filteredProjects.filter(
        (p) => p.archived === params.archived
      );
    }

    return { data: filteredProjects };
  },

  // Get a single project by ID
  async get(id: string): Promise<{ data: Project }> {
    await delay(300);
    const project = projects.find((p) => p.id === id);
    if (!project) throw new Error("Project not found");
    return { data: project };
  },

  // Create a new project
  async create(
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<{ data: Project }> {
    await delay(800);
    const newProject: Project = {
      id: `project_${String(projects.length + 1).padStart(3, "0")}`,
      name: projectData.name,
      description: projectData.description || "",
      tags: projectData.tags || [],
      archived: false,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      apiAccess: projectData.apiAccess ?? false,
      requestLogging: projectData.requestLogging ?? false,
      autoScaling: projectData.autoScaling ?? false,
      cacheResults: projectData.cacheResults ?? false,
    };
    projects.push(newProject);
    return { data: newProject };
  },

  // Update an existing project
  async update(
    id: string,
    projectData: Partial<Project>
  ): Promise<{ data: Project; archivedLLMs?: LLMResource[] }> {
    await delay(600);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Project not found");

    const updatedProject = {
      ...projects[index],
      ...projectData,
      lastUpdated: new Date().toISOString(),
      apiAccess: projectData.apiAccess ?? projects[index].apiAccess ?? false,
      requestLogging:
        projectData.requestLogging ?? projects[index].requestLogging ?? false,
      autoScaling:
        projectData.autoScaling ?? projects[index].autoScaling ?? false,
      cacheResults:
        projectData.cacheResults ?? projects[index].cacheResults ?? false,
    };
    projects[index] = updatedProject;

    // If project is being archived, archive all associated LLMs
    let archivedLLMs: LLMResource[] | undefined;
    if (projectData.archived === true) {
      archivedLLMs = [];
      llmsData = llmsData.map((llm) => {
        if (llm.projectId === id && !llm.archived) {
          const updatedLLM = {
            ...llm,
            archived: true,
            updatedAt: new Date().toISOString(),
          };
          archivedLLMs!.push(updatedLLM);
          return updatedLLM;
        }
        return llm;
      });
    }

    return { data: updatedProject, archivedLLMs };
  },

  // Delete a project
  async delete(id: string): Promise<void> {
    await delay(500);
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects.splice(index, 1);
    }
  },
};

export const llmsApi = {
  // List LLMs in a project
  async list(
    projectId: string,
    params: LLMListParams = {}
  ): Promise<LLMResource[]> {
    await delay(300);
    let filtered = llmsData.filter((llm) => llm.projectId === projectId);

    // Apply status filter
    if (params.status && params.status !== "all") {
      filtered = filtered.filter((llm) => {
        if (params.status === "active") return !llm.archived && !llm.paused;
        if (params.status === "archived") return llm.archived;
        return true;
      });
    }

    // Apply tags filter
    if (params.tags && params.tags.length > 0) {
      filtered = filtered.filter((llm) =>
        params.tags!.every((tag) => llm.tags?.includes(tag))
      );
    }

    // Apply sorting
    if (params.sort) {
      filtered.sort((a, b) => {
        switch (params.sort) {
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "updated_desc":
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          case "updated_asc":
            return (
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return filtered;
  },

  // Get a single LLM
  async get(projectId: string, llmId: string): Promise<LLMResource> {
    await delay(300);
    const llm = llmsData.find(
      (l) => l.projectId === projectId && l.id === llmId
    );
    if (!llm) throw new Error("LLM not found");
    return llm;
  },

  // Create a new LLM
  async create(
    projectId: string,
    input: LLMResourceInput
  ): Promise<LLMResource> {
    await delay(500);
    const newLlm: LLMResource = {
      ...input,
      id: `llm_${String(llmsData.length + 1).padStart(3, "0")}`,
      projectId,
      archived: false,
      paused: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    llmsData.push(newLlm);
    return newLlm;
  },

  // Update an LLM
  async update(
    projectId: string,
    llmId: string,
    input: LLMResourceInput
  ): Promise<LLMResource> {
    await delay(400);
    const index = llmsData.findIndex(
      (l) => l.projectId === projectId && l.id === llmId
    );
    if (index === -1) throw new Error("LLM not found");

    const updatedLlm: LLMResource = {
      ...llmsData[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    llmsData[index] = updatedLlm;
    return updatedLlm;
  },

  // Delete an LLM
  async delete(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const index = llmsData.findIndex(
      (l) => l.projectId === projectId && l.id === llmId
    );
    if (index !== -1) {
      llmsData.splice(index, 1);
    }
  },

  // Archive an LLM
  async archive(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const llm = llmsData.find(
      (l) => l.projectId === projectId && l.id === llmId
    );
    if (llm) {
      llm.archived = true;
      llm.updatedAt = new Date().toISOString();
    }
  },

  // Unarchive an LLM
  async unarchive(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const llm = llmsData.find(
      (l) => l.projectId === projectId && l.id === llmId
    );
    if (llm) {
      llm.archived = false;
      llm.updatedAt = new Date().toISOString();
    }
  },

  // Pause an LLM
  async pause(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const llm = llmsData.find(
      (l) => l.projectId === projectId && l.id === llmId
    );
    if (llm) {
      llm.paused = true;
      llm.updatedAt = new Date().toISOString();
    }
  },

  // Resume an LLM
  async resume(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const llm = llmsData.find(
      (l) => l.projectId === projectId && l.id === llmId
    );
    if (llm) {
      llm.paused = false;
      llm.updatedAt = new Date().toISOString();
    }
  },
};

export const notificationsApi = {
  // Get all notifications
  async list(): Promise<Notification[]> {
    await delay(500);
    return [...notifications];
  },

  async toggleRead(id: string): Promise<void> {
    await delay(300);
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error("Notification not found");
    }
    notifications[index] = {
      ...notifications[index],
      read: !notifications[index].read,
    };
  },

  // Delete a notification
  async delete(id: string): Promise<void> {
    await delay(300);
    const index = notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
  },

  // Mark all notifications as read
  async markAllRead(): Promise<void> {
    await delay(300);
    notifications.forEach((notification, index) => {
      notifications[index] = {
        ...notification,
        read: true,
      };
    });
  },
};

export const filesApi = {
  async list(page = 1, pageSize = 10) {
    await delay(500); // Simulate network delay
    const start = (page - 1) * pageSize;
    const pagedFiles = mockFiles.slice(start, start + pageSize);
    return {
      files: pagedFiles,
      total: mockFiles.length,
    };
  },

  async create(files: FileList): Promise<FileUploadResponse[]> {
    await delay(1000); // Simulate upload delay
    return Array.from(files).map((file, index) => ({
      id: `new-${index + 1}`,
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      url: `/files/${file.name}`,
    }));
  },

  async delete(fileId: string): Promise<void> {
    await delay(300); // Simulate delete delay
    const index = mockFiles.findIndex((f) => f.id === fileId);
    if (index !== -1) {
      mockFiles.splice(index, 1);
    }
  },

  async download(fileId: string): Promise<Blob> {
    await delay(300); // Simulate download delay
    const file = mockFiles.find((f) => f.id === fileId);
    if (!file) {
      throw new Error("File not found");
    }
    // Return a mock blob
    return new Blob([`Mock content for ${file.name}`], { type: "text/plain" });
  },
};

export const reportsApi = {
  async list(page = 1, pageSize = 10) {
    await delay(500); // Simulate network delay
    const start = (page - 1) * pageSize;
    const pagedReports = mockReports.slice(start, start + pageSize);
    return {
      reports: pagedReports,
      total: mockReports.length,
    };
  },

  async delete(reportId: string): Promise<void> {
    await delay(300); // Simulate delete delay
    const index = mockReports.findIndex((r) => r.id === reportId);
    if (index !== -1) {
      mockReports.splice(index, 1);
    }
  },

  async download(reportId: string): Promise<Blob> {
    await delay(300); // Simulate download delay
    const report = mockReports.find((r) => r.id === reportId);
    if (!report) {
      throw new Error("Report not found");
    }
    // Return a mock blob
    return new Blob([`Mock content for ${report.name}`], {
      type: "text/plain",
    });
  },
};

export const logsApi = {
  async list(page = 1, pageSize = 10) {
    // Simulate network delay
    await delay(300);
    // Paginate the logs
    const start = (page - 1) * pageSize;
    const pagedLogs = mockLogs.slice(start, start + pageSize);
    return {
      logs: pagedLogs,
      total: mockLogs.length,
    };
  },
};

export const metricsApi = {
  async list(tag?: string | null): Promise<{ data: typeof mockMetrics }> {
    await delay(300);
    // Simulate tag-based filtering on the mock data
    if (tag) {
      // For demo: filter by even/odd days for different tags
      const isEvenTag = tag.length % 2 === 0;
      const filteredTimeSeries = mockMetrics.timeSeries.filter((entry, idx) =>
        isEvenTag ? idx % 2 === 0 : idx % 2 !== 0
      );
      // Recalculate summary
      const totalRequests = filteredTimeSeries.reduce(
        (sum, d) => sum + d.requests,
        0
      );
      const avgRequestsPerDay =
        filteredTimeSeries.length > 0
          ? Math.round(totalRequests / filteredTimeSeries.length)
          : 0;
      const totalTokens = filteredTimeSeries.reduce(
        (sum, d) => sum + d.tokens,
        0
      );
      const estimatedCost = Number((totalTokens * 0.0000024).toFixed(2));
      return {
        data: {
          summary: {
            totalRequests,
            avgRequestsPerDay,
            totalTokens,
            estimatedCost,
          },
          timeSeries: filteredTimeSeries,
          tags: mockMetrics.tags,
        },
      };
    }
    return { data: mockMetrics };
  },
};
