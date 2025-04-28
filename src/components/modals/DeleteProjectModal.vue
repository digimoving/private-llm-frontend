<template>
  <ConfirmationModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :project="project"
    title="Delete Project"
    description="This action cannot be undone. This will permanently delete the project and remove all associated data and LLM resources."
    primary-button-text="Delete Project"
    @confirm="$emit('confirm')"
  />
</template>

<script setup lang="ts">
import ConfirmationModal from "../ui/ConfirmationModal.vue";
import type { Project } from "../../data/projects";

defineProps<{
  modelValue: boolean;
  project: Project;
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();
</script>
