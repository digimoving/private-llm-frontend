<template>
  <div
    class="relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200 flex flex-col h-full"
  >
    <div class="flex items-center justify-between">
      <StatusChip :is-archived="project.archived" />
      <ProjectActionsMenu
        :project="project"
        @menu-click="$emit('menuClick', $event)"
      />
    </div>

    <h3 class="font-semibold text-gray-900 text-lg">
      {{ project.name }}
    </h3>
    <p class="text-sm text-gray-600 mt-2 line-clamp-2">
      {{ project.description }}
    </p>

    <div class="flex flex-wrap gap-1 my-3">
      <Chip
        v-for="tag in project.tags"
        :key="tag"
        size="xs"
        :text="tag"
        class="bg-secondary-100 text-secondary-700 font-normal"
      />
    </div>
    <div class="text-xs text-gray-500">Last updated: {{ timeAgo }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "../../data/projects";
import Chip from "../ui/Chip.vue";
import StatusChip from "../global/StatusChip.vue";
import ProjectActionsMenu from "./ProjectActionsMenu.vue";
import { useFormattedTimeAgo } from "../../composables/useFormattedTimeAgo";

const props = defineProps<{
  project: Project;
}>();

defineEmits<{
  (
    e: "menuClick",
    data: { action: "edit" | "archive" | "delete"; project: Project }
  ): void;
}>();

const timeAgo = useFormattedTimeAgo(props.project.lastUpdated);
</script>
