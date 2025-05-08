<template>
  <GenericTable :items="reportsStore.reports" :columns="columns" item-key="id">
    <template #models="{ value }">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="model in value"
          :key="model"
          class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
        >
          {{ model }}
        </span>
      </div>
    </template>

    <template #date="{ value }">
      <span class="text-gray-500">{{
        useDateFormat(value, "DD/MM/YYYY").value
      }}</span>
    </template>

    <template #actions="{ item }">
      <div class="flex justify-center gap-2">
        <Button
          @click="reportsStore.downloadReport(item.id)"
          :icon="ArrowDownTrayIcon"
          variant="icon"
          :loading="reportsStore.downloadingReportIds.has(item.id)"
        />
        <Button
          :icon="TrashIcon"
          @click="reportsStore.deleteReport(item.id)"
          variant="icon"
          :loading="reportsStore.deletingReportIds.has(item.id)"
        />
      </div>
    </template>
  </GenericTable>
</template>

<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/vue/24/outline";
import Button from "../ui/Button.vue";
import { useReportsStore } from "../../stores/reports";
import GenericTable from "./GenericTable.vue";

const reportsStore = useReportsStore();

const columns = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date", hideOnMobile: true },
  { key: "models", label: "Models" },
  { key: "metrics", label: "Metrics", hideOnMobile: true },
  { key: "format", label: "Format", hideOnMobile: true },
  { key: "timeRange", label: "Time Range", hideOnMobile: true },
  { key: "actions", label: "Actions", align: "center" as const },
];
</script>
