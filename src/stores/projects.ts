import { defineStore } from "pinia";
import { projectsApi } from "../api/api";
import type { Project } from "../types/types";

interface LoadingState {
  projects: boolean;
  project: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    projects: [] as Project[],
    currentProject: null as Project | null,
    loading: {
      projects: false,
      project: false,
      create: false,
      update: false,
      delete: false,
    } as LoadingState,
    error: null as string | null,
  }),

  getters: {
    // Get project by ID
    getProjectById: (state) => (id: string) => {
      return state.projects.find((project) => project.id === id);
    },

    // Get active (non-archived) projects
    activeProjects: (state) => {
      return state.projects.filter((project) => !project.archived);
    },

    // Get archived projects
    archivedProjects: (state) => {
      return state.projects.filter((project) => project.archived);
    },

    // Get all unique tags across all projects
    allTags: (state) => {
      return (showArchived: boolean = false) => {
        const tagSet = new Set<string>();
        state.projects.forEach((project) => {
          // Only include tags from active projects unless showArchived is true
          if (showArchived || !project.archived) {
            project.tags?.forEach((tag) => tagSet.add(tag));
          }
        });
        return Array.from(tagSet).sort();
      };
    },

    // Get filtered projects based on archived status and selected tags
    filteredProjects:
      (state) =>
      (showArchived: boolean, selectedTags: string[] = ["all_tags"]) => {
        return state.projects.filter((project) => {
          // Show archived projects only if toggled
          if (!showArchived && project.archived) {
            return false;
          }

          // Handle tag filtering
          if (!selectedTags.includes("all_tags")) {
            // Check if project has any of the selected tags
            const hasSelectedTag = selectedTags.some((tag) =>
              project.tags?.includes(tag)
            );
            if (!hasSelectedTag) {
              return false;
            }
          }

          return true;
        });
      },

    // Check if any loading operation is in progress
    isLoading: (state): boolean => {
      return Object.values(state.loading).some(
        (value: boolean) => value === true
      );
    },
  },

  actions: {
    async setCurrentProject(id: string) {
      this.currentProject =
        this.projects.find((project) => project.id === id) ?? null;
    },
    // Fetch all projects
    async fetchProjects(params = {}) {
      try {
        this.loading.projects = true;
        this.error = null;
        const response = await projectsApi.list(params);
        this.projects = response.data;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Error fetching projects:", error);
        throw error;
      } finally {
        this.loading.projects = false;
      }
    },

    // Fetch a single project
    async fetchProjectById(id: string) {
      try {
        this.loading.project = true;
        this.error = null;
        this.setCurrentProject(id);
        const response = await projectsApi.get(id);
        this.currentProject = response.data;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Error fetching project:", error);
        throw error;
      } finally {
        this.loading.project = false;
      }
    },

    // Create a new project
    async createProject(
      projectData: Omit<Project, "id" | "dateCreated" | "lastUpdated">
    ) {
      try {
        this.loading.create = true;
        this.error = null;
        const response = await projectsApi.create(projectData);
        this.projects.unshift(response.data);
        return response.data;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Error creating project:", error);
        throw error;
      } finally {
        this.loading.create = false;
      }
    },

    // Update a project
    async updateProject(id: string, projectData: Partial<Project>) {
      try {
        this.loading.update = true;
        this.error = null;
        const response = await projectsApi.update(id, projectData);
        const index = this.projects.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.projects[index] = response.data;
        }
        if (this.currentProject?.id === id) {
          this.currentProject = response.data;
        }
        return response.data;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Error updating project:", error);
        throw error;
      } finally {
        this.loading.update = false;
      }
    },

    // Delete a project
    async deleteProject(id: string) {
      try {
        this.loading.delete = true;
        this.error = null;
        await projectsApi.delete(id);
        this.projects = this.projects.filter((p) => p.id !== id);
        if (this.currentProject?.id === id) {
          this.currentProject = null;
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Error deleting project:", error);
        throw error;
      } finally {
        this.loading.delete = false;
      }
    },
  },
});
