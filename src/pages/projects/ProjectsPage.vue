<template>
  <DefaultLayout
    title="Projects"
    subtitle="Manage your private AI models and projects."
  >
    <div class="space-y-8">
      <!-- Desktop Controls -->
      <div class="hidden lg:flex items-center justify-end gap-4 mb-4">
        <div class="flex items-center gap-2">
          <FilterProjectsDropdown @update:filters="handleFiltersUpdate" />
          <SortProjectsDropdown v-model="sortBy" />
          <ToggleArchivedCheckbox v-model="showArchived" />
          <ProjectsListToggle v-model="showAsList" />
        </div>
      </div>

      <ProjectsContainer
        :projects="filteredProjects"
        :show-as-list="showAsList"
        @add-project="handleAddProject"
        @menu-click="handleMenuClick"
      />

      <!-- Mobile Filters Dialog -->
      <MobileFiltersDialog
        v-model:viewMode="showAsList"
        v-model:sortBy="sortBy"
        v-model:showArchived="showArchived"
        @update:filters="handleFiltersUpdate"
      />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DefaultLayout from "../../layouts/DefaultLayout.vue";
import FilterProjectsDropdown from "../../components/controls/FilterProjectsDropdown.vue";
import SortProjectsDropdown from "../../components/controls/SortProjectsDropdown.vue";
import ToggleArchivedCheckbox from "../../components/controls/ToggleArchivedCheckbox.vue";
import ProjectsListToggle from "../../components/controls/ProjectsListToggle.vue";
import ProjectsContainer from "../../components/projects/ProjectsContainer.vue";
import MobileFiltersDialog from "../../components/controls/MobileFiltersDialog.vue";
import { projects } from "../../data/projects";
import type { Project } from "../../data/projects";

const sortBy = ref<
  | "newest"
  | "oldest"
  | "recently-updated"
  | "least-recently-updated"
  | "name-asc"
  | "name-desc"
>("newest");

const showArchived = ref(false);
const showAsList = ref(false);

interface Filters {
  status: string[];
  tags: string[];
}

const handleFiltersUpdate = (filters: Filters) => {
  console.log("Filters updated:", filters);
  // TODO: Apply filters to projects list
};

const handleAddProject = () => {
  // TODO: Implement project creation
  console.log("Add new project clicked");
};

const handleMenuClick = (data: {
  action: "edit" | "archive" | "delete";
  project: Project;
}) => {
  console.log("Menu action:", data.action, "for project:", data.project.name);
  // TODO: Implement menu actions
};

const filteredProjects = computed(() => {
  return projects.filter((project) => {
    // Show archived projects only if toggled
    if (!showArchived.value && project.archived) {
      return false;
    }
    return true;
  });
});
</script>

<style scoped></style>
