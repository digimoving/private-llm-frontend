<template>
  <div class="space-y-6">
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
    <ReportsTable />

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
import { ref, onMounted, computed } from "vue";
import ReportsTable from "../../../components/ui/ReportsTable.vue";
import { PlusIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import Button from "../../../components/ui/Button.vue";
import { useReportsStore } from "../../../stores/reports";
import GenerateReportModal from "../../../components/modals/GenerateReportModal.vue";
import { useLLMsStore } from "../../../stores/llms";

const reportsStore = useReportsStore();
const showGenerateModal = ref(false);
const llmsStore = useLLMsStore();
const projectModels = computed(() => llmsStore.llmNames);

const openGenerateReportModal = () => {
  showGenerateModal.value = true;
};

const handleModalSubmit = (payload: any) => {
  // TODO: Actually create the report
  showGenerateModal.value = false;
};

onMounted(() => {
  reportsStore.loadReports();
});
</script>
