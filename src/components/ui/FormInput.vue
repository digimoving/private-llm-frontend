<template>
  <div>
    <label v-if="label" class="block font-medium text-gray-900 mb-1">{{
      label
    }}</label>
    <textarea
      v-if="type === 'textarea'"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
      :placeholder="placeholder"
      :rows="rows"
      class="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
    />
    <input
      v-else
      :type="type"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :placeholder="placeholder"
      class="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
    />
    <p v-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  label?: string;
  type?: "text" | "textarea";
  placeholder?: string;
  helperText?: string;
  rows?: number;
}

withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  rows: 3,
});

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<style scoped>
input::placeholder,
textarea::placeholder {
  font-size: 0.875rem; /* text-sm in Tailwind */
}
</style>
