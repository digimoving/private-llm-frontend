<template>
  <button
    v-bind="$attrs"
    :type="type"
    :class="[
      'inline-flex items-center font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200',
      sizeClasses,
      variantClasses,
      block ? 'w-full' : 'w-auto',
      disabled || loading
        ? 'opacity-50 hover:cursor-not-allowed'
        : 'cursor-pointer',
    ]"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :aria-disabled="disabled || loading"
  >
    <span v-if="loading" :class="{ 'mr-2': !icon }">
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
    <component v-else-if="icon" :is="icon" class="w-4 h-4" aria-hidden="true" />
    <span v-if="text" :class="{ 'ml-2': icon }">{{ text }}</span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from "vue";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "flat"
  | "icon";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: FunctionalComponent;
  text?: string;
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
  icon: "p-1.5",
}[props.variant === "icon" ? "icon" : props.size];

const variantClasses = {
  primary:
    "bg-primary-600 text-white [&:not(:disabled)]:hover:bg-primary-500 focus-visible:outline-primary-600 [&:not(:disabled)]:active:bg-primary-700",
  secondary:
    "bg-white text-gray-900 ring-1 ring-gray-300 ring-inset [&:not(:disabled)]:hover:bg-gray-50 [&:not(:disabled)]:active:bg-gray-100",
  danger:
    "bg-error-600 text-white [&:not(:disabled)]:hover:bg-error-500 focus-visible:outline-error-600 [&:not(:disabled)]:active:bg-error-700",
  flat: "bg-transparent text-gray-600 [&:not(:disabled)]:hover:text-gray-700 [&:not(:disabled)]:hover:bg-gray-50 focus-visible:outline-gray-600 shadow-none",
  icon: "text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full",
}[props.variant];
</script>
