<template>
  <div>
    <div class="mb-4">
      <div class="text-lg font-medium mb-1">Pay as you go</div>
      <div class="text-gray-700 text-sm flex items-center mb-1">
        Account balance
        <span class="ml-1" title="Your current available balance for API usage">
          <InformationCircleIcon class="h-4 w-4 text-gray-400" />
        </span>
      </div>
      <div class="text-3xl font-bold mb-4">£{{ balanceDisplay }}</div>
      <Button
        variant="secondary"
        class="mb-6"
        @click="showAddBalanceModal = true"
        text="Add to balance"
      />
    </div>
    <div
      class="border border-gray-200 rounded-lg p-6 flex items-start bg-white"
    >
      <InformationCircleIcon class="h-6 w-6 text-gray-400 mr-4 mt-1" />
      <div class="flex-1">
        <div class="font-semibold mb-1">
          Auto-recharge is
          <span>{{ autoRechargeEnabled ? "on" : "off" }}</span>
        </div>
        <div class="text-gray-700 text-sm mb-3">
          <template v-if="billingStore.autoRechargeEnabled">
            Automatic recharge is enabled. Your account will be topped up
            automatically when your balance falls below your chosen threshold,
            ensuring uninterrupted API access.
          </template>
          <template v-else>
            When your account balance reaches £0, your API requests will stop
            working. Enable automatic recharge to automatically keep your
            account balance topped up.
          </template>
        </div>
        <Button
          v-if="!autoRechargeEnabled"
          variant="secondary"
          @click="showConfigModal = true"
          text="Enable auto-recharge"
        />
        <Button
          v-else
          variant="secondary"
          @click="showDisableModal = true"
          text="Disable auto-recharge"
        />
      </div>
    </div>
    <EnableAutoRechargeModal v-model="showConfigModal" />
    <DisableAutoRechargeModal v-model="showDisableModal" />
    <AddBalanceModal v-model="showAddBalanceModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Button from "../../components/ui/Button.vue";
import { useBillingStore } from "../../stores/billing";
import EnableAutoRechargeModal from "../../components/billing/EnableAutoRechargeModal.vue";
import DisableAutoRechargeModal from "../../components/billing/DisableAutoRechargeModal.vue";
import AddBalanceModal from "../../components/billing/AddBalanceModal.vue";
import { InformationCircleIcon } from "@heroicons/vue/24/outline";

const billingStore = useBillingStore();

const balanceDisplay = computed(() => billingStore.balance.toFixed(2));
const autoRechargeEnabled = computed(() => billingStore.autoRechargeEnabled);

const showConfigModal = ref(false);
const showDisableModal = ref(false);
const showAddBalanceModal = ref(false);
</script>
