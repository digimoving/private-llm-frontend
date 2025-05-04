<template>
  <div class="space-y-6 px-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Request Logs</h2>
      <p class="mt-1 text-sm text-gray-500">
        Monitoring of API requests available at a glance or in real-time.
      </p>
    </div>
    <div class="flex items-center justify-between mb-2">
      <div />
      <Toggle
        :model-value="logsStore.liveMode"
        @update:model-value="handleToggle"
        label="Live Logs"
        :description="logsStore.liveMode ? 'On' : 'Off'"
      />
    </div>
    <Table
      :columns="columns"
      :items="logsStore.logs"
      :loading="logsStore.isLoading"
      class="px-0"
    >
      <template #model="{ item }">
        <Chip
          :text="item.model"
          size="xs"
          class="bg-gray-100 text-gray-700 font-medium"
        />
      </template>
      <template #status="{ item }">
        <Chip
          :text="item.status"
          size="xs"
          :class="{
            'bg-success-100 text-success-700': item.status === 'success',
            'bg-error-100 text-error-700': item.status === 'error',
            'bg-warning-100 text-warning-700': item.status === 'pending',
          }"
        />
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLogsStore } from "../../../stores/logs";
import Table from "../../../components/ui/Table.vue";
import Toggle from "../../../components/ui/Toggle.vue";
import Chip from "../../../components/ui/Chip.vue";

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

function handleToggle(val: boolean) {
  logsStore.setLiveMode(val);
}
</script>
