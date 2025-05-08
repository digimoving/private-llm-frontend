import { defineStore } from "pinia";
import type { File } from "../types/types";
import { filesApi } from "../api/api";

interface LoadingState {
  files: boolean;
  upload: boolean;
  delete: boolean;
  download: boolean;
}

export const useFilesStore = defineStore("files", {
  state: () => ({
    files: [] as File[],
    totalFiles: 0,
    currentPage: 1,
    pageSize: 10,
    error: null as string | null,
    loading: {
      files: false,
      upload: false,
      delete: false,
      download: false,
    } as LoadingState,
    deletingFileIds: new Set<string>(),
    downloadingFileIds: new Set<string>(),
  }),

  getters: {
    // Check if any loading operation is in progress
    isLoading: (state): boolean => {
      return Object.values(state.loading).some(
        (value: boolean) => value === true
      );
    },
    totalPages: (state) => Math.ceil(state.totalFiles / state.pageSize),
  },

  actions: {
    async loadFiles(page?: number) {
      const pageToLoad = page ?? this.currentPage;
      try {
        this.loading.files = true;
        this.error = null;
        const { files, total } = await filesApi.list(pageToLoad, this.pageSize);
        this.files = files.map((file) => ({
          ...file,
          size: file.size.toString(),
        }));
        this.totalFiles = total;
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to load files";
        console.error("Error loading files:", err);
      } finally {
        this.loading.files = false;
      }
    },

    setPage(page: number) {
      this.currentPage = page;
      this.loadFiles(page);
    },

    async uploadFiles(fileList: FileList) {
      try {
        this.loading.upload = true;
        this.error = null;
        const uploadedFiles = await filesApi.create(fileList);
        // Add the uploaded files to our list
        this.files = [
          ...this.files,
          ...uploadedFiles.map((file) => ({
            ...file,
            uploadDate: new Date().toISOString().split("T")[0],
            tags: [],
          })),
        ];
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to upload files";
        console.error("Error uploading files:", err);
      } finally {
        this.loading.upload = false;
      }
    },

    async deleteFile(fileId: string) {
      try {
        this.deletingFileIds.add(fileId);
        this.error = null;
        await filesApi.delete(fileId);
        // Remove the file from our list
        this.files = this.files.filter((file) => file.id !== fileId);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to delete file";
        console.error("Error deleting file:", err);
      } finally {
        this.deletingFileIds.delete(fileId);
      }
    },

    async downloadFile(fileId: string) {
      try {
        this.downloadingFileIds.add(fileId);
        this.error = null;
        const blob = await filesApi.download(fileId);
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const file = this.files.find((f) => f.id === fileId);
        link.download = file?.name || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : "Failed to download file";
        console.error("Error downloading file:", err);
      } finally {
        this.downloadingFileIds.delete(fileId);
      }
    },
  },
});
