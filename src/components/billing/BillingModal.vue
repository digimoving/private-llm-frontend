<template>
  <Modal
    :model-value="modelValue"
    :title="title"
    :primary-button="{
      text: primaryButtonText,
      loading: loading,
      disabled: !isValid,
    }"
    :secondary-button="{ text: 'Cancel' }"
    @update:model-value="$emit('update:modelValue', $event)"
    @primary-click="handleSubmit"
    @secondary-click="handleCancel"
  >
    <Form
      :fields="fields"
      :initial-values="formValues"
      :key="formValues.paymentMethod"
      @update="handleFormUpdate"
    />
    <div class="mt-4">
      <Button
        v-if="!showNewCardForm"
        variant="flat"
        class="text-primary-600"
        :icon="PlusIcon"
        text="Add new payment method"
        @click="showNewCardForm = true"
      />
      <AddNewCard
        v-else
        :loading="billingStore.loading.paymentMethod"
        @submit="handleNewCardSubmit"
        @cancel="handleNewCardCancel"
      />
    </div>
    <slot name="footer" />
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import Modal from "../ui/Modal.vue";
import Form from "../ui/Form.vue";
import Button from "../ui/Button.vue";
import AddNewCard from "./AddNewCard.vue";
import { PlusIcon } from "@heroicons/vue/20/solid";
import { useBillingStore } from "../../stores/billing";

interface Props {
  modelValue: boolean;
  title: string;
  fields: any[];
  initialValues: Record<string, string>;
  primaryButtonText: string;
  loading?: boolean;
  validate?: (values: Record<string, string>) => boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", values: Record<string, string>): void;
  (e: "cancel"): void;
}>();

const billingStore = useBillingStore();
const formValues = ref({ ...props.initialValues });
const showNewCardForm = ref(false);

onMounted(() => {
  if (!billingStore.cards.length) {
    billingStore.fetchBilling();
  }
});

watch(
  () => props.initialValues,
  (newVals) => {
    formValues.value = { ...newVals };
  }
);

const isValid = computed(() => {
  if (props.validate) return props.validate(formValues.value);
  // Default: all fields must be non-empty strings
  return Object.values(formValues.value).every(
    (v) => typeof v === "string" && v.trim() !== ""
  );
});

const handleFormUpdate = (values: Record<string, string>) => {
  formValues.value = { ...formValues.value, ...values };
};

const handleNewCardSubmit = async (cardData: Record<string, string>) => {
  const expiryParts = cardData.expiry.split("/");
  const data = {
    cardNumber: cardData.cardNumber.replace(/-/g, ""),
    expiryMonth: parseInt(expiryParts[0]),
    expiryYear: parseInt(expiryParts[1]),
  };

  // Get the new card from the store action
  const response = await billingStore.addPaymentMethod(data);
  const newCard = response?.card;

  // Set the dropdown value to the new card's id
  if (newCard) {
    formValues.value.paymentMethod = newCard.id;
  }
  showNewCardForm.value = false;
};

const handleNewCardCancel = () => {
  showNewCardForm.value = false;
};

const handleSubmit = () => {
  emit("submit", { ...formValues.value });
};

const handleCancel = () => {
  emit("update:modelValue", false);
  emit("cancel");
};
</script>
