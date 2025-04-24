import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    currentProjectId: null as string | null,
    projects: [] as Array<{ id: string; name: string; description?: string }>,
  }),

  actions: {
    setCurrentProject(id: string) {
      this.currentProjectId = id
    },

    setProjects(projects: Array<{ id: string; name: string }>) {
      this.projects = projects
    },

    addProject(project: { id: string; name: string }) {
      this.projects.push(project)
    },
  },
  getters: {
    currentProject(): { id: string; name: string; description?: string } | null {
      return this.projects.find((p: { id: string; name: string; description?: string }) => p.id === this.currentProjectId) || null
    },
  },
})
