<template>
  <DefaultLayout
    title="Projects"
    subtitle="Manage your private AI models and projects."
  >
    <div class="space-y-8">
      <!-- Desktop Controls -->
      <div class="hidden lg:flex items-center justify-end gap-4 mb-4">
        <div class="flex items-center gap-2">
          <ToggleArchivedCheckbox
            v-model="showArchived"
            :disabled="projectsStore.isLoading"
          />
          <FilterProjectsDropdown
            :show-archived="showArchived"
            :disabled="projectsStore.isLoading"
            @update:filters="handleFiltersUpdate"
          />
          <SortProjectsDropdown
            v-model="sortBy"
            :disabled="projectsStore.isLoading"
          />
          <ProjectsListToggle
            v-model="showAsList"
            :disabled="projectsStore.isLoading"
          />
        </div>
      </div>

      <div class="relative min-h-[600px]">
        <ProjectsSkeletonLoader
          v-if="projectsStore.isLoading"
          :show-as-list="showAsList"
          @add-project="handleAddProject"
        />
        <ProjectsContainer
          v-else
          :show-as-list="showAsList"
          :show-archived="showArchived"
          :selected-filters="selectedFilters"
          @add-project="handleAddProject"
          @menu-click="handleMenuClick"
        />
      </div>

      <!-- Mobile Filters Dialog -->
      <MobileFiltersDialog
        v-model:viewMode="showAsList"
        v-model:sortBy="sortBy"
        v-model:showArchived="showArchived"
        :disabled="projectsStore.loading.projects"
        @update:filters="handleFiltersUpdate"
      />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DefaultLayout from "../../layouts/DefaultLayout.vue";
import FilterProjectsDropdown from "../../components/controls/FilterProjectsDropdown.vue";
import SortProjectsDropdown from "../../components/controls/SortProjectsDropdown.vue";
import ToggleArchivedCheckbox from "../../components/controls/ToggleArchivedCheckbox.vue";
import ProjectsListToggle from "../../components/controls/ProjectsListToggle.vue";
import ProjectsContainer from "../../components/projects/ProjectsContainer.vue";
import MobileFiltersDialog from "../../components/controls/MobileFiltersDialog.vue";
import ProjectsSkeletonLoader from "../../components/projects/ProjectsSkeletonLoader.vue";
import { useProjectsStore } from "../../stores/projects";
import type { Project } from "../../api/data/projects";

const projectsStore = useProjectsStore();

// Load projects when component mounts
onMounted(async () => {
  await projectsStore.fetchProjects();
});

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

const selectedFilters = ref<Filters>({
  status: ["all"],
  tags: ["all_tags"],
});

const handleFiltersUpdate = (filters: Filters) => {
  selectedFilters.value = filters;
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
</script>

<style scoped></style>
