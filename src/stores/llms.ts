import { defineStore } from "pinia";
import { llmsApi } from "../api/api";
import {
  type LLMResource,
  type LLMResourceInput,
  type LLMListParams,
} from "../types/types";

interface LoadingState {
  llms: boolean;
  llm: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  archive: boolean;
  pause: boolean;
}

export const useLLMsStore = defineStore("llms", {
  state: () => ({
    llms: [] as LLMResource[],
    currentProjectId: null as string | null,
    loading: {
      llms: false,
      llm: false,
      create: false,
      update: false,
      delete: false,
      archive: false,
      pause: false,
    } as LoadingState,
    error: null as string | null,
  }),

  getters: {
    // Check if any loading operation is in progress
    isLoading: (state): boolean => {
      return Object.values(state.loading).some(
        (value: boolean) => value === true
      );
    },

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

      try {
        this.loading.llms = true;
        this.error = null;
        this.llms = await llmsApi.list(this.currentProjectId, params);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to fetch LLMs:", error);
        throw error;
      } finally {
        this.loading.llms = false;
      }
    },

    async getLLM(llmId: string) {
      if (!this.currentProjectId) return null;

      try {
        this.loading.llm = true;
        this.error = null;
        return await llmsApi.get(this.currentProjectId, llmId);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to get LLM:", error);
        throw error;
      } finally {
        this.loading.llm = false;
      }
    },

    async createLLM(input: LLMResourceInput) {
      if (!this.currentProjectId) return null;

      try {
        this.loading.create = true;
        this.error = null;
        const newLLM = await llmsApi.create(this.currentProjectId, input);
        this.llms.push(newLLM);
        return newLLM;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to create LLM:", error);
        throw error;
      } finally {
        this.loading.create = false;
      }
    },

    async updateLLM(llmId: string, input: LLMResourceInput) {
      if (!this.currentProjectId) return null;

      try {
        this.loading.update = true;
        this.error = null;
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
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to update LLM:", error);
        throw error;
      } finally {
        this.loading.update = false;
      }
    },

    async deleteLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        this.loading.delete = true;
        this.error = null;
        await llmsApi.delete(this.currentProjectId, llmId);
        this.llms = this.llms.filter((l) => l.id !== llmId);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to delete LLM:", error);
        throw error;
      } finally {
        this.loading.delete = false;
      }
    },

    async archiveLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        this.loading.archive = true;
        this.error = null;
        await llmsApi.archive(this.currentProjectId, llmId);

        // Find and remove the LLM from its current position
        const index = this.llms.findIndex((l) => l.id === llmId);
        if (index !== -1) {
          const [llm] = this.llms.splice(index, 1);
          // Update its archived status and timestamp
          llm.archived = true;
          llm.updatedAt = new Date().toISOString();
          // Add it to the end of the array
          this.llms.push(llm);
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to archive LLM:", error);
        throw error;
      } finally {
        this.loading.archive = false;
      }
    },

    async unarchiveLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        this.loading.archive = true;
        this.error = null;
        await llmsApi.unarchive(this.currentProjectId, llmId);

        // Find and remove the LLM from its current position
        const index = this.llms.findIndex((l) => l.id === llmId);
        if (index !== -1) {
          const [llm] = this.llms.splice(index, 1);
          // Update its archived status and timestamp
          llm.archived = false;
          llm.updatedAt = new Date().toISOString();
          // Add it to the beginning of the array
          this.llms.unshift(llm);
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to unarchive LLM:", error);
        throw error;
      } finally {
        this.loading.archive = false;
      }
    },

    async pauseLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        this.loading.pause = true;
        this.error = null;
        await llmsApi.pause(this.currentProjectId, llmId);
        const llm = this.llms.find((l) => l.id === llmId);
        if (llm) {
          llm.paused = true;
          llm.updatedAt = new Date().toISOString();
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to pause LLM:", error);
        throw error;
      } finally {
        this.loading.pause = false;
      }
    },

    async resumeLLM(llmId: string) {
      if (!this.currentProjectId) return;

      try {
        this.loading.pause = true;
        this.error = null;
        await llmsApi.resume(this.currentProjectId, llmId);
        const llm = this.llms.find((l) => l.id === llmId);
        if (llm) {
          llm.paused = false;
          llm.updatedAt = new Date().toISOString();
        }
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to resume LLM:", error);
        throw error;
      } finally {
        this.loading.pause = false;
      }
    },
  },
});
