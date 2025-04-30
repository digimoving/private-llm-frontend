<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
    <p class="text-sm text-gray-600">
      {{ subtitle }}
    </p>

    <form @submit.prevent class="mt-4 space-y-4">
      <FormInput
        v-for="field in fields"
        :key="field.name"
        v-model="formData[field.name]"
        :label="field.label"
        :type="field.type"
        :placeholder="field.placeholder"
        :helper-text="field.helperText"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import FormInput from "./Input.vue";

export interface FormField {
  name: string;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
  helperText?: string;
}

interface Props {
  title: string;
  subtitle: string;
  fields: FormField[];
  initialValues?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({}),
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
