import { defineStore } from "pinia";
import { logsApi } from "../api/api";
import type { LogEntry } from "../types/types";

interface LoadingState {
  logs: boolean;
}

export const useLogsStore = defineStore("logs", {
  state: () => ({
    logs: [] as LogEntry[],
    isLoading: false,
    liveMode: false,
    error: null as string | null,
    loading: {
      logs: false,
    } as LoadingState,
  }),

  getters: {
    // Check if any loading operation is in progress
    isLoading: (state): boolean => {
      return Object.values(state.loading).some(
        (value: boolean) => value === true
      );
    },
  },

  actions: {
    async loadLogs() {
      try {
        this.loading.logs = true;
        this.error = null;
        this.logs = await logsApi.list();
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "An error occurred";
        console.error("Failed to load logs:", error);
        throw error;
      } finally {
        this.loading.logs = false;
      }
    },

    setLiveMode(val: boolean) {
      this.liveMode = val;
      // In the future, start/stop websocket here
      if (!val) this.loadLogs(); // reload static logs when switching back
    },
  },
});
