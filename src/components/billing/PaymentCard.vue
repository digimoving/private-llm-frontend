<template>
  <div
    class="border border-gray-200 rounded-lg px-6 pt-6 pb-4 bg-white flex flex-col justify-between h-full relative"
  >
    <div class="flex items-center gap-1 mb-2">
      <img
        :src="getCardImage(props.card.brand)"
        :alt="props.card.brand"
        class="h-6 w-10 object-contain mr-1"
      />
      <div class="text-sm">•••• •••• •••• {{ props.card.last4 }}</div>
    </div>
    <div class="text-xs text-gray-600 mb-8">
      Expires {{ props.card.expMonth }}/{{ props.card.expYear }}
    </div>
    <div class="relative mt-auto" style="min-height: 40px">
      <div class="absolute left-0 bottom-2">
        <Button
          v-if="!props.card.isDefault"
          size="xs"
          @click="() => props.onSetDefault(props.card.id)"
          text="Set as default"
        />
        <Chip v-else class="bg-gray-100 text-gray-600" size="xs">Default</Chip>
      </div>
      <Button
        :icon="TrashIcon"
        variant="icon"
        size="sm"
        :disabled="isOnlyCard || deleting"
        :loading="deleting"
        aria-label="Delete card"
        @click="openConfirm = true"
        class="absolute right-0 bottom-2"
      />
    </div>

    <ConfirmationModal
      v-if="openConfirm"
      :modelValue="openConfirm"
      title="Delete Card"
      description="Are you sure you want to delete this card?"
      primaryButtonText="Delete"
      :requireInput="false"
      @update:modelValue="openConfirm = $event"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "../ui/Button.vue";
import ConfirmationModal from "../modals/ConfirmationModal.vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import Chip from "../ui/Chip.vue";

interface Card {
  id: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

const props = defineProps<{
  card: Card;
  isOnlyCard: boolean;
  onSetDefault: (id: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  nextCardId?: string;
}>();

const openConfirm = ref(false);
const deleting = ref(false);

const supportedBrands = ["visa", "mastercard", "amex"];
const getCardImage = (brand: string) => {
  const brandKey = brand.toLowerCase();
  if (supportedBrands.includes(brandKey)) {
    return `/assets/cards/${brandKey}.svg`;
  }
  return "/assets/cards/default.svg";
};

const handleDelete = async () => {
  deleting.value = true;
  openConfirm.value = false;
  try {
    if (props.card.isDefault && props.nextCardId) {
      await props.onSetDefault(props.nextCardId);
    }
    await props.onDelete(props.card.id);
  } finally {
    deleting.value = false;
  }
};
</script>
