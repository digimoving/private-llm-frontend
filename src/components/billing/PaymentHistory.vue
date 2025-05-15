<template>
  <div>
    <div class="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-6">
      <PaymentCard
        v-for="(card, idx) in billingStore.cards"
        :key="card.id"
        :card="card"
        :isOnlyCard="billingStore.cards.length === 1"
        :onSetDefault="setDefault"
        :onDelete="deleteCard"
        :nextCardId="getNextCardId(idx)"
      />
    </div>

    <div class="mt-8">
      <Button
        @click="showAddCard = true"
        variant="secondary"
        text="Add payment method"
      />
      <Modal
        v-model="showAddCard"
        :primaryButton="{
          text: 'Add card',
          disabled: !addNewCardValid || addNewCardLoading,
          loading: addNewCardLoading,
        }"
        @primary-click="handleModalPrimaryClick"
        @secondary-click="showAddCard = false"
      >
        <AddNewCard
          ref="addNewCardRef"
          :loading="billingStore.loading.paymentMethod"
          @submit="handleAddCard"
          @cancel="showAddCard = false"
          modal
        />
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useBillingStore } from "../../stores/billing";
import AddNewCard from "./AddNewCard.vue";
import Button from "../ui/Button.vue";
import PaymentCard from "./PaymentCard.vue";
import Modal from "../ui/Modal.vue";

const billingStore = useBillingStore();
const showAddCard = ref(false);

const getNextCardId = (idx: number) => {
  // Return the next card's id, or the previous if at the end, or undefined if only one card
  if (billingStore.cards.length <= 1) return undefined;
  if (idx === billingStore.cards.length - 1)
    return billingStore.cards[idx - 1]?.id;
  return billingStore.cards[idx + 1]?.id;
};

const setDefault = async (id: string) => {
  await billingStore.setDefaultPaymentMethod(id);
};

const deleteCard = async (id: string) => {
  await billingStore.deletePaymentMethod(id);
};

const addNewCardRef = ref();
const addNewCardValid = computed(() => addNewCardRef.value?.isValid ?? false);
const addNewCardLoading = computed(() => addNewCardRef.value?.loading ?? false);

const handleModalPrimaryClick = () => {
  addNewCardRef.value?.submit();
};

const handleAddCard = async (form: Record<string, string>) => {
  // Parse expiry
  const [expMonth, expYear] = form.expiry.split("/");
  await billingStore.addPaymentMethod({
    cardNumber: form.cardNumber.replace(/-/g, ""),
    expiryMonth: Number(expMonth),
    expiryYear: Number("20" + expYear),
  });
  showAddCard.value = false;
};
</script>
