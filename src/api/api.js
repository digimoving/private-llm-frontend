import { mockAxios } from "../../mock-server";

// Projects API
export const projectsApi = {
  // Get all projects with optional filtering and sorting
  getAll: (params = {}) => mockAxios.get("/projects", { params }),

  // Get a single project by ID
  getById: (id) => mockAxios.get(`/projects/${id}`),

  // Create a new project
  create: (projectData) => mockAxios.post("/projects", projectData),

  // Update an existing project
  update: (id, projectData) => mockAxios.put(`/projects/${id}`, projectData),

  // Delete a project
  delete: (id) => mockAxios.delete(`/projects/${id}`),
};

// LLM Resources API
export const llmResourcesApi = {
  // Get all LLMs for a project
  getByProjectId: (projectId) => mockAxios.get(`/projects/${projectId}/llms`),

  // Create a new LLM for a project
  create: (projectId, llmData) =>
    mockAxios.post(`/projects/${projectId}/llms`, llmData),
};

// Metrics API
export const metricsApi = {
  // Get metrics for a project
  getByProjectId: (projectId) =>
    mockAxios.get(`/projects/${projectId}/metrics`),
};
