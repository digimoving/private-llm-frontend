<template>
  <ConfirmationModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :project-name="project?.name ?? ''"
    title="Archive Project"
    description="Archived projects will be uneditable and hidden from the dashboard by default. All LLM resources associated with the project will be paused, meaning:"
    primary-button-text="Archive Project"
    confirmation-prompt="To confirm you're happy to archive this project, type"
    @confirm="handleConfirm"
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
import { computed } from "vue";
import ConfirmationModal from "../modals/ConfirmationModal.vue";
import { useProjectsStore } from "../../stores/projects";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  modelValue: boolean;
  projectId: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const projectsStore = useProjectsStore();
const project = computed(() => {
  return (
    projectsStore.getProjectById(props.projectId) ??
    projectsStore.currentProject
  );
});

const handleConfirm = async () => {
  if (project.value) {
    await projectsStore.updateProject(project.value.id, {
      archived: !project.value.archived,
    });
  }
  emit("update:modelValue", false);
  router.push("/projects");
};
</script>
