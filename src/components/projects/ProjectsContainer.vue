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
  sortBy:
    | "newest"
    | "oldest"
    | "recently-updated"
    | "least-recently-updated"
    | "name-asc"
    | "name-desc";
}>();

const projectsStore = useProjectsStore();
const projects = computed(() => {
  const filteredProjects = projectsStore.filteredProjects(
    props.showArchived,
    props.selectedFilters.tags
  );

  return [...filteredProjects].sort((a, b) => {
    switch (props.sortBy) {
      case "newest":
        return (
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
      case "oldest":
        return (
          new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
        );
      case "recently-updated":
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      case "least-recently-updated":
        return (
          new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
        );
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
});

defineEmits<{
  (e: "add-project"): void;
  (
    e: "menu-click",
    data: { action: "edit" | "archive" | "delete"; project: Project }
  ): void;
}>();
</script>
