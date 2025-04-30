<template>
  <div
    class="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
    @click="navigateToProject"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h3 class="font-semibold text-gray-900">{{ project.name }}</h3>
        <StatusChip :is-archived="project.archived" />
        <div class="flex flex-wrap gap-1">
          <Chip
            v-for="tag in project.tags"
            :key="tag"
            size="xs"
            :text="tag"
            class="bg-secondary-100 text-secondary-700 font-normal"
          />
        </div>
      </div>
      <ProjectActionsMenu :project="project" @menu-click="handleMenuClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "../../types/types";
import StatusChip from "../global/StatusChip.vue";
import ProjectActionsMenu from "./ProjectActionsMenu.vue";
import Chip from "../ui/Chip.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
  project: Project;
}>();

const emit = defineEmits<{
  (
    e: "menuClick",
    data: { action: "edit" | "archive" | "delete"; project: Project }
  ): void;
}>();

const navigateToProject = () => {
  router.push(`/projects/${props.project.id}/llms`);
};

const handleMenuClick = (event: {
  action: "edit" | "archive" | "delete";
  project: Project;
}) => {
  // Stop the click event from bubbling up to the card
  if (event instanceof Event) {
    event.stopPropagation();
  }
  emit("menuClick", event);
};
</script>
