<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :primary-button="{
      text: primaryButtonText,
      variant: 'danger',
      disabled: inputText !== confirmationText,
    }"
    @primary-click="handleConfirm"
    @secondary-click="$emit('update:modelValue', false)"
  >
    <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>

    <div class="mt-4 text-sm text-gray-600">
      <p>{{ description }}</p>

      <slot name="details" />

      <div class="mt-6">
        <p class="mb-2">
          {{ confirmationPrompt }}
          <span class="font-mono text-gray-900">{{ confirmationText }}</span>
          below.
        </p>
        <FormInput
          v-model="inputText"
          placeholder="Type to confirm"
          :class="{ 'border-red-300': showError }"
          @update:modelValue="showError = false"
        />
        <p v-if="showError" class="mt-1 text-sm text-red-600">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Modal from "../ui/Modal.vue";
import FormInput from "../ui/Input.vue";

interface Props {
  modelValue: boolean;
  projectName: string;
  title: string;
  description: string;
  primaryButtonText: string;
  confirmationPrompt?: string;
  errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  confirmationPrompt: "Confirm by typing",
  errorMessage:
    "Please type the project name exactly as shown above to confirm",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();

const inputText = ref("");
const showError = ref(false);

const confirmationText = computed(() => {
  return props.projectName.toLowerCase().replace(/\s+/g, "-");
});

const handleConfirm = () => {
  if (inputText.value !== confirmationText.value) {
    showError.value = true;
    return;
  }
  emit("confirm");
  emit("update:modelValue", false);
  inputText.value = "";
};
</script>
