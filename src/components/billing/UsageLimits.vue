<template>
  <div>
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 class="text-xl font-bold mb-1">Usage Limits</h2>
      <p class="text-sm text-gray-600 mb-6">
        Set budget notifications and spending limits.
      </p>
      <!-- Current Usage -->
      <div class="mb-6">
        <div class="font-semibold text-base mb-1">Current usage</div>
        <div class="text-gray-600 text-sm mb-1">
          The current usage of your organisation this month.
        </div>
        <div class="text-3xl font-bold mb-2">
          £{{ formatAmount(limitsDisplay.currentUsage) }}
        </div>
        <!-- Progress Bar -->
        <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            class="h-full bg-primary-500 transition-all duration-300"
            :style="{
              width:
                Math.min(
                  (limitsDisplay.currentUsage / limitsDisplay.usageLimit) * 100,
                  100
                ) + '%',
            }"
          ></div>
        </div>
      </div>
      <!-- Usage Limit -->
      <div
        class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <div class="font-semibold text-base mb-1">Usage limit</div>
          <div class="text-gray-600 text-sm mb-1">
            The maximum usage allowed for your organisation each month.
          </div>
          <div class="text-3xl font-bold">
            £{{ formatAmount(limitsDisplay.usageLimit) }}
          </div>
        </div>
        <Button
          text="Request increase"
          variant="secondary"
          class="sm:ml-4 w-full sm:w-auto"
          @click="onRequestIncrease"
        />
      </div>
      <!-- Threshold Alerts -->
      <form
        @submit.prevent="onSave"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      >
        <div>
          <div class="font-semibold mb-1">Set Lower Threshold Alert</div>
          <div class="text-xs text-gray-600 mb-2">
            If your organisation exceeds this threshold in a given calendar
            month, an alert notification will be sent to your email.
          </div>
          <Input
            v-model="form.lowerThresholdStr"
            type="number"
            min="0"
            :max="limitsDisplay.usageLimit"
            :disabled="loading"
            class="w-full"
          >
            <template #prepend>£</template>
          </Input>
        </div>
        <div>
          <div class="font-semibold mb-1">Set Higher Threshold Alert</div>
          <div class="text-xs text-gray-600 mb-2">
            If your organisation exceeds this threshold in a given calendar
            month, an alert notification will be sent to your email.
          </div>
          <Input
            v-model="form.upperThresholdStr"
            type="number"
            min="0"
            :max="limitsDisplay.usageLimit"
            :disabled="loading"
            class="w-full"
          >
            <template #prepend>£</template>
          </Input>
        </div>
        <div class="md:col-span-2 flex justify-end mt-2">
          <Button
            :disabled="loading"
            :loading="loading"
            text="Save Changes"
            class="w-full sm:w-auto"
          />
        </div>
        <div v-if="error" class="text-error-600 mt-2 md:col-span-2">
          {{ error }}
        </div>
      </form>
    </div>
    <RequestLimitIncreaseModal
      v-model="showRequestLimitModal"
      @submitted="loadLimits"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useBillingStore } from "../../stores/billing";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";
import RequestLimitIncreaseModal from "./RequestLimitIncreaseModal.vue";

const billingStore = useBillingStore();
const loading = ref(false);
const error = ref("");

const form = reactive({
  lowerThreshold: 0,
  upperThreshold: 0,
  lowerThresholdStr: "0",
  upperThresholdStr: "0",
});

watch(
  () => form.lowerThresholdStr,
  (val) => {
    form.lowerThreshold = Number(val);
  }
);
watch(
  () => form.upperThresholdStr,
  (val) => {
    form.upperThreshold = Number(val);
  }
);

const limitsDisplay = computed(() => {
  const limits =
    (billingStore.limits as Partial<{
      currentUsage: number;
      usageLimit: number;
      lowerThreshold: number;
      upperThreshold: number;
    }>) || {};
  return {
    currentUsage: limits.currentUsage ?? 0,
    usageLimit: limits.usageLimit ?? 5000,
    lowerThreshold: limits.lowerThreshold ?? 0,
    upperThreshold: limits.upperThreshold ?? 0,
  };
});

const formatAmount = (amount: number) =>
  amount?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) ?? "0.00";

const loadLimits = async () => {
  loading.value = true;
  error.value = "";
  try {
    await billingStore.fetchLimits();
    if (billingStore.limits) {
      form.lowerThreshold = billingStore.limits.lowerThreshold;
      form.upperThreshold = billingStore.limits.upperThreshold;
      form.lowerThresholdStr = String(billingStore.limits.lowerThreshold);
      form.upperThresholdStr = String(billingStore.limits.upperThreshold);
    }
  } catch (e: any) {
    error.value = e?.message || "Failed to load limits";
  } finally {
    loading.value = false;
  }
};

onMounted(loadLimits);

const onSave = async () => {
  loading.value = true;
  error.value = "";
  try {
    await billingStore.updateLimits({
      lowerThreshold: form.lowerThreshold,
      upperThreshold: form.upperThreshold,
    });
  } catch (e: any) {
    error.value = e?.message || "Failed to save limits";
  } finally {
    loading.value = false;
  }
};

const showRequestLimitModal = ref(false);

const onRequestIncrease = () => {
  showRequestLimitModal.value = true;
};
</script>
