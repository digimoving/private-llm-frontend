<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :primary-button="{
      text: resource ? `Update ${resourceType}` : `Create ${resourceType}`,
      disabled: !isValid,
      loading: loading,
    }"
    @primary-click="handleSubmit"
    @secondary-click="handleCancel"
  >
    <Form
      :title="resource ? `Edit ${resourceType}` : `Add New ${resourceType}`"
      :subtitle="
        resource
          ? `Update the details of your ${resourceType.toLowerCase()}.`
          : resourceType === 'Project'
            ? 'Fill in the details to create a new AI model project.'
            : 'Configure a new AI model to use in your project.'
      "
      :fields="formFields"
      :initial-values="initialValues"
      :use-grid="resourceType === 'LLM'"
      @update="handleFormUpdate"
    />
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Modal from "../ui/Modal.vue";
import Form from "../ui/Form.vue";
import type { FormField } from "../ui/Form.vue";
import { useProjectsStore } from "../../stores/projects";
import { useLLMsStore } from "../../stores/llms";

interface Props {
  modelValue: boolean;
  resourceId?: string;
  resourceType: "Project" | "LLM";
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const projectsStore = useProjectsStore();
const llmsStore = useLLMsStore();

const resource = computed(() => {
  if (!props.resourceId) return null;
  return props.resourceType === "Project"
    ? projectsStore.getProjectById(props.resourceId)
    : llmsStore.getLLMById(props.resourceId);
});

const getProjectFields = (): FormField[] => [
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

const getLLMFields = (): FormField[] => [
  {
    name: "name",
    label: "Resource Name",
    placeholder: "e.g. Support Assistant",
  },
  {
    name: "llmType",
    label: "LLM Type",
    type: "select",
    placeholder: "Select model type",
    options: [], // TODO: Add LLM type options
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "What will this LLM resource be used for?",
  },
  {
    name: "maxTokens",
    label: "Max Tokens",
    type: "number",
    placeholder: "4029",
  },
  {
    name: "temperature",
    label: "Temperature",
    type: "number",
    placeholder: "0.7",
  },
  {
    name: "tags",
    label: "Tags (comma-separated)",
    placeholder: "e.g. support, customer, chat",
  },
  {
    name: "trainingFiles",
    label: "Training files",
    type: "select",
    placeholder: "Select from uploaded files",
    options: [], // TODO: Add training files options
  },
];

const formFields = computed(() =>
  props.resourceType === "Project" ? getProjectFields() : getLLMFields()
);

interface ProjectFormValues {
  name: string;
  description: string;
  tags: string;
}

interface LLMFormValues {
  name: string;
  llmType: string;
  description: string;
  maxTokens: string;
  temperature: string;
  tags: string;
  trainingFiles: string;
}

type FormValues = ProjectFormValues | LLMFormValues;

const defaultProjectValues: ProjectFormValues = {
  name: "",
  description: "",
  tags: "",
};

const defaultLLMValues: LLMFormValues = {
  name: "",
  llmType: "",
  description: "",
  maxTokens: "4029",
  temperature: "0.7",
  tags: "",
  trainingFiles: "",
};

const getDefaultValues = () =>
  props.resourceType === "Project" ? defaultProjectValues : defaultLLMValues;

const formValues = ref<FormValues>(getDefaultValues());

const initialValues = computed(() => {
  if (!resource.value) return undefined;

  if (props.resourceType === "Project") {
    return {
      name: resource.value.name,
      description: resource.value.description,
      tags: resource.value.tags.join(", "),
    };
  }

  // TODO: Handle LLM initial values when store is available
  return undefined;
});

// Watch for changes to resource or modal open/close
watch(
  [resource, () => props.modelValue],
  ([newResource, newModelValue]) => {
    if (newModelValue) {
      if (newResource && props.resourceType === "Project") {
        formValues.value = {
          name: newResource.name,
          description: newResource.description,
          tags: newResource.tags.join(", "),
        };
      } else {
        formValues.value = getDefaultValues();
      }
    }
  },
  { immediate: true }
);

const isValid = computed(() => {
  return formValues.value.name.trim() !== "";
});

const loading = computed(() => {
  if (props.resourceType === "Project") {
    return resource.value
      ? projectsStore.loading.update
      : projectsStore.loading.create;
  }
  return llmsStore.isLoading;
});

const handleFormUpdate = (values: Record<string, string>) => {
  formValues.value = { ...formValues.value, ...values };
};

const handleSubmit = async () => {
  if (props.resourceType === "Project") {
    const projectData = {
      name: formValues.value.name.trim(),
      description: formValues.value.description.trim(),
      tags: formValues.value.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      archived: false,
      createdAt: new Date().toISOString(),
    };

    if (resource.value) {
      await projectsStore.updateProject(resource.value.id, projectData);
    } else {
      await projectsStore.createProject(projectData);
    }
  } else {
    // Type guard to ensure we have LLM form values
    if (!("llmType" in formValues.value)) return;

    const llmData = {
      name: formValues.value.name.trim(),
      type: formValues.value.llmType,
      description: formValues.value.description.trim(),
      maxTokens: parseInt(formValues.value.maxTokens),
      temperature: parseFloat(formValues.value.temperature),
      tags: formValues.value.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      trainingFiles: formValues.value.trainingFiles
        ? [formValues.value.trainingFiles]
        : [],
    };

    if (resource.value) {
      await llmsStore.updateLLM(resource.value.id, llmData);
    } else {
      await llmsStore.createLLM(llmData);
    }
  }

  emit("update:modelValue", false);
  formValues.value = getDefaultValues();
};

const handleCancel = () => {
  emit("update:modelValue", false);
  formValues.value = getDefaultValues();
};
</script>
