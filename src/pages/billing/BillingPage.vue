<template>
  <div class="space-y-8">
    <Tabs
      :tabs="tabs"
      :active-tab="activeTab"
      @update:activeTab="activeTab = $event"
    />
    <div v-if="billingStore.loading.page" class="flex justify-center py-16">
      <LoadingSpinner size="lg" />
    </div>
    <div v-else>
      <Overview v-if="activeTab === 'overview'" />
      <PaymentHistory v-if="activeTab === 'payment'" />
      <History v-if="activeTab === 'history'" />
      <Credit v-if="activeTab === 'credit'" />
      <Preferences v-if="activeTab === 'preferences'" />
      <UsageLimits v-if="activeTab === 'limits'" />
      <!-- <Limits v-if="activeTab === 'limits'" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Tabs from "../../components/ui/Tabs.vue";
import { useBillingStore } from "../../stores/billing";
import LoadingSpinner from "../../components/ui/LoadingSpinner.vue";
import Overview from "../../components/billing/Overview.vue";
import PaymentHistory from "../../components/billing/PaymentHistory.vue";
import History from "../../components/billing/History.vue";
import Credit from "../../components/billing/Credit.vue";
import Preferences from "../../components/billing/Preferences.vue";
import UsageLimits from "../../components/billing/UsageLimits.vue";
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "payment", label: "Payment Methods" },
  { id: "history", label: "History" },
  { id: "credit", label: "Credit" },
  { id: "preferences", label: "Preferences" },
  { id: "limits", label: "Usage Limits" },
];
const activeTab = ref("overview");

const billingStore = useBillingStore();

onMounted(() => {
  billingStore.fetchBilling();
});
</script>
