<template>
  <div class="space-y-8">
    <!-- Desktop Controls -->
    <div class="hidden lg:flex items-center justify-end gap-4 mb-4">
      <div class="flex items-center gap-2">
        <ToggleArchivedCheckbox
          v-model="showArchived"
          :disabled="projectsStore.loading.projects"
        />
        <FilterDropdown
          :show-archived="showArchived"
          :disabled="projectsStore.loading.projects"
          @update:filters="handleFiltersUpdate"
        />
        <SortDropdown
          v-model="sortBy"
          :disabled="projectsStore.loading.projects"
        />
        <ListToggle
          v-model="showAsList"
          :disabled="projectsStore.loading.projects"
        />
      </div>
    </div>

    <div class="relative min-h-[600px]">
      <ResourcesSkeletonLoader
        v-if="projectsStore.loading.projects"
        :show-as-list="showAsList"
        @add-project="handleAddProject"
      />
      <ResourcesContainer
        v-else
        :show-as-list="showAsList"
        :show-archived="showArchived"
        :selected-filters="selectedFilters"
        :sort-by="sortBy"
        resourceType="project"
        @add-resource="handleAddProject"
        @menu-click="
          ($event) =>
            handleMenuClick({
              action: $event.action,
              resource: $event.resource,
              resourceType: 'project',
            })
        "
      />
    </div>

    <ResourceDetailsModal
      v-if="showAddProjectModal || showEditModal"
      :model-value="showAddProjectModal || showEditModal"
      @update:model-value="
        () => {
          showAddProjectModal = false;
          showEditModal = false;
        }
      "
      :resource-id="
        showEditModal && selectedProjectId ? selectedProjectId : undefined
      "
      resource-type="Project"
    />
    <ArchiveResourceModal
      v-if="showArchiveModal && selectedProjectId"
      v-model="showArchiveModal"
      :resource-id="selectedProjectId"
      resource-type="Project"
    />
    <DeleteResourceModal
      v-if="showDeleteModal && selectedProjectId"
      v-model="showDeleteModal"
      :resource-id="selectedProjectId"
      resource-type="Project"
    />

    <!-- TODO: Mobile Filters Dialog -->
    <!-- <MobileFiltersDialog
      v-model:viewMode="showAsList"
      v-model:sortBy="sortBy"
      v-model:showArchived="showArchived"
      :disabled="projectsStore.loading.projects"
      @update:filters="handleFiltersUpdate"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import FilterDropdown from "../../components/controls/FilterDropdown.vue";
import SortDropdown from "../../components/controls/SortDropdown.vue";
import ToggleArchivedCheckbox from "../../components/controls/ToggleArchivedCheckbox.vue";
import ListToggle from "../../components/controls/ListToggle.vue";
import ResourcesContainer from "../../components/resources/ResourcesContainer.vue";
import MobileFiltersDialog from "../../components/controls/MobileFiltersDialog.vue";
import ResourcesSkeletonLoader from "../../components/resources/ResourcesSkeletonLoader.vue";
import ResourceDetailsModal from "../../components/modals/ResourceDetailsModal.vue";
import ArchiveResourceModal from "../../components/modals/ArchiveResourceModal.vue";
import DeleteResourceModal from "../../components/modals/DeleteResourceModal.vue";
import { useProjectsStore } from "../../stores/projects";
import type { Project, LLMResource } from "../../types/types";

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
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
}) => {
  if (data.resourceType !== "project") return;
  const projectResource = data.resource as Project;

  selectedProjectId.value = projectResource.id;
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
