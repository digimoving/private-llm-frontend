<template>
  <BillingModal
    :model-value="modelValue"
    title="Add to balance"
    :fields="fields"
    :initial-values="initialValues"
    primary-button-text="Add to balance"
    :loading="billingStore.loading.balance"
    :validate="validate"
    @submit="handleSubmit"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BillingModal from "./BillingModal.vue";
import { useBillingStore } from "../../stores/billing";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const billingStore = useBillingStore();

const fields = computed(() => [
  {
    name: "amount",
    label: "Amount",
    type: "number",
    placeholder: "Enter amount to add",
    helperText: "Enter the amount you want to add to your balance.",
    prefix: "£",
  },
  {
    name: "paymentMethod",
    label: "Payment Method",
    type: "select",
    placeholder: "Select payment method",
    options: billingStore.cards.map((card) => ({
      value: card.id,
      label: `${card.brand.toUpperCase()} •••• ${card.last4} (exp. ${card.expMonth}/${card.expYear})`,
    })),
  },
]);

const initialValues = {
  amount: "",
  paymentMethod: "",
};

const validate = (values: Record<string, string>) => {
  return values.amount.trim() !== "" && values.paymentMethod.trim() !== "";
};

const handleSubmit = async (values: Record<string, string>) => {
  const balanceData = {
    amount: parseFloat(values.amount),
    paymentMethodId: values.paymentMethod,
  };
  await billingStore.addBalance(balanceData);
  emit("update:modelValue", false);
};
</script>
