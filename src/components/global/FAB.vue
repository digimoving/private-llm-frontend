<template>
  <button
    :aria-label="ariaLabel"
    class="fixed z-40 flex items-center justify-center rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
    :class="[positionClass, sizeClass, colorClass, customClass]"
    @click="$emit('click', $event)"
    type="button"
  >
    <component :is="icon" class="w-5 h-5 text-white" />
  </button>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";

const props = withDefaults(
  defineProps<{
    icon: any;
    ariaLabel?: string;
    positionClass?: string;
    sizeClass?: string;
    colorClass?: string;
    customClass?: string;
  }>(),
  {
    ariaLabel: "Open actions",
    positionClass: "right-4 bottom-4",
    sizeClass: "h-14 w-14",
    colorClass: "bg-primary-600 hover:bg-primary-700",
    customClass: "",
  }
);
</script>
