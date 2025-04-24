<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center font-semibold shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200',
      sizeClasses,
      variantClasses,
      block ? 'w-full' : 'w-auto',
      disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :aria-disabled="disabled || loading"
  >
    <span v-if="loading" class="mr-2">
      <svg
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
    <component
      v-else-if="icon"
      :is="icon"
      class="w-4 h-4 mr-2"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from "vue";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: FunctionalComponent;
  block?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "md",
  type: "button",
  block: false,
  disabled: false,
  loading: false,
});

const sizeClasses = {
  xs: "px-2 py-1 text-xs rounded-sm",
  sm: "px-2 py-1 text-sm rounded-sm",
  md: "px-2.5 py-1.5 text-sm rounded-md",
  lg: "px-3 py-2 text-sm rounded-md",
  xl: "px-3.5 py-2.5 text-sm rounded-md",
}[props.size];

const variantClasses = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600 active:bg-primary-700",
  secondary:
    "bg-white text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 active:bg-gray-100",
  danger:
    "bg-error-600 text-white hover:bg-error-500 focus-visible:outline-error-600 active:bg-error-700",
}[props.variant];
</script>
