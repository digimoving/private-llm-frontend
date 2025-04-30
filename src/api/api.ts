import type {
  Project,
  Notification,
  LLMResource,
  LLMResourceInput,
  LLMListParams,
} from "../types/types";
import { projects } from "./data/projects";
import { notifications } from "./data/notifications";

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock LLM data
const llms: LLMResource[] = [];

export const llmsApi = {
  // List LLMs in a project
  async list(
    projectId: string,
    params: LLMListParams = {}
  ): Promise<LLMResource[]> {
    await delay(300);
    let filtered = llms.filter((llm) => llm.projectId === projectId);

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
    const llm = llms.find((l) => l.projectId === projectId && l.id === llmId);
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
      id: `llm_${String(llms.length + 1).padStart(3, "0")}`,
      projectId,
      archived: false,
      paused: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    llms.push(newLlm);
    return newLlm;
  },

  // Update an LLM
  async update(
    projectId: string,
    llmId: string,
    input: LLMResourceInput
  ): Promise<LLMResource> {
    await delay(400);
    const index = llms.findIndex(
      (l) => l.projectId === projectId && l.id === llmId
    );
    if (index === -1) throw new Error("LLM not found");

    const updatedLlm: LLMResource = {
      ...llms[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    llms[index] = updatedLlm;
    return updatedLlm;
  },

  // Delete an LLM
  async delete(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const index = llms.findIndex(
      (l) => l.projectId === projectId && l.id === llmId
    );
    if (index !== -1) {
      llms.splice(index, 1);
    }
  },

  // Archive an LLM
  async archive(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const llm = llms.find((l) => l.projectId === projectId && l.id === llmId);
    if (llm) {
      llm.archived = true;
      llm.updatedAt = new Date().toISOString();
    }
  },

  // Unarchive an LLM
  async unarchive(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const llm = llms.find((l) => l.projectId === projectId && l.id === llmId);
    if (llm) {
      llm.archived = false;
      llm.updatedAt = new Date().toISOString();
    }
  },

  // Pause an LLM
  async pause(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const llm = llms.find((l) => l.projectId === projectId && l.id === llmId);
    if (llm) {
      llm.paused = true;
      llm.updatedAt = new Date().toISOString();
    }
  },

  // Resume an LLM
  async resume(projectId: string, llmId: string): Promise<void> {
    await delay(300);
    const llm = llms.find((l) => l.projectId === projectId && l.id === llmId);
    if (llm) {
      llm.paused = false;
      llm.updatedAt = new Date().toISOString();
    }
  },
};

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
    projectData: Omit<Project, "id" | "dateCreated" | "lastUpdated">
  ): Promise<{ data: Project }> {
    await delay(800);
    const newProject: Project = {
      ...projectData,
      id: `${String(projects.length + 1)}`,
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    projects.push(newProject);
    return { data: newProject };
  },

  // Update an existing project
  async update(
    id: string,
    projectData: Partial<Project>
  ): Promise<{ data: Project }> {
    await delay(600);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Project not found");

    const updatedProject = {
      ...projects[index],
      ...projectData,
      lastUpdated: new Date().toISOString(),
    };
    projects[index] = updatedProject;
    return { data: updatedProject };
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
