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
      :initial-values="initialFormValues"
      :use-grid="resourceType === 'LLM'"
      @update="handleFormUpdate"
    />
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Modal from "../ui/Modal.vue";
import Form from "../ui/Form.vue";
import type { FormField } from "../ui/Form.vue";
import { useProjectsStore } from "../../stores/projects";
import { useLLMsStore } from "../../stores/llms";
import type { Project, LLMResource } from "../../types/types";

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
    options: [
      { value: "gpt-4", label: "GPT-4" },
      { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    ],
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
  llmType: "gpt-4",
  description: "",
  maxTokens: "4029",
  temperature: "0.7",
  tags: "",
  trainingFiles: "",
};

const getDefaultValues = () =>
  props.resourceType === "Project" ? defaultProjectValues : defaultLLMValues;

const formValues = ref<FormValues>(getDefaultValues());

const initialFormValues = computed(() => {
  const values = resource.value
    ? props.resourceType === "Project"
      ? {
          name: (resource.value as Project).name,
          description: (resource.value as Project).description || "",
          tags: (resource.value as Project).tags?.join(", ") || "",
        }
      : {
          name: (resource.value as LLMResource).name,
          llmType: (resource.value as LLMResource).type,
          description: (resource.value as LLMResource).description || "",
          maxTokens:
            (resource.value as LLMResource).maxTokens?.toString() || "4029",
          temperature:
            (resource.value as LLMResource).temperature?.toString() || "0.7",
          tags: (resource.value as LLMResource).tags?.join(", ") || "",
          trainingFiles:
            (resource.value as LLMResource).trainingFiles?.[0] || "",
        }
    : getDefaultValues();

  return Object.entries(values).reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );
});

const isValid = computed(() => {
  const values = formValues.value;
  if (props.resourceType === "Project") {
    return values.name.trim() !== "";
  }
  const llmValues = values as LLMFormValues;
  return llmValues.name.trim() !== "" && llmValues.llmType !== "";
});

const loading = computed(() => {
  if (props.resourceType === "Project") {
    return resource.value
      ? projectsStore.loading.update
      : projectsStore.loading.create;
  }
  return resource.value ? llmsStore.loading.update : llmsStore.loading.create;
});

const handleFormUpdate = (values: Record<string, string>) => {
  if (props.resourceType === "Project") {
    formValues.value = {
      name: values.name || "",
      description: values.description || "",
      tags: values.tags || "",
    };
  } else {
    formValues.value = {
      name: values.name || "",
      llmType: values.llmType || "gpt-4",
      description: values.description || "",
      maxTokens: values.maxTokens || "4029",
      temperature: values.temperature || "0.7",
      tags: values.tags || "",
      trainingFiles: values.trainingFiles || "",
    };
  }
};

const handleSubmit = async () => {
  if (props.resourceType === "Project") {
    const values = formValues.value as ProjectFormValues;
    const projectData = {
      name: values.name.trim(),
      description: values.description.trim(),
      tags: values.tags
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
    const values = formValues.value as LLMFormValues;
    const llmData = {
      name: values.name.trim(),
      type: values.llmType,
      description: values.description.trim(),
      maxTokens: parseInt(values.maxTokens),
      temperature: parseFloat(values.temperature),
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      trainingFiles: values.trainingFiles ? [values.trainingFiles] : [],
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
