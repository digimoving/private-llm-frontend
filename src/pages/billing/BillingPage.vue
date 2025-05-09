<template>
  <div class="space-y-8">
    <Tabs
      :tabs="tabs"
      :active-tab="activeTab"
      @update:activeTab="activeTab = $event"
    />
    <div v-if="accountStore.billing.loading" class="flex justify-center py-16">
      <LoadingSpinner size="lg" />
    </div>
    <div v-else>
      <div v-if="activeTab === 'overview'">
        <div class="mb-8">
          <div class="text-lg font-medium mb-1">Pay as you go</div>
          <div class="text-gray-700 text-sm flex items-center mb-1">
            Account balance
            <span
              class="ml-1"
              title="Your current available balance for API usage"
            >
              <InformationCircleIcon class="h-4 w-4 text-gray-400" />
            </span>
          </div>
          <div class="text-3xl font-bold mb-4">£{{ balanceDisplay }}</div>
          <Button
            variant="secondary"
            size="md"
            class="mb-6"
            @click="showAddBalanceModal = true"
            text="Add to balance"
          />
        </div>
        <div class="border rounded-lg p-6 flex items-start bg-white">
          <InformationCircleIcon class="h-6 w-6 text-gray-400 mr-4 mt-1" />
          <div class="flex-1">
            <div class="font-semibold mb-1">
              Auto-recharge is <span v-if="!autoRechargeEnabled">off</span
              ><span v-else>on</span>
            </div>
            <div class="text-gray-700 text-sm mb-3">
              When your account balance reaches £0, your API requests will stop
              working. Enable automatic recharge to automatically keep your
              account balance topped up.
            </div>
            <Button
              v-if="!autoRechargeEnabled"
              variant="secondary"
              @click="showConfigModal = true"
            >
              Enable auto-recharge
            </Button>
            <Button v-else variant="secondary" @click="showDisableModal = true">
              Disable auto-recharge
            </Button>
          </div>
        </div>
      </div>
      <!-- Other tabs can be implemented as needed -->
    </div>
    <EnableAutoRechargeModal v-model="showConfigModal" />
    <DisableAutoRechargeModal v-model="showDisableModal" />
    <AddBalanceModal v-model="showAddBalanceModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Button from "../../components/ui/Button.vue";
import Tabs from "../../components/ui/Tabs.vue";
import { useAccountStore } from "../../stores/account";
import LoadingSpinner from "../../components/ui/LoadingSpinner.vue";
import EnableAutoRechargeModal from "../../components/billing/EnableAutoRechargeModal.vue";
import DisableAutoRechargeModal from "../../components/billing/DisableAutoRechargeModal.vue";
import { InformationCircleIcon } from "@heroicons/vue/24/outline";
import AddBalanceModal from "../../components/billing/AddBalanceModal.vue";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "payment", label: "Payment Methods" },
  { id: "history", label: "History" },
  { id: "credit", label: "Credit" },
  { id: "preferences", label: "Preferences" },
  { id: "limits", label: "Usage Limits" },
];
const activeTab = ref("overview");

const accountStore = useAccountStore();

const balanceDisplay = computed(() => accountStore.billing.balance.toFixed(2));
const autoRechargeEnabled = computed(
  () => accountStore.billing.autoRechargeEnabled
);

const showConfigModal = ref(false);
const showDisableModal = ref(false);
const showAddBalanceModal = ref(false);

const enableAutoRecharge = async () => {
  await accountStore.setAutoRecharge(true);
};

onMounted(() => {
  accountStore.fetchBilling();
});
</script>
