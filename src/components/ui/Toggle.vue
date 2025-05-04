<template>
  <SwitchGroup as="div" class="flex items-center">
    <Switch
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :class="[
        modelValue ? 'bg-indigo-600' : 'bg-gray-200',
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden',
      ]"
    >
      <span
        aria-hidden="true"
        :class="[
          modelValue ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
        ]"
      />
    </Switch>
    <SwitchLabel as="span" class="ml-3 text-sm">
      <span class="font-medium text-gray-900">{{ label }}</span>
      <span v-if="description" class="text-gray-500"> {{ description }}</span>
    </SwitchLabel>
  </SwitchGroup>
</template>

<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";

defineProps<{
  modelValue: boolean;
  label: string;
  description?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>
