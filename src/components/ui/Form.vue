<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
    <p class="text-sm text-gray-600">
      {{ subtitle }}
    </p>

    <form @submit.prevent class="mt-4">
      <div
        :class="[
          useGrid
            ? 'grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4'
            : 'space-y-4',
        ]"
      >
        <FormInput
          v-for="field in fields"
          :key="field.name"
          v-model="formData[field.name]"
          :label="field.label"
          :type="field.type"
          :placeholder="field.placeholder"
          :helper-text="field.helperText"
          :options="field.options"
          :prefix="field.prefix"
          :class="['w-full', field.type === 'textarea' ? 'col-span-2' : '']"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import FormInput from "./Input.vue";

export interface FormField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  helperText?: string;
  options?: { label: string; value: string }[];
  prefix?: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  fields: FormField[];
  initialValues?: Record<string, string>;
  useGrid?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({}),
  useGrid: false,
});

const emit = defineEmits<{
  (e: "update", values: Record<string, string>): void;
}>();

// Initialise formData with empty strings for all fields
const formData = reactive(
  Object.fromEntries(
    props.fields.map((field) => [
      field.name,
      props.initialValues[field.name] || "",
    ])
  )
);

watch(
  formData,
  (newValues) => {
    emit("update", { ...newValues });
  },
  { deep: true }
);
</script>
