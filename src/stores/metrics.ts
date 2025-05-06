import { defineStore } from "pinia";
import { metricsApi } from "../api/api";
import type { MetricsOverview } from "../types/types";

export const useMetricsStore = defineStore("metrics", {
  state: () => ({
    overview: null as MetricsOverview | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hasOverview: (state) => !!state.overview,
  },

  actions: {
    async fetchOverview() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await metricsApi.getOverview();
        this.overview = data;
      } catch (e: any) {
        this.error = e.message || "Failed to fetch metrics overview";
      } finally {
        this.loading = false;
      }
    },
  },
});
