<template>
  <div
    class="flex items-center justify-center w-full h-full"
    :class="containerClass"
  >
    <div
      class="animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
      :class="spinnerClass"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  size?: "sm" | "md" | "lg";
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  containerClass: "",
});

const spinnerClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-4 h-4";
    case "lg":
      return "w-8 h-8";
    default:
      return "w-6 h-6";
  }
});
</script>
