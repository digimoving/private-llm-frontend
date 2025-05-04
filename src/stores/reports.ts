import { defineStore } from "pinia";
import { ref } from "vue";
import type { Report } from "../types/reports";
import { reportsApi } from "../api/api";

export const useReportsStore = defineStore("reports", () => {
  const reports = ref<Report[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const deletingReportIds = ref<Set<string>>(new Set());
  const downloadingReportIds = ref<Set<string>>(new Set());

  async function loadReports() {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await reportsApi.list();
      reports.value = response.reports;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load reports";
      console.error("Error loading reports:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteReport(reportId: string) {
    try {
      deletingReportIds.value.add(reportId);
      error.value = null;
      await reportsApi.delete(reportId);
      // Remove the report from our list
      reports.value = reports.value.filter((report) => report.id !== reportId);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete report";
      console.error("Error deleting report:", err);
    } finally {
      deletingReportIds.value.delete(reportId);
    }
  }

  async function downloadReport(reportId: string) {
    try {
      downloadingReportIds.value.add(reportId);
      error.value = null;
      const blob = await reportsApi.download(reportId);
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const report = reports.value.find((r) => r.id === reportId);
      link.download = report?.name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to download report";
      console.error("Error downloading report:", err);
    } finally {
      downloadingReportIds.value.delete(reportId);
    }
  }

  return {
    reports,
    isLoading,
    error,
    deletingReportIds,
    downloadingReportIds,
    loadReports,
    deleteReport,
    downloadReport,
  };
});
