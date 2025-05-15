<template>
  <SwitchGroup as="div" class="flex items-center">
    <Switch
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :class="[
        modelValue ? activeColorClass : 'bg-gray-200',
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
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
      <span class="font-normal text-gray-900">{{ label }}</span>
      <span v-if="description" class="text-gray-500 ml-2">
        {{ description }}</span
      >
    </SwitchLabel>
  </SwitchGroup>
</template>

<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import { computed } from "vue";

type ColorVariant = "secondary" | "success" | "warning" | "danger";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    label: string;
    description?: string;
    color?: ColorVariant;
  }>(),
  {
    color: "secondary",
  }
);

const activeColorClass = computed(() => {
  switch (props.color) {
    case "success":
      return "bg-success-600";
    case "warning":
      return "bg-warning-600";
    case "danger":
      return "bg-error-600";
    case "secondary":
    default:
      return "bg-primary-600";
  }
});

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>
