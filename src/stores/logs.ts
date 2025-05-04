import { defineStore } from "pinia";
import { logsApi } from "../api/api";
import type { LogEntry } from "../types/types";

interface LoadingState {
  logs: boolean;
}

export const useLogsStore = defineStore("logs", {
  state: () => ({
    logs: [] as LogEntry[],
    totalLogs: 0,
    liveMode: false,
    error: null as string | null,
    loading: {
      logs: false,
    } as LoadingState,
    currentPage: 1,
    pageSize: 10,
  }),

  getters: {
    // Check if any loading operation is in progress
    isLoading: (state): boolean => {
      return Object.values(state.loading).some(
        (value: boolean) => value === true
      );
    },
    totalPages: (state) => Math.ceil(state.totalLogs / state.pageSize),
  },

  actions: {
    async loadLogs(page?: number) {
      const pageToLoad = page ?? this.currentPage;
      try {
        this.loading.logs = true;
        this.error = null;
        const { logs, total } = await logsApi.list(pageToLoad, this.pageSize);
        this.logs = logs;
        this.totalLogs = total;
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

    setPage(page: number) {
      this.currentPage = page;
      this.loadLogs(page);
    },
  },
});
