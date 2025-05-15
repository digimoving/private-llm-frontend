<template>
  <div>
    <h2 class="text-lg font-semibold mb-1">Invoices</h2>
    <p class="text-sm text-gray-600 mb-4">
      Displaying invoices from the past 12 months. For old records, please
      contact support.
    </p>
    <Table
      :items="paginatedInvoices"
      :columns="columns"
      :item-key="'invoiceName'"
      :current-page="currentPage"
      :page-size="pageSize"
      :total-items="invoices.length"
      @page-change="handlePageChange"
    >
      <template #created="{ value }">
        <span>{{ formatDate(value) }}</span>
      </template>
      <template #cost="{ value }">
        <span>{{ formatCost(value) }}</span>
      </template>
      <template #status="{ value }">
        <Chip
          :class="
            value == 'paid'
              ? 'bg-success-100 text-success-700'
              : 'bg-error-100 text-error-700'
          "
          size="xs"
          >{{ statusLabel(value) }}</Chip
        >
      </template>
      <template #actions="{ item }">
        <Button
          :icon="ArrowDownTrayIcon"
          variant="icon"
          @click="downloadInvoice(item.invoiceName)"
        />
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useBillingStore } from "../../stores/billing";
import Table from "../ui/Table.vue";
import Chip from "../ui/Chip.vue";
import Button from "../ui/Button.vue";
import { ArrowDownTrayIcon } from "@heroicons/vue/24/outline";

const billingStore = useBillingStore();

onMounted(() => {
  billingStore.fetchHistory();
});

const invoices = computed(() => billingStore.history);
const currentPage = ref(1);
const pageSize = ref(10);

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return invoices.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(invoices.value.length / pageSize.value)
);

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const columns = [
  { key: "invoiceName", label: "Invoice name" },
  { key: "created", label: "Created" },
  { key: "cost", label: "Cost" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "center" as const },
];

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatCost = (cost: number) => `£${cost.toFixed(2)}`;

const statusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const downloadInvoice = (invoiceName: string) => {
  billingStore.downloadInvoice(invoiceName);
};
</script>
