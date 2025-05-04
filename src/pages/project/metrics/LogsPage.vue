<template>
  <div class="px-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Request Logs</h2>
      <p class="mt-1 text-sm text-gray-500">
        Monitoring of API requests available at a glance or in real-time.
      </p>
    </div>
    <div class="flex items-center justify-between mb-2">
      <div />
      <div class="flex items-center gap-2">
        <Toggle
          :model-value="logsStore.liveMode"
          @update:model-value="handleToggle"
          :color="logsStore.liveMode ? 'success' : 'secondary'"
          :label="logsStore.liveMode ? 'Live Logs On' : 'Live Logs Off'"
        />
        <ArrowPathIcon
          v-if="logsStore.liveMode"
          class="h-5 w-5 text-gray-500 animate-[spin_2s_linear_infinite]"
        />
      </div>
    </div>
    <Table
      :columns="columns"
      :items="logsStore.logs"
      :loading="logsStore.isLoading"
      :current-page="logsStore.currentPage"
      :total-pages="logsStore.totalPages"
      :page-size="logsStore.pageSize"
      :total-items="logsStore.totalLogs"
      @pageChange="logsStore.setPage"
      class="w-full px-0"
    >
      <template #model="{ item }">
        <Chip
          :text="item.model"
          size="xs"
          class="bg-gray-100 text-gray-700 font-medium"
        />
      </template>
      <template #status="{ item }">
        <StatusChip :status="item.status" size="xs" />
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useLogsStore } from "../../../stores/logs";
import Table from "../../../components/ui/Table.vue";
import Toggle from "../../../components/ui/Toggle.vue";
import Chip from "../../../components/ui/Chip.vue";
import StatusChip from "../../../components/global/StatusChip.vue";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

const logsStore = useLogsStore();

const columns = [
  { key: "time", label: "Time" },
  { key: "requestId", label: "Request ID" },
  { key: "model", label: "Model" },
  { key: "user", label: "User" },
  { key: "prompt", label: "Prompt" },
  { key: "tokens", label: "Tokens" },
  { key: "latency", label: "Latency" },
  { key: "status", label: "Status" },
];

onMounted(() => {
  logsStore.loadLogs();
});

const handleToggle = (val: boolean) => {
  logsStore.setLiveMode(val);
};
</script>
