<template>
  <Table
    :items="filesStore.files"
    :columns="columns"
    item-key="id"
    :show-pagination="true"
    :current-page="currentPage"
    :page-size="pageSize"
    :total-items="filesStore.totalFiles"
    @pageChange="filesStore.setPage($event)"
  >
    <template #name="{ value, item }">
      <div class="flex items-center gap-3">
        <FileIcon :type="item.type" />
        <span class="font-medium text-gray-900">{{ value }}</span>
      </div>
    </template>

    <template #tags="{ value }">
      <div class="flex gap-1">
        <Chip
          v-for="tag in value"
          :key="tag"
          size="xs"
          :text="tag"
          class="bg-secondary-100 text-secondary-700"
        />
      </div>
    </template>

    <template #uploadDate="{ value }">
      <span class="text-gray-500">{{
        useDateFormat(value, "DD/MM/YYYY").value
      }}</span>
    </template>

    <template #actions="{ item }">
      <div class="flex justify-center gap-2">
        <Button
          @click="filesStore.downloadFile(item.id)"
          :icon="ArrowDownTrayIcon"
          variant="icon"
          :loading="filesStore.downloadingFileIds.has(item.id)"
        />
        <Button
          :icon="TrashIcon"
          @click="filesStore.deleteFile(item.id)"
          variant="icon"
          :loading="filesStore.deletingFileIds.has(item.id)"
        />
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { useDateFormat } from "@vueuse/core";
import Button from "./Button.vue";
import Chip from "./Chip.vue";
import FileIcon from "../files/FileIcon.vue";
import { useFilesStore } from "../../stores/files";
import Table from "./Table.vue";

const filesStore = useFilesStore();

const columns = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type", hideOnMobile: true },
  { key: "size", label: "Size", hideOnMobile: true },
  { key: "uploadDate", label: "Upload Date", hideOnTablet: true },
  { key: "tags", label: "Tags", hideOnTablet: true },
  { key: "actions", label: "Actions", align: "center" as const },
];

const currentPage = computed({
  get: () => filesStore.currentPage,
  set: (val) => filesStore.setPage(val),
});
const pageSize = filesStore.pageSize;

onMounted(() => {
  filesStore.setPage(1);
});
</script>
