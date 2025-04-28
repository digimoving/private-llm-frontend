<template>
  <ConfirmationModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :project-name="project?.name ?? ''"
    title="Delete Project"
    description="This action cannot be undone. This will permanently delete the project and remove all associated data and LLM resources."
    primary-button-text="Delete Project"
    @confirm="handleConfirm"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import ConfirmationModal from "../modals/ConfirmationModal.vue";
import { useProjectsStore } from "../../stores/projects";

const props = defineProps<{
  modelValue: boolean;
  projectId: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const projectsStore = useProjectsStore();
const project = computed(() => projectsStore.getProjectById(props.projectId));

const handleConfirm = async () => {
  if (project.value) {
    await projectsStore.deleteProject(project.value.id);
  }
  emit("update:modelValue", false);
};
</script>
