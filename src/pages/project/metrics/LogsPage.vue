<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Request Logs</h2>
        <p class="mt-1 text-sm text-gray-500">
          Monitoring of API requests available at a glance or in real-time.
        </p>
      </div>
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

    <LogsTable />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useLogsStore } from "../../../stores/logs";
import LogsTable from "../../../components/metrics/LogsTable.vue";
import Toggle from "../../../components/ui/Toggle.vue";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

const logsStore = useLogsStore();

onMounted(() => {
  logsStore.loadLogs();
});

const handleToggle = (val: boolean) => {
  logsStore.setLiveMode(val);
};
</script>
