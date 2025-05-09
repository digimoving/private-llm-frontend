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
      class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    />
    <SelectInput
      v-else-if="type === 'select'"
      ref="inputRef"
      :model-value="modelValue"
      :placeholder="placeholder"
      :options="options"
      @update:model-value="$emit('update:modelValue', $event)"
      @blur="$emit('blur', $event)"
    />
    <div v-else>
      <div
        v-if="prefix"
        class="flex items-center rounded-md bg-white px-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
      >
        <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
          {{ prefix }}
        </div>
        <input
          ref="inputRef"
          :type="type"
          :value="modelValue"
          @input="
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value
            )
          "
          @blur="$emit('blur', $event)"
          :placeholder="placeholder"
          class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
        />
      </div>

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
        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />
    </div>

    <p v-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SelectInput from "./SelectInput.vue";

interface Props {
  modelValue: string;
  label?: string;
  type?: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  helperText?: string;
  rows?: number;
  options?: { label: string; value: string }[];
  prefix?: string;
}

withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  rows: 3,
  options: () => [],
  prefix: "",
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
