<script setup lang="ts">
import Chip from "../ui/Chip.vue";

type Status = "active" | "paused" | "archived";

interface Props {
  status: Status;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
}

const props = withDefaults(defineProps<Props>(), {
  size: "xs",
});

const statusConfig = {
  active: {
    text: "Active",
    class: "bg-green-100 text-green-700",
  },
  paused: {
    text: "Paused",
    class: "bg-warning-50 text-warning-700",
  },
  archived: {
    text: "Archived",
    class: "bg-gray-400 text-gray-200",
  },
} as const;
</script>

<template>
  <Chip
    :size="size"
    :text="statusConfig[status].text"
    :class="statusConfig[status].class"
  />
</template>
