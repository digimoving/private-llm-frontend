<template>
  <ConfirmationModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :project="project"
    title="Archive Project"
    description="Archived projects will be uneditable and hidden from the dashboard by default. All LLM resources associated with the project will be paused, meaning:"
    primary-button-text="Archive Project"
    confirmation-prompt="To confirm you're happy to archive this project, type"
    @confirm="$emit('confirm')"
  >
    <template #details>
      <ul class="mt-4 ml-5 list-disc space-y-2">
        <li>The model will stop processing new requests</li>
        <li>Existing data and configurations will be preserved</li>
        <li>No compute resources will be used</li>
      </ul>
    </template>
  </ConfirmationModal>
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
