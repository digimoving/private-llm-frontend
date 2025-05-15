<template>
  <Modal
    :model-value="modelValue"
    :title="'Disable auto-recharge'"
    :primaryButton="{ text: 'Disable auto-recharge', variant: 'danger' }"
    :secondaryButton="{ text: 'Cancel' }"
    @update:modelValue="$emit('update:modelValue', $event)"
    @primary-click="onDisable"
    @secondary-click="onCancel"
  >
    <p class="text-gray-700">
      Are you sure you want to disable auto-recharge? Your API requests will
      stop working when your balance reaches £0.
    </p>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "../ui/Modal.vue";
import { useBillingStore } from "../../stores/billing";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const billingStore = useBillingStore();

const onDisable = async () => {
  await billingStore.disableAutoRecharge();
  emit("update:modelValue", false);
};

const onCancel = () => {
  emit("update:modelValue", false);
};
</script>
