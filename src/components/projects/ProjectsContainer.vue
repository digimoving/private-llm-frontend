<template>
  <div>
    <div
      :class="{
        'space-y-2': showAsList,
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4': !showAsList,
      }"
    >
      <AddNewProjectCard
        :show-as-list="showAsList"
        @click="$emit('add-project')"
      />
      <template v-for="project in projects" :key="project.id">
        <ProjectListCard
          v-if="showAsList"
          :project="project"
          @menuClick="$emit('menu-click', $event)"
        />
        <ProjectGridCard
          v-else
          :project="project"
          @menuClick="$emit('menu-click', $event)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useProjectsStore } from "../../stores/projects";
import type { Project } from "../../api/data/projects";
import ProjectListCard from "./ProjectListCard.vue";
import ProjectGridCard from "./ProjectGridCard.vue";
import AddNewProjectCard from "./AddNewProjectCard.vue";

const props = defineProps<{
  showAsList: boolean;
  showArchived: boolean;
  selectedFilters: {
    status: string[];
    tags: string[];
  };
}>();

const projectsStore = useProjectsStore();
const projects = computed(() =>
  projectsStore.filteredProjects(props.showArchived, props.selectedFilters.tags)
);

defineEmits<{
  (e: "add-project"): void;
  (
    e: "menu-click",
    data: { action: "edit" | "archive" | "delete"; project: Project }
  ): void;
}>();
</script>
