<template>
  <GenericTable :items="logsStore.logs" :columns="columns" item-key="requestId">
    <template #status="{ value }">
      <StatusChip :status="value" size="xs" />
    </template>

    <template #requestId="{ value }">
      <Chip :text="value" size="xs" class="border border-gray-200" />
    </template>

    <template #model="{ value }">
      <span
        class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
      >
        {{ value }}
      </span>
    </template>

    <template #user="{ value }">
      <Chip :text="value" size="xs" class="border border-gray-200" />
    </template>

    <template #prompt="{ value }">
      <span class="truncate max-w-xs">{{ value }}</span>
    </template>

    <template #promptMobile="{ value }">
      <div class="mt-1 break-words whitespace-pre-line text-gray-500">
        {{ value }}
      </div>
    </template>
  </GenericTable>
</template>

<script setup lang="ts">
import { useLogsStore } from "../../stores/logs";
import StatusChip from "../global/StatusChip.vue";
import Chip from "../ui/Chip.vue";
import GenericTable from "./GenericTable.vue";

const logsStore = useLogsStore();

const columns = [
  { label: "Time", key: "time" },
  { label: "Request ID", key: "requestId" },
  { label: "User", key: "user" },
  { label: "Model", key: "model" },
  { label: "Tokens", key: "tokens", align: "center" as const },
  { label: "Latency", key: "latency", align: "center" as const },
  { label: "Status", key: "status", align: "center" as const },
  { label: "Prompt", key: "prompt" },
];
</script>
