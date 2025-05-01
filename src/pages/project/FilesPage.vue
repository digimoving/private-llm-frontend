<!-- FilesPage.vue -->
<template>
  <div class="space-y-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Project Files</h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all files in your project including their name, type, size,
          and upload date.
        </p>
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

    <FileUpload
      :is-open="showUploadModal"
      @close="showUploadModal = false"
      @upload="handleFiles"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Chip from "../../components/ui/Chip.vue";
import FileIcon from "../../components/files/FileIcon.vue";
import Table from "../../components/ui/Table.vue";
import Button from "../../components/ui/Button.vue";
import FileUpload from "../../components/files/FileUpload.vue";
import {
  ArrowUpTrayIcon,
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
  { key: "type", label: "Type", hideOnMobile: true },
  { key: "size", label: "Size", hideOnMobile: true },
  { key: "uploadDate", label: "Upload Date", hideOnTablet: true },
  { key: "tags", label: "Tags", hideOnTablet: true },
  { key: "actions", label: "Actions" },
];

const handleFiles = (fileList: FileList) => {
  // Handle file upload logic here
  console.log("Files to upload:", fileList);
  showUploadModal.value = false;
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
