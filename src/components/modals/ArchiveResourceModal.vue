<template>
  <ConfirmationModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :project-name="resource?.name ?? ''"
    :title="`${resource?.archived ? 'Unarchive' : 'Archive'} ${resourceType}`"
    :description="description"
    :primary-button-text="`${resource?.archived ? 'Unarchive' : 'Archive'} ${resourceType}`"
    confirmation-prompt="To confirm you're happy to archive this project, type"
    @confirm="handleConfirm"
  >
    <template #details v-if="resourceType === 'Project'">
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
import { useLLMsStore } from "../../stores/llms";
import { useProjectsStore } from "../../stores/projects";
import { useRouter } from "vue-router";

const router = useRouter();

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

const description = computed(() => {
  if (props.resourceType === "Project") {
    return "Archived projects will be uneditable and hidden from the dashboard by default. All LLM resources associated with the project will be paused, meaning:";
  }
  return `Are you sure you want to ${resource.value?.archived ? "unarchive" : "archive"} this LLM? ${
    resource.value?.archived ? "Unarchiving" : "Archiving"
  } will ${resource.value?.archived ? "make it visible" : "hide it"} from the main list.`;
});

const handleConfirm = async () => {
  if (!resource.value) return;

  if (props.resourceType === "LLM") {
    await llmsStore.updateLLM(resource.value.id, {
      ...resource.value,
      archived: !resource.value.archived,
    });
  } else {
    await projectsStore.updateProject(resource.value.id, {
      archived: !resource.value.archived,
    });
    router.push("/projects");
  }
  emit("update:modelValue", false);
};
</script>
