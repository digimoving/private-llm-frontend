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

    <FilesTable />

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
import { useFilesStore } from "../../../stores/files";
import FilesTable from "../../../components/metrics/FilesTable.vue";
import Button from "../../../components/ui/Button.vue";
import FileUpload from "../../../components/files/FileUpload.vue";
import { ArrowUpTrayIcon, XCircleIcon } from "@heroicons/vue/24/outline";

const showUploadModal = ref(false);
const filesStore = useFilesStore();

const handleFiles = async (fileList: FileList) => {
  await filesStore.uploadFiles(fileList);
  showUploadModal.value = false;
};

onMounted(() => {
  filesStore.loadFiles();
});
</script>
