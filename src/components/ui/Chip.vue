<script setup lang="ts">
type Size = "xs" | "sm" | "base" | "lg" | "xl";

interface Props {
  size?: Size;
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "base",
  text: undefined,
});

const sizeClasses = {
  xs: "text-xs px-3 py-1",
  sm: "text-sm px-3.5 py-1",
  base: "text-base px-4 py-1.5",
  lg: "text-lg px-4.5 py-2",
  xl: "text-xl px-5 py-2.5",
};
</script>

<template>
  <span
    class="inline-flex items-center rounded-full font-medium"
    :class="[sizeClasses[size]]"
  >
    <slot>{{ text }}</slot>
  </span>
</template>
