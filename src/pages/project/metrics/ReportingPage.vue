<template>
  <div class="space-y-6 px-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Reports</h2>
        <p class="mt-1 text-sm text-gray-500">
          Generated reports based on your chosen metrics.
        </p>
      </div>
      <Button
        :icon="PlusIcon"
        variant="primary"
        text="Generate Report"
        @click="openGenerateReportModal"
      />
    </div>

    <div v-if="reportsStore.error" class="rounded-md bg-error-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-error-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-error-800">Error</h3>
          <div class="mt-2 text-sm text-error-700">
            <p>{{ reportsStore.error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Table -->
    <Table
      :columns="columns"
      :items="reportsStore.reports"
      :loading="reportsStore.isLoading"
      class="px-8"
    >
      <!-- Models Column -->
      <template #models="{ item }">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="model in item.models"
            :key="model"
            class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
          >
            {{ model }}
          </span>
        </div>
      </template>

      <!-- Date Column -->
      <template #date="{ item }">
        <span class="text-gray-500">{{
          useDateFormat(item.date, "DD/MM/YYYY").value
        }}</span>
      </template>

      <!-- Actions Column -->
      <template #actions="{ item }">
        <div class="flex justify-end gap-2">
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
    </Table>

    <GenerateReportModal
      :is-open="showGenerateModal"
      :loading="false"
      :models="projectModels"
      @close="showGenerateModal = false"
      @submit="handleModalSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDateFormat } from "@vueuse/core";
import Table from "../../../components/ui/Table.vue";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import Button from "../../../components/ui/Button.vue";
import { useReportsStore } from "../../../stores/reports";
import GenerateReportModal from "../../../components/modals/GenerateReportModal.vue";

const reportsStore = useReportsStore();
const showGenerateModal = ref(false);

// Placeholder: Replace with actual LLMs for the project
const projectModels = ["Support Agent", "Content Generator"];

// Table configuration
const columns = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date", hideOnMobile: true },
  { key: "models", label: "Models" },
  { key: "metrics", label: "Metrics", hideOnTablet: true },
  { key: "format", label: "Format", hideOnMobile: true },
  { key: "timeRange", label: "Time Range", hideOnTablet: true },
  { key: "actions", label: "Actions" },
];

const openGenerateReportModal = () => {
  showGenerateModal.value = true;
};

function handleModalSubmit(payload: any) {
  // TODO: Actually create the report
  showGenerateModal.value = false;
}

onMounted(() => {
  reportsStore.loadReports();
});
</script>
