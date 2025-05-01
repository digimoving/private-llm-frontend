<template>
  <div>
    <label v-if="label" class="block font-medium text-gray-900 mb-1">{{
      label
    }}</label>
    <textarea
      v-if="type === 'textarea'"
      ref="inputRef"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
      @blur="$emit('blur', $event)"
      :placeholder="placeholder"
      :rows="rows"
      class="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
    />
    <select
      v-else-if="type === 'select'"
      ref="inputRef"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
      @blur="$emit('blur', $event)"
      class="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
    >
      <option value="" disabled selected>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <input
      v-else
      ref="inputRef"
      :type="type"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      @blur="$emit('blur', $event)"
      :placeholder="placeholder"
      class="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
    />
    <p v-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  modelValue: string;
  label?: string;
  type?: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  helperText?: string;
  rows?: number;
  options?: { label: string; value: string }[];
}

withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  rows: 3,
  options: () => [],
});

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "blur", event: FocusEvent): void;
}>();

const inputRef = ref<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>();

defineExpose({
  focus: () => inputRef.value?.focus(),
});
</script>

<style scoped>
input::placeholder,
textarea::placeholder {
  font-size: 0.875rem; /* text-sm in Tailwind */
}
</style>
