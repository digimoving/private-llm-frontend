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
            :disabled="projectsStore.loading.projects"
          />
          <FilterProjectsDropdown
            :show-archived="showArchived"
            :disabled="projectsStore.loading.projects"
            @update:filters="handleFiltersUpdate"
          />
          <SortProjectsDropdown
            v-model="sortBy"
            :disabled="projectsStore.loading.projects"
          />
          <ProjectsListToggle
            v-model="showAsList"
            :disabled="projectsStore.loading.projects"
          />
        </div>
      </div>

      <div class="relative min-h-[600px]">
        <ProjectsSkeletonLoader
          v-if="projectsStore.loading.projects"
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

      <ProjectDetailsModal
        v-if="showAddProjectModal || showEditModal"
        :model-value="showAddProjectModal || showEditModal"
        @update:model-value="
          (val) => {
            showAddProjectModal = false;
            showEditModal = false;
          }
        "
        :project-id="
          showEditModal && selectedProjectId ? selectedProjectId : undefined
        "
      />
      <ArchiveProjectModal
        v-if="showArchiveModal && selectedProjectId"
        v-model="showArchiveModal"
        :project-id="selectedProjectId"
      />
      <DeleteProjectModal
        v-if="showDeleteModal && selectedProjectId"
        v-model="showDeleteModal"
        :project-id="selectedProjectId"
      />

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
import ProjectDetailsModal from "../../components/modals/ProjectDetailsModal.vue";
import ArchiveProjectModal from "../../components/modals/ArchiveProjectModal.vue";
import DeleteProjectModal from "../../components/modals/DeleteProjectModal.vue";
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

const showAddProjectModal = ref(false);
const showEditModal = ref(false);
const showArchiveModal = ref(false);
const showDeleteModal = ref(false);
const selectedProjectId = ref<string | null>(null);

const handleFiltersUpdate = (filters: Filters) => {
  selectedFilters.value = filters;
};

const handleAddProject = () => {
  showAddProjectModal.value = true;
};

const handleMenuClick = (data: {
  action: "edit" | "archive" | "delete";
  project: Project;
}) => {
  selectedProjectId.value = data.project.id;
  if (data.action === "edit") {
    showEditModal.value = true;
  } else if (data.action === "archive") {
    showArchiveModal.value = true;
  } else if (data.action === "delete") {
    showDeleteModal.value = true;
  }
};
</script>

<style scoped></style>
