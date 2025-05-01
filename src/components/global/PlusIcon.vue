<template>
  <div
    class="rounded-full"
    :class="[
      disabled ? 'bg-gray-100' : 'bg-primary-50',
      size === 'sm' ? 'p-2' : 'p-4',
    ]"
  >
    <PlusIcon
      :class="[
        disabled ? 'text-gray-400' : 'text-primary-600',
        size === 'sm' ? 'w-5 h-5' : 'w-6 h-6',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/outline";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    size?: "sm" | "md";
  }>(),
  {
    disabled: false,
    size: "md",
  }
);
</script>
