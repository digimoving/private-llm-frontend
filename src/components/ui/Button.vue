<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center font-semibold shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      sizeClasses,
      variantClasses,
      block ? 'w-full' : 'w-auto',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    :disabled="disabled"
  >
    <component v-if="icon" :is="icon" class="w-4 h-4 mr-2" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from "vue";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

const props = defineProps<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: FunctionalComponent;
  block?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}>();

const variant = props.variant ?? "primary";
const size = props.size ?? "md";
const type = props.type ?? "button";

const sizeClasses = {
  xs: "px-2 py-1 text-xs rounded-sm",
  sm: "px-2 py-1 text-sm rounded-sm",
  md: "px-2.5 py-1.5 text-sm rounded-md",
  lg: "px-3 py-2 text-sm rounded-md",
  xl: "px-3.5 py-2.5 text-sm rounded-md",
}[size];

const variantClasses = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600",
  secondary:
    "bg-white text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50",
  danger:
    "bg-error-600 text-white hover:bg-error-500 focus-visible:outline-error-600",
}[variant];
</script>
