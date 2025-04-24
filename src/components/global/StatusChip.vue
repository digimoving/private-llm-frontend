<script setup lang="ts">
import Chip from "../ui/Chip.vue";

interface Props {
  isArchived: boolean;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
}

const props = withDefaults(defineProps<Props>(), {
  size: "xs",
});
</script>

<template>
  <Chip
    :size="size"
    :text="isArchived ? 'Archived' : 'Active'"
    :class="{
      'bg-green-100 text-green-700': !isArchived,
      'bg-gray-100 text-gray-700': isArchived,
    }"
  />
</template>
