<template>
  <Modal
    :model-value="modelValue"
    :title="'Request usage limit increase'"
    :primary-button="{
      text: 'Submit request',
      disabled: !canSubmit,
      loading: loading,
    }"
    :secondary-button="{ text: 'Cancel' }"
    @update:model-value="$emit('update:modelValue', $event)"
    @primary-click="onSubmit"
    @secondary-click="onCancel"
  >
    <div class="mb-2 text-gray-700">
      Tell us more about your usage needs and we'll review your request.
    </div>
    <div class="space-y-4">
      <div>
        <label class="block font-semibold mb-1">Requested monthly limit</label>
        <Input v-model="requestedLimitStr" type="number" min="0" class="w-full">
          <template #prepend>£</template>
        </Input>
      </div>
      <div>
        <label class="block font-semibold mb-1">Reason for increase</label>
        <Input
          v-model="reason"
          type="textarea"
          class="w-full"
          placeholder="Please describe your use case and why you need a higher limit."
        />
      </div>
      <div v-if="error" class="text-error-600">{{ error }}</div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Modal from "../ui/Modal.vue";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";
import { useBillingStore } from "../../stores/billing";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submitted: [];
}>();

const requestedLimitStr = ref("");
const reason = ref("");
const loading = ref(false);
const error = ref("");

const canSubmit = computed(() => {
  const limit = Number(requestedLimitStr.value);
  return limit > 0 && !!reason.value && !loading.value;
});

const billingStore = useBillingStore();

const onCancel = () => {
  emit("update:modelValue", false);
};

const onSubmit = async () => {
  loading.value = true;
  error.value = "";
  try {
    await billingStore.requestLimitIncrease({
      requestedLimit: Number(requestedLimitStr.value),
      reason: reason.value,
    });
    emit("update:modelValue", false);
    emit("submitted");
  } catch (e: any) {
    error.value = e?.message || "Failed to submit request";
  } finally {
    loading.value = false;
  }
};
</script>
