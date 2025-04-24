<template>
  <div :class="['rounded-xl', borderClass, $attrs.class]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  border?: "solid" | "dashed" | "none";
}

const props = withDefaults(defineProps<Props>(), {
  border: "solid",
});

const borderClass = computed(() => {
  switch (props.border) {
    case "solid":
      return "border border-gray-200";
    case "dashed":
      return "border border-dashed border-gray-500";
    case "none":
      return "";
    default:
      return "border border-gray-200";
  }
});
</script>
