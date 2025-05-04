<template>
  <Modal
    :model-value="isOpen"
    @update:model-value="$emit('close')"
    :primary-button="{
      text: 'Create Report',
      disabled: !isValid,
      loading: loading,
    }"
    :secondary-button="{ text: 'Cancel' }"
    @primary-click="handleSubmit"
    @secondary-click="$emit('close')"
  >
    <h2 class="text-xl font-semibold text-gray-900 mb-1">
      Generate New Report
    </h2>
    <p class="mb-6 text-gray-600">
      Create a detailed performance report for specific models. You will be
      notified when your report is ready.
    </p>
    <Form :fields="fields" v-model="formData" title="" subtitle="" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Project Models</label
        >
        <div class="flex flex-col gap-2">
          <label
            v-for="model in models"
            :key="model"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              :value="model"
              v-model="formData.models"
              class="accent-primary-500"
            />
            <span>{{ model }}</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Metrics</label
        >
        <div class="flex flex-col gap-2">
          <label
            v-for="metric in metricOptions"
            :key="metric"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              :value="metric"
              v-model="formData.metrics"
              class="accent-primary-500"
            />
            <span>{{ metric }}</span>
          </label>
        </div>
      </div>
    </div>
    <div v-if="formData.timeRange === 'Custom range'" class="mt-4">
      <Input
        modelValue=""
        placeholder="Select custom range (coming soon)"
        disabled
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import Modal from "../ui/Modal.vue";
import Input from "../ui/Input.vue";
import Form from "../ui/Form.vue";

const props = defineProps<{
  isOpen: boolean;
  loading?: boolean;
  models: string[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", payload: any): void;
}>();

const timeRangeOptions = [
  "Last 24 hours",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Custom range",
];

const metricOptions = [
  "Token usage",
  "Request count",
  "Response time",
  "Error rate",
];

const formatOptions = ["PDF", "CSV", "JSON", "Excel"];

const fields = [
  {
    name: "name",
    label: "Report Name",
    type: "text" as const,
    placeholder: "e.g. April LLM Reporting",
  },
  {
    name: "timeRange",
    label: "Time Range",
    type: "select" as const,
    options: timeRangeOptions.map((o) => ({ label: o, value: o })),
    placeholder: "Select time range",
  },
  {
    name: "format",
    label: "Report Format",
    type: "select" as const,
    options: formatOptions.map((o) => ({ label: o, value: o })),
    placeholder: "Select format",
  },
];

const formData = reactive({
  name: "",
  timeRange: "",
  models: [] as string[],
  metrics: [] as string[],
  format: "",
});

const isValid = computed(
  () =>
    formData.name &&
    formData.timeRange &&
    formData.models.length &&
    formData.metrics.length &&
    formData.format
);

const handleSubmit = () => {
  if (!isValid.value) return;
  emit("submit", { ...formData });
};
</script>
