<!-- FilesPage.vue -->
<template>
  <div class="space-y-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Project Files</h1>
      </div>
      <div class="mt-4 sm:mt-0 sm:flex-none">
        <Button
          :icon="ArrowUpTrayIcon"
          text="Upload Files"
          variant="secondary"
          @click="showUploadModal = true"
        />
      </div>
    </div>

    <div class="mt-8 flow-root">
      <Table :columns="columns" :items="files">
        <template #name="{ item }">
          <div class="flex items-center gap-3">
            <FileIcon :type="item.type" />
            <span class="font-medium text-gray-900">{{ item.name }}</span>
          </div>
        </template>

        <template #type="{ item }">
          <span class="text-gray-500">{{ item.type }}</span>
        </template>

        <template #size="{ item }">
          <span class="text-gray-500">{{ item.size }}</span>
        </template>

        <template #uploadDate="{ item }">
          <span class="text-gray-500">{{ item.uploadDate }}</span>
        </template>

        <template #tags="{ item }">
          <div class="flex gap-1">
            <Chip
              v-for="tag in item.tags"
              :key="tag"
              size="xs"
              :text="tag"
              class="bg-secondary-100 text-secondary-700"
            />
          </div>
        </template>

        <template #actions="{ item }">
          <div class="flex justify-end gap-2">
            <Button
              :icon="ArrowDownTrayIcon"
              variant="secondary"
              @click="downloadFile(item)"
            />
            <Button
              :icon="TrashIcon"
              variant="secondary"
              @click="deleteFile(item)"
            />
          </div>
        </template>
      </Table>
    </div>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-x-0 bottom-0 bg-gray-100 border-t border-gray-200 rounded-t-lg transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-y-full': !showUploadModal }"
    >
      <div class="px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Upload Files</h2>
          <Button
            :icon="XMarkIcon"
            variant="secondary"
            @click="showUploadModal = false"
          />
        </div>
        <p class="text-sm text-gray-600 mb-4">
          Drag and drop or click to browse.
        </p>
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-12"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
          @click="fileInput?.click()"
        >
          <div class="text-center">
            <ArrowUpTrayIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-semibold text-gray-900">
              Drag files here or click to upload
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Support for JSON, CVS, TXT, PDF, images and more
            </p>
          </div>
        </div>
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Chip from "../../components/ui/Chip.vue";
import FileIcon from "../../components/files/FileIcon.vue";
import Table from "../../components/ui/Table.vue";
import Button from "../../components/ui/Button.vue";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

interface File {
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  tags: string[];
}

const showUploadModal = ref(false);
const fileInput = ref<HTMLInputElement>();

// Sample data - replace with actual data from your store
const files = ref<File[]>([
  {
    name: "training-data.json",
    type: "JSON",
    size: "1.95 MB",
    uploadDate: "2025-04-01",
    tags: ["training"],
  },
  {
    name: "product-catalogue.csv",
    type: "CSV",
    size: "500 KB",
    uploadDate: "2025-03-31",
    tags: ["product"],
  },
  {
    name: "support-examples.txt",
    type: "TXT",
    size: "82.03 KB",
    uploadDate: "2025-03-31",
    tags: ["support"],
  },
  {
    name: "brand-guidelines.pdf",
    type: "PDF",
    size: "3 MB",
    uploadDate: "2025-03-28",
    tags: ["brand", "guidelines"],
  },
  {
    name: "company-logo.png",
    type: "PNG",
    size: "250 KB",
    uploadDate: "2025-03-28",
    tags: ["brand", "logo", "image"],
  },
]);

const columns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "size", label: "Size" },
  { key: "uploadDate", label: "Upload Date" },
  { key: "tags", label: "Tags" },
  { key: "actions", label: "Actions" },
];

const handleFileDrop = (event: DragEvent) => {
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles) {
    handleFiles(droppedFiles);
  }
};

const handleFileSelect = (event: Event) => {
  const selectedFiles = (event.target as HTMLInputElement).files;
  if (selectedFiles) {
    handleFiles(selectedFiles);
  }
};

const handleFiles = (fileList: FileList) => {
  // Handle file upload logic here
  console.log("Files to upload:", fileList);
};

const downloadFile = (file: File) => {
  // Handle file download logic here
  console.log("Downloading file:", file);
};

const deleteFile = (file: File) => {
  // Handle file deletion logic here
  console.log("Deleting file:", file);
};
</script>
