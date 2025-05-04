<!-- FilesPage.vue -->
<template>
  <div class="space-y-8">
    <div class="sm:flex sm:items-center sm:justify-end">
      <Button
        :icon="ArrowUpTrayIcon"
        text="Upload Files"
        variant="secondary"
        @click="showUploadModal = true"
      />
    </div>

    <div v-if="filesStore.error" class="rounded-md bg-error-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-error-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-error-800">Error</h3>
          <div class="mt-2 text-sm text-error-700">
            <p>{{ filesStore.error }}</p>
          </div>
        </div>
      </div>
    </div>

    <Table
      :columns="columns"
      :items="filesStore.files"
      :loading="filesStore.isLoading"
      class="px-8"
    >
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
        <span class="text-gray-500">{{
          useDateFormat(item.uploadDate, "DD/MM/YYYY").value
        }}</span>
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
            variant="icon"
            :loading="filesStore.downloadingFileIds.has(item.id)"
            @click="filesStore.downloadFile(item.id)"
          />
          <Button
            :icon="TrashIcon"
            variant="icon"
            :loading="filesStore.deletingFileIds.has(item.id)"
            @click="filesStore.deleteFile(item.id)"
          />
        </div>
      </template>
    </Table>

    <FileUpload
      :is-open="showUploadModal"
      :loading="filesStore.isLoading"
      @close="showUploadModal = false"
      @upload="handleFiles"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFilesStore } from "../../stores/files";
import { useDateFormat } from "@vueuse/core";
import Chip from "../../components/ui/Chip.vue";
import FileIcon from "../../components/files/FileIcon.vue";
import Table from "../../components/ui/Table.vue";
import Button from "../../components/ui/Button.vue";
import FileUpload from "../../components/files/FileUpload.vue";
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";

const showUploadModal = ref(false);
const filesStore = useFilesStore();

const columns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type", hideOnMobile: true },
  { key: "size", label: "Size", hideOnMobile: true },
  { key: "uploadDate", label: "Upload Date", hideOnTablet: true },
  { key: "tags", label: "Tags", hideOnTablet: true },
  { key: "actions", label: "Actions" },
];

const handleFiles = async (fileList: FileList) => {
  await filesStore.uploadFiles(fileList);
  showUploadModal.value = false;
};

onMounted(() => {
  filesStore.loadFiles();
});
</script>
