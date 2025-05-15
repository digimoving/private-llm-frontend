<template>
  <BillingModal
    :model-value="modelValue"
    title="Configure auto-recharge"
    :fields="fields"
    :initial-values="initialValues"
    primary-button-text="Enable auto-recharge"
    :loading="billingStore.loading.autoRecharge"
    :validate="validate"
    @submit="handleSubmit"
    @update:model-value="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BillingModal from "./BillingModal.vue";
import { useBillingStore } from "../../stores/billing";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const billingStore = useBillingStore();

const defaultValues = {
  rechargeAmount: "",
  thresholdAmount: "",
  paymentMethod: "",
};

const initialValues = ref({ ...defaultValues });

const fields = computed(() => [
  {
    name: "rechargeAmount",
    label: "Recharge amount",
    type: "text" as const,
    placeholder: "50.00",
    helperText: "Amount to add when balance is low",
    prefix: "£",
  },
  {
    name: "thresholdAmount",
    label: "Recharge threshold",
    type: "text" as const,
    placeholder: "10.00",
    helperText: "Recharge when balance falls below this amount",
    prefix: "£",
  },
  {
    name: "paymentMethod",
    label: "Payment method",
    type: "select" as const,
    options: billingStore.cards.map((card) => ({
      value: card.id,
      label: `${card.brand.toUpperCase()} •••• ${card.last4} (exp. ${card.expMonth}/${card.expYear})`,
    })),
    placeholder: "Select payment method",
  },
]);

const validate = (values: Record<string, string>) => {
  return (
    values.rechargeAmount.trim() !== "" &&
    values.thresholdAmount.trim() !== "" &&
    values.paymentMethod.trim() !== ""
  );
};

const handleSubmit = async (values: Record<string, string>) => {
  await billingStore.updateAutoRechargeSettings({
    rechargeAmount: parseFloat(values.rechargeAmount),
    triggerAmount: parseFloat(values.thresholdAmount),
    paymentMethodId: values.paymentMethod,
  });
  initialValues.value = { ...defaultValues };
  emit("update:modelValue", false);
};

const handleCancel = () => {
  initialValues.value = { ...defaultValues };
  emit("update:modelValue", false);
};
</script>
