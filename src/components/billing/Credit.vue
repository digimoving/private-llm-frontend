<template>
  <div>
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 class="text-xl font-bold mb-1">Available Credit</h2>
      <p class="text-sm text-gray-600">
        You have £{{ formatAmount(totalCredit) }} in credit available to use
        across all projects
      </p>
      <div class="overflow-x-auto">
        <Table
          :columns="columns"
          :items="sources"
          :pagination="false"
          :item-key="'source'"
          class="mb-6"
        >
          <template #amount="{ value }">
            <span>£{{ formatAmount(value) }}</span>
          </template>
          <template #status="{ value }">
            <Chip
              size="xs"
              :class="
                value == 'active'
                  ? 'bg-success-100 text-success-700'
                  : 'bg-error-100 text-error-700'
              "
              >{{ statusLabel(value) }}</Chip
            >
          </template>
          <template #expires="{ value }">
            <span>{{ formatDate(value) }}</span>
          </template>
        </Table>
      </div>
      <div>
        <label class="block text-base font-medium mb-2"
          >Enter credit amount to add to your account balance.</label
        >
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <Input
            v-model="redeemAmount"
            type="number"
            min="1"
            :max="totalCredit"
            class="w-full sm:w-40"
            :disabled="loading"
            placeholder="10.00"
            @keydown.enter="onRedeem"
          >
            <template #prepend>£</template>
          </Input>
          <Button
            :disabled="!canRedeem || loading"
            @click="onRedeem"
            variant="secondary"
            class="sm:ml-2"
          >
            Redeem Credit
          </Button>
        </div>
        <div v-if="error" class="text-error-600 mt-2">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBillingStore } from "../../stores/billing";
import Table from "../ui/Table.vue";
import Chip from "../ui/Chip.vue";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";

const billingStore = useBillingStore();
const redeemAmount = ref("");

onMounted(() => {
  billingStore.fetchCredit();
});

const totalCredit = computed(() => billingStore.credit.totalCredit || 0);
const sources = computed(() => billingStore.credit.sources || []);
const loading = computed(() => billingStore.loading.credit);
const error = computed(() => billingStore.error);

const columns = [
  { key: "amount", label: "Amount" },
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  { key: "expires", label: "Expires", align: "right" as const },
];

const formatAmount = (amount: number) => amount.toFixed(2);
const formatDate = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
const statusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const canRedeem = computed(() => {
  const amt = Number(redeemAmount.value);
  return amt > 0 && amt <= totalCredit.value && !loading.value;
});

const onRedeem = async () => {
  if (!canRedeem.value) return;
  try {
    await billingStore.redeemCredit(Number(redeemAmount.value));
    redeemAmount.value = "";
  } catch (e) {}
};
</script>

<style scoped>
@media (max-width: 640px) {
  .min-w-full {
    min-width: 500px;
  }
}
</style>
