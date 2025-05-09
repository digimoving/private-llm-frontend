import { defineStore } from "pinia";
import type { Report } from "../types/types";
import { reportsApi } from "../api/api";

interface LoadingState {
  reports: boolean;
  delete: boolean;
  download: boolean;
  generate: boolean;
}

export const useReportsStore = defineStore("reports", {
  state: () => ({
    reports: [] as Report[],
    totalReports: 0,
    currentPage: 1,
    pageSize: 10,
    error: null as string | null,
    loading: {
      reports: false,
      delete: false,
      download: false,
      generate: false,
    } as LoadingState,
    deletingReportIds: new Set<string>(),
    downloadingReportIds: new Set<string>(),
  }),

  getters: {
    // Check if any loading operation is in progress
    isLoading: (state): boolean => {
      return Object.values(state.loading).some(
        (value: boolean) => value === true
      );
    },
    totalPages: (state) => Math.ceil(state.totalReports / state.pageSize),
  },

  actions: {
    async loadReports(page?: number) {
      const pageToLoad = page ?? this.currentPage;
      try {
        this.loading.reports = true;
        this.error = null;
        const { reports, total } = await reportsApi.list(
          pageToLoad,
          this.pageSize
        );
        // Convert metrics from string to string[] if needed
        this.reports = reports.map((report) => ({
          ...report,
          metrics: Array.isArray(report.metrics)
            ? report.metrics
            : [report.metrics],
        }));
        this.totalReports = total;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to load reports";
        console.error("Error loading reports:", err);
      } finally {
        this.loading.reports = false;
      }
    },

    setPage(page: number) {
      this.currentPage = page;
      this.loadReports(page);
    },

    async deleteReport(reportId: string) {
      try {
        this.deletingReportIds.add(reportId);
        this.error = null;
        await reportsApi.delete(reportId);
        // Remove the report from our list
        this.reports = this.reports.filter((report) => report.id !== reportId);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to delete report";
        console.error("Error deleting report:", err);
      } finally {
        this.deletingReportIds.delete(reportId);
      }
    },

    async downloadReport(reportId: string) {
      try {
        this.downloadingReportIds.add(reportId);
        this.error = null;
        const blob = await reportsApi.download(reportId);
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const report = this.reports.find((r) => r.id === reportId);
        link.download = report?.name || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to download report";
        console.error("Error downloading report:", err);
      } finally {
        this.downloadingReportIds.delete(reportId);
      }
    },

    async generateReport(data: {
      name: string;
      timeRange: string;
      models?: string[];
      metrics: string[];
      format: "csv" | "json" | "pdf";
    }) {
      try {
        this.loading.generate = true;
        this.error = null;
        const report = await reportsApi.generate(data);
        // Add the new report to our list
        this.reports = [report, ...this.reports];
        this.totalReports += 1;
        return report;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to generate report";
        console.error("Error generating report:", err);
        throw err;
      } finally {
        this.loading.generate = false;
      }
    },
  },
});
