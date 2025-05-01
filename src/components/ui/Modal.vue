<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog class="relative z-10" @close="$emit('update:modelValue', false)">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <Button
                  variant="icon"
                  :icon="XMarkIcon"
                  @click="$emit('update:modelValue', false)"
                  aria-label="Close modal"
                  class="text-gray-400 hover:text-gray-500"
                />
              </div>

              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <DialogTitle
                    v-if="title"
                    as="h3"
                    class="text-base font-semibold text-gray-900"
                  >
                    {{ title }}
                  </DialogTitle>
                  <div class="mt-2">
                    <slot />
                  </div>
                </div>
              </div>

              <div
                v-if="primaryButton || secondaryButton"
                class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3"
              >
                <Button
                  v-if="primaryButton"
                  :variant="primaryButton.variant || 'primary'"
                  :disabled="primaryButton.disabled"
                  :loading="primaryButton.loading"
                  @click="$emit('primary-click')"
                  :text="primaryButton.text"
                />
                <Button
                  v-if="secondaryButton"
                  variant="secondary"
                  @click="$emit('secondary-click')"
                  :text="secondaryButton.text"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import Button from "./Button.vue";

interface Props {
  modelValue: boolean;
  title?: string;
  primaryButton?: {
    text: string;
    variant?: "primary" | "danger";
    disabled?: boolean;
    loading?: boolean;
  };
  secondaryButton?: {
    text?: string;
  };
}

withDefaults(defineProps<Props>(), {
  secondaryButton: () => ({ text: "Cancel" }),
});

defineEmits<{
  "update:modelValue": [value: boolean];
  "primary-click": [];
  "secondary-click": [];
}>();
</script>
