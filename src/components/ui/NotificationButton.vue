<template>
  <button
    type="button"
    :class="[
      'relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden cursor-pointer',
      additionalClass,
    ]"
  >
    <span
      class="absolute top-0.75 right-0.75 h-2.5 w-2.5 bg-primary-500 rounded-full"
    />
    <span class="sr-only">View notifications</span>
    <BellIcon class="h-6 w-6" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { BellIcon } from "@heroicons/vue/24/outline";

interface Props {
  additionalClass?: string;
}

defineProps<Props>();
</script>
