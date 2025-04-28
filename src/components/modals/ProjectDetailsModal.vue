<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :primary-button="{
      text: project ? 'Update Project' : 'Create Project',
      disabled: !isValid,
    }"
    @primary-click="handleSubmit"
    @secondary-click="handleCancel"
  >
    <Form
      :title="project ? 'Edit Project' : 'Create New Project'"
      :subtitle="
        project
          ? 'Update the details of your AI project.'
          : 'Fill in the details to create a new AI model project.'
      "
      :fields="formFields"
      :initial-values="
        project
          ? {
              name: project.name,
              description: project.description,
              tags: project.tags.join(', '),
            }
          : undefined
      "
      @update="handleFormUpdate"
    />
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Modal from "../ui/Modal.vue";
import Form from "../ui/Form.vue";
import type { FormField } from "../ui/Form.vue";
import type { Project } from "../../data/projects";

interface Props {
  modelValue: boolean;
  project?: Project;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [values: { name: string; description: string; tags: string }];
}>();

const formFields: FormField[] = [
  {
    name: "name",
    label: "Project name",
    placeholder: "Enter project name",
    helperText: "This will be displayed on your dashboard.",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter project description",
    helperText: "A brief explanation of your project's purpose.",
  },
  {
    name: "tags",
    label: "Tags (comma-separated)",
    placeholder: "e.g. support, customer, chat",
  },
];

const formValues = ref({
  name: props.project?.name || "",
  description: props.project?.description || "",
  tags: props.project?.tags.join(", ") || "",
});

const isValid = computed(() => {
  return formValues.value.name.trim() !== "";
});

const handleFormUpdate = (values: Record<string, string>) => {
  formValues.value = {
    name: values.name,
    description: values.description,
    tags: values.tags,
  };
};

const handleSubmit = () => {
  emit("submit", formValues.value);
  emit("update:modelValue", false);

  // Only reset form if it's create mode
  if (!props.project) {
    formValues.value = { name: "", description: "", tags: "" };
  }
};

const handleCancel = () => {
  emit("update:modelValue", false);

  // Reset to original values if in edit mode
  if (props.project) {
    formValues.value = {
      name: props.project.name,
      description: props.project.description,
      tags: props.project.tags.join(", "),
    };
  } else {
    formValues.value = { name: "", description: "", tags: "" };
  }
};
</script>
