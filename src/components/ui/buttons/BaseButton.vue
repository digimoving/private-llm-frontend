<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  block?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const classes = computed(() => {
    const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variants: Record<Variant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    }

    const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
    }

    const width = props.block ? 'w-full' : 'w-auto'

    return [base, variants[props.variant || 'primary'], sizes[props.size || 'md'], width].join(' ')

})
</script>

<template>
  <button
    :type="props.type || 'button'"
    :class="classes"
    :disabled="props.disabled || props.loading"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <span v-if="props.loading" class="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    <slot />
  </button>
</template>
