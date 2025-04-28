<template>
  <div
    class="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow duration-200"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h3 class="font-semibold text-gray-900 mt-2">{{ project.name }}</h3>
        <StatusChip :is-archived="project.archived" />
        <div class="flex flex-wrap gap-1">
          <Chip
            v-for="tag in project.tags"
            :key="tag"
            size="xs"
            :text="tag"
            class="bg-blue-100 text-blue-700"
          />
        </div>
      </div>
      <ProjectActionsMenu
        :project="project"
        @menu-click="$emit('menuClick', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "../../data/projects";
import StatusChip from "../global/StatusChip.vue";
import ProjectActionsMenu from "./ProjectActionsMenu.vue";
import Chip from "../ui/Chip.vue";

defineProps<{
  project: Project;
}>();

defineEmits<{
  (
    e: "menuClick",
    data: { action: "edit" | "archive" | "delete"; project: Project }
  ): void;
}>();
</script>
