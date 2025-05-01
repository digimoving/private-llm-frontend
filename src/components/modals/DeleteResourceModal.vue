<template>
  <ConfirmationModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :project-name="resourceName"
    :title="`Delete ${resourceType}`"
    :description="`This action cannot be undone. This will permanently delete the ${resourceType.toLowerCase()} and remove all associated data and resources.`"
    :primary-button-text="`Delete ${resourceType}`"
    @confirm="handleConfirm"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import ConfirmationModal from "../modals/ConfirmationModal.vue";
import { useLLMsStore } from "../../stores/llms";
import { useProjectsStore } from "../../stores/projects";

const props = defineProps<{
  modelValue: boolean;
  resourceId: string;
  resourceType: "LLM" | "Project";
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const llmsStore = useLLMsStore();
const projectsStore = useProjectsStore();

const resource = computed(() => {
  if (props.resourceType === "LLM") {
    return llmsStore.getLLMById(props.resourceId);
  }
  return projectsStore.getProjectById(props.resourceId);
});

const resourceName = computed(() => resource.value?.name ?? "");

const handleConfirm = async () => {
  if (!resource.value) return;

  if (props.resourceType === "LLM") {
    await llmsStore.deleteLLM(resource.value.id);
  } else {
    await projectsStore.deleteProject(resource.value.id);
  }
  emit("update:modelValue", false);
};
</script>
