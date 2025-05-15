<template>
  <div :class="modal ? 'p-0' : 'mt-4 p-4 border rounded-lg bg-gray-50'">
    <div v-if="!modal" class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-medium text-gray-900">Add new payment method</h3>
      <Button
        variant="flat"
        class="text-gray-500"
        :icon="XMarkIcon"
        text="Cancel"
        @click="handleCancel"
      />
    </div>
    <div class="space-y-4">
      <div>
        <label class="block font-medium text-gray-900 mb-1">Full name</label>
        <input
          v-model="form.fullName"
          type="text"
          placeholder="As displayed on card"
          class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
        <p class="mt-1 text-sm text-gray-500">
          Enter the name as it appears on your card
        </p>
      </div>

      <div>
        <label class="block font-medium text-gray-900 mb-1">Card number</label>
        <input
          v-model="form.cardNumber"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          placeholder="xxxx-xxxx-xxxx-xxxx"
          class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          @input="formatCardNumber"
        />
        <p class="mt-1 text-sm text-gray-500">
          Enter your 16-digit card number
        </p>
      </div>

      <div class="flex gap-4">
        <div class="w-1/2">
          <label class="block font-medium text-gray-900 mb-1"
            >Card expiration</label
          >
          <input
            v-model="form.expiry"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="MM/YY"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            @input="formatExpiry"
          />
          <p class="mt-1 text-sm text-gray-500">Enter card expiration date</p>
        </div>

        <div class="w-1/2">
          <label class="block font-medium text-gray-900 mb-1">CVV</label>
          <input
            v-model="form.cvv"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="***"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            @input="formatCVV"
          />
          <p class="mt-1 text-sm text-gray-500">Enter 3-digit security code</p>
        </div>
      </div>
    </div>

    <div v-if="!modal" class="mt-4 flex justify-end">
      <Button
        variant="primary"
        text="Save card"
        :loading="loading"
        :disabled="!isValid"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Button from "../ui/Button.vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";
import { toRefs } from "vue";

interface Props {
  loading?: boolean;
}

const props = withDefaults(defineProps<Props & { modal?: boolean }>(), {
  modal: false,
});
const modal = props.modal;
const emit = defineEmits<{
  (e: "submit", values: Record<string, string>): void;
  (e: "cancel"): void;
}>();

const form = ref({
  fullName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");
  if (value.length > 16) value = value.slice(0, 16);
  const formatted = value.replace(/(\d{4})(?=\d)/g, "$1-");
  form.value.cardNumber = formatted;
};

const formatExpiry = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");
  if (value.length > 4) value = value.slice(0, 4);
  if (value.length >= 2) {
    form.value.expiry = `${value.slice(0, 2)}/${value.slice(2)}`;
  } else {
    form.value.expiry = value;
  }
};

const formatCVV = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");
  if (value.length > 3) value = value.slice(0, 3);
  form.value.cvv = value;
};

const isValid = computed(() => {
  const { fullName, cardNumber, expiry, cvv } = form.value;
  const cardNumberDigits = cardNumber.replace(/-/g, "");
  const expiryParts = expiry.split("/");

  // Check if all fields are filled
  if (!fullName?.trim() || !cardNumber || !expiry || !cvv) return false;

  // Validate card number
  if (cardNumberDigits.length !== 16 || !/^\d+$/.test(cardNumberDigits))
    return false;

  // Validate expiry
  if (expiryParts.length !== 2) return false;
  const [month, year] = expiryParts;
  if (month.length !== 2 || year.length !== 2) return false;
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (monthNum < 1 || monthNum > 12) return false;
  if (
    yearNum < currentYear ||
    (yearNum === currentYear && monthNum < currentMonth)
  )
    return false;

  // Validate CVV
  if (cvv.length !== 3 || !/^\d+$/.test(cvv)) return false;

  return true;
});

const handleSubmit = () => {
  if (!isValid.value) return;
  emit("submit", { ...form.value });
};

const handleCancel = () => {
  form.value = {
    fullName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  };
  emit("cancel");
};

defineExpose({
  submit: handleSubmit,
  isValid,
  loading: props.loading,
});
</script>
