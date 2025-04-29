import { defineStore } from "pinia";
import {
  llmsApi,
  type LLMResource,
  type LLMResourceInput,
  type LLMListParams,
} from "../api/api";

export const useLLMsStore = defineStore("llms", {
  state: () => ({
    llms: [] as LLMResource[],
    isLoading: false,
    currentProjectId: null as string | null,
  }),

  getters: {
    getLLMById: (state) => (id: string) => {
      return state.llms.find((llm) => llm.id === id);
    },

    activeLLMs: (state) => {
      return state.llms.filter((llm) => !llm.archived && !llm.paused);
    },

    archivedLLMs: (state) => {
      return state.llms.filter((llm) => llm.archived);
    },

    pausedLLMs: (state) => {
      return state.llms.filter((llm) => llm.paused);
    },

    getLLMsByTag: (state) => (tag: string) => {
      return state.llms.filter((llm) => llm.tags?.includes(tag));
    },
  },

  actions: {
    setCurrentProject(projectId: string) {
      this.currentProjectId = projectId;
    },

    async fetchLLMs(params: LLMListParams = {}) {
      if (!this.currentProjectId) return;

      this.isLoading = true;
      try {
        this.llms = await llmsApi.list(this.currentProjectId, params);
      } catch (error) {
        console.error("Failed to fetch LLMs:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async getLLM(llmId: string) {
      if (!this.currentProjectId) return null;

      try {
        return await llmsApi.get(this.currentProjectId, llmId);
      } catch (error) {
        console.error("Failed to get LLM:", error);
        return null;
      }
    },

    async createLLM(input: LLMResourceInput) {
      if (!this.currentProjectId) return null;

      try {
        const newLLM = await llmsApi.create(this.currentProjectId, input);
        this.llms.push(newLLM);
        return newLLM;
      } catch (error) {
        console.error("Failed to create LLM:", error);
        return null;
      }
    },

    async updateLLM(llmId: string, input: LLMResourceInput) {
      if (!this.currentProjectId) return null;

      try {
        const updatedLLM = await llmsApi.update(
          this.currentProjectId,
          llmId,
          input
        );
        const index = this.llms.findIndex((l) => l.id === llmId);
        if (index !== -1) {
          this.llms[index] = updatedLLM;
        }
        return updatedLLM;
      } catch (error) {
        console.error("Failed to update LLM:", error);
        return null;
      }
    },

    async deleteLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        await llmsApi.delete(this.currentProjectId, llmId);
        this.llms = this.llms.filter((l) => l.id !== llmId);
      } catch (error) {
        console.error("Failed to delete LLM:", error);
      }
    },

    async archiveLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        await llmsApi.archive(this.currentProjectId, llmId);
        const llm = this.llms.find((l) => l.id === llmId);
        if (llm) {
          llm.archived = true;
          llm.updatedAt = new Date().toISOString();
        }
      } catch (error) {
        console.error("Failed to archive LLM:", error);
      }
    },

    async unarchiveLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        await llmsApi.unarchive(this.currentProjectId, llmId);
        const llm = this.llms.find((l) => l.id === llmId);
        if (llm) {
          llm.archived = false;
          llm.updatedAt = new Date().toISOString();
        }
      } catch (error) {
        console.error("Failed to unarchive LLM:", error);
      }
    },

    async pauseLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        await llmsApi.pause(this.currentProjectId, llmId);
        const llm = this.llms.find((l) => l.id === llmId);
        if (llm) {
          llm.paused = true;
          llm.updatedAt = new Date().toISOString();
        }
      } catch (error) {
        console.error("Failed to pause LLM:", error);
      }
    },

    async resumeLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        await llmsApi.resume(this.currentProjectId, llmId);
        const llm = this.llms.find((l) => l.id === llmId);
        if (llm) {
          llm.paused = false;
          llm.updatedAt = new Date().toISOString();
        }
      } catch (error) {
        console.error("Failed to resume LLM:", error);
      }
    },
  },
});
