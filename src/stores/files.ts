import { defineStore } from "pinia";
import { ref } from "vue";
import type { File } from "../types/files";
import { filesApi } from "../api/api";

export const useFilesStore = defineStore("files", () => {
  const files = ref<File[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const deletingFileIds = ref<Set<string>>(new Set());
  const downloadingFileIds = ref<Set<string>>(new Set());

  async function loadFiles() {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await filesApi.list();
      files.value = response.files;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load files";
      console.error("Error loading files:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function uploadFiles(fileList: FileList) {
    try {
      isLoading.value = true;
      error.value = null;
      const uploadedFiles = await filesApi.create(fileList);
      // Add the uploaded files to our list
      files.value = [
        ...files.value,
        ...uploadedFiles.map((file) => ({
          ...file,
          uploadDate: new Date().toISOString().split("T")[0],
          tags: [],
        })),
      ];
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to upload files";
      console.error("Error uploading files:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteFile(fileId: string) {
    try {
      deletingFileIds.value.add(fileId);
      error.value = null;
      await filesApi.delete(fileId);
      // Remove the file from our list
      files.value = files.value.filter((file) => file.id !== fileId);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete file";
      console.error("Error deleting file:", err);
    } finally {
      deletingFileIds.value.delete(fileId);
    }
  }

  async function downloadFile(fileId: string) {
    try {
      downloadingFileIds.value.add(fileId);
      error.value = null;
      const blob = await filesApi.download(fileId);
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const file = files.value.find((f) => f.id === fileId);
      link.download = file?.name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to download file";
      console.error("Error downloading file:", err);
    } finally {
      downloadingFileIds.value.delete(fileId);
    }
  }

  return {
    files,
    isLoading,
    error,
    deletingFileIds,
    downloadingFileIds,
    loadFiles,
    uploadFiles,
    deleteFile,
    downloadFile,
  };
});
