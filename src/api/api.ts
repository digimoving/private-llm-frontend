import type { Project } from "./data/projects";
import type { Notification } from "../stores/notifications";
import { projects } from "./data/projects";
import { notifications } from "./data/notifications";

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const projectsApi = {
  // Get all projects with optional filtering
  async getAll(params: { archived?: boolean } = {}) {
    await delay(500); // Simulate network delay
    let filteredProjects = [...projects];

    if (params.archived !== undefined) {
      filteredProjects = filteredProjects.filter(
        (p) => p.archived === params.archived
      );
    }

    return { data: filteredProjects };
  },

  // Get a single project by ID
  async getById(id: string) {
    await delay(300);
    const project = projects.find((p) => p.id === id);
    if (!project) throw new Error("Project not found");
    return { data: project };
  },

  // Create a new project
  async create(
    projectData: Omit<Project, "id" | "dateCreated" | "lastUpdated">
  ) {
    await delay(800);
    const newProject: Project = {
      ...projectData,
      id: `proj_${String(projects.length + 1).padStart(2, "0")}`,
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    projects.push(newProject);
    return { data: newProject };
  },

  // Update an existing project
  async update(id: string, projectData: Partial<Project>) {
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
  async delete(id: string) {
    await delay(500);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Project not found");
    projects.splice(index, 1);
    return { data: null };
  },
};

export const notificationsApi = {
  // Get all notifications
  async getNotifications(): Promise<Notification[]> {
    await delay(500); // Simulate network delay
    return [...notifications];
  },

  // Mark a notification as read/unread
  async toggleNotificationRead(id: string): Promise<Notification> {
    const notification = notifications.find((n) => n.id === id);
    if (!notification) {
      throw new Error("Notification not found");
    }
    notification.read = !notification.read;
    return notification;
  },

  // Delete a notification
  async deleteNotification(id: string): Promise<void> {
    await delay(300);
    // In a real API, this would make a DELETE request
    const index = notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<Notification[]> {
    notifications.forEach((notification) => {
      notification.read = true;
    });
    return [...notifications];
  },
};
