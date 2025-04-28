import { defineStore } from "pinia";
import { projectsApi, llmResourcesApi, metricsApi } from "../api/api";

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  }),

  getters: {
    // Get project by ID
    getProjectById: (state) => (id) => {
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
  },

  actions: {
    // Fetch all projects
    async fetchProjects(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsApi.getAll(params);
        this.projects = response.data;
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching projects:", error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single project
    async fetchProjectById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsApi.getById(id);
        this.currentProject = response.data;
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching project:", error);
      } finally {
        this.loading = false;
      }
    },

    // Create a new project
    async createProject(projectData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectsApi.create(projectData);
        this.projects.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error("Error creating project:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update a project
    async updateProject(id, projectData) {
      this.loading = true;
      this.error = null;
      try {
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
        this.error = error.message;
        console.error("Error updating project:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete a project
    async deleteProject(id) {
      this.loading = true;
      this.error = null;
      try {
        await projectsApi.delete(id);
        this.projects = this.projects.filter((p) => p.id !== id);
        if (this.currentProject?.id === id) {
          this.currentProject = null;
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error deleting project:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch list of LLMs for a project
    async fetchProjectLLMs(projectId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await llmResourcesApi.getByProjectId(projectId);
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching project LLMs:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch metrics for a project
    async fetchProjectMetrics(projectId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await metricsApi.getByProjectId(projectId);
        return response.data;
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching project metrics:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
