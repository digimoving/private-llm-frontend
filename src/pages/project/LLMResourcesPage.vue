<!-- LLMResourcesPage.vue -->
<template>
  <div class="space-y-8">
    <!-- Desktop Controls -->
    <div class="hidden sm:flex items-center justify-end gap-2">
      <ToggleArchivedCheckbox v-model="showArchived" :disabled="isDisabled" />
      <FilterDropdown
        :show-archived="showArchived"
        :disabled="isDisabled"
        :tags="availableTags"
        :status-options="statusOptions"
        @update:filters="handleFiltersUpdate"
      />
      <SortDropdown v-model="sortBy" :disabled="isDisabled" />
      <ListToggle v-model="showAsList" :disabled="isDisabled" />
    </div>

    <!-- Mobile FAB -->
    <FAB
      :icon="FunnelIcon"
      aria-label="Open project actions"
      @click="showMobileDrawer = true"
      customClass="sm:hidden"
    />
    <MobileProjectActionsDrawer
      v-model="showMobileDrawer"
      :show-as-list="showAsList"
      :sort-by="sortBy"
      :show-archived="showArchived"
      :archived="projectStore.currentProject?.archived"
      :archive-loading="isDisabled"
      :tags="availableTags"
      :status-options="statusOptions"
      :disabled="isDisabled"
      @update:filters="handleFiltersUpdate"
      @update:sortBy="sortBy = $event"
      @update:showArchived="showArchived = $event"
      @update:showAsList="showAsList = $event"
      @toggle-archive="toggleArchive"
      @delete="handleDelete"
      resource-type="LLM"
    />

    <div class="relative min-h-[600px]">
      <ResourcesSkeletonLoader
        v-if="llmsStore.loading.llms"
        :show-as-list="showAsList"
        @add-project="handleAddLLM"
      />
      <ResourcesContainer
        v-else
        :show-as-list="showAsList"
        :show-archived="showArchived"
        :selected-filters="selectedFilters"
        :sort-by="sortBy"
        resource-type="llm"
        @add-resource="handleAddLLM"
        @menu-click="handleMenuClick"
      />
    </div>

    <ResourceDetailsModal
      v-if="showAddModal || showEditModal"
      :model-value="showAddModal || showEditModal"
      @update:model-value="
        () => {
          showAddModal = false;
          showEditModal = false;
        }
      "
      :resource-id="showEditModal && selectedLLMId ? selectedLLMId : undefined"
      resource-type="LLM"
    />
    <ArchiveResourceModal
      v-if="showArchiveModal && selectedLLMId"
      v-model="showArchiveModal"
      :resource-id="selectedLLMId"
      resource-type="LLM"
    />
    <DeleteResourceModal
      v-if="showDeleteModal && selectedLLMId"
      v-model="showDeleteModal"
      :resource-id="selectedLLMId"
      resource-type="LLM"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { FunnelIcon } from "@heroicons/vue/24/solid";
import FilterDropdown from "../../components/controls/FilterDropdown.vue";
import SortDropdown from "../../components/controls/SortDropdown.vue";
import ToggleArchivedCheckbox from "../../components/controls/ToggleArchivedCheckbox.vue";
import ListToggle from "../../components/controls/ListToggle.vue";
import ResourcesContainer from "../../components/resources/ResourcesContainer.vue";
import MobileProjectActionsDrawer from "../../components/controls/MobileProjectActionsDrawer.vue";
import ResourcesSkeletonLoader from "../../components/skeletons/ResourcesSkeletonLoader.vue";
import ResourceDetailsModal from "../../components/modals/ResourceDetailsModal.vue";
import ArchiveResourceModal from "../../components/modals/ArchiveResourceModal.vue";
import DeleteResourceModal from "../../components/modals/DeleteResourceModal.vue";
import FAB from "../../components/global/FAB.vue";
import { useLLMsStore } from "../../stores/llms";
import { useProjectsStore } from "../../stores/projects";
import type { LLMResource, Project, LLMListParams } from "../../types/types";

const route = useRoute();
const llmsStore = useLLMsStore();
const projectStore = useProjectsStore();

const isDisabled = computed(() => {
  return llmsStore.loading.llms || projectStore.currentProject?.archived;
});

// Get all unique tags from LLMs
const availableTags = computed(() => {
  const tagSet = new Set<string>();
  llmsStore.llms.forEach((llm) => {
    if (showArchived.value || !llm.archived) {
      llm.tags?.forEach((tag) => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
});

// Status options for LLMs
const statusOptions = computed<NonNullable<LLMListParams["status"]>[]>(() => [
  "active",
  "archived",
  "all",
]);

const showArchived = ref(false);
const showAsList = ref(false);
const showMobileDrawer = ref(false);

interface Filters {
  status: Array<NonNullable<LLMListParams["status"]>>;
  tags: string[];
}

const selectedFilters = ref<Filters>({
  status: ["all"],
  tags: [],
});

const sortBy = ref<
  | "newest"
  | "oldest"
  | "recently-updated"
  | "least-recently-updated"
  | "name-asc"
  | "name-desc"
>("newest");

// Watch for project archived status changes
watch(
  () => projectStore.currentProject?.archived,
  (newValue) => {
    if (newValue) {
      showArchived.value = true;
    }
  },
  { immediate: true }
);

const showAddModal = ref(false);
const showEditModal = ref(false);
const showArchiveModal = ref(false);
const showDeleteModal = ref(false);
const selectedLLMId = ref<string | null>(null);

const handleFiltersUpdate = (filters: { status: string[]; tags: string[] }) => {
  selectedFilters.value = {
    status: filters.status as Array<NonNullable<LLMListParams["status"]>>,
    tags: filters.tags,
  };
};

// Load LLMs when component mounts
onMounted(async () => {
  const projectId = route.params.projectId as string;
  if (!projectId) return;

  llmsStore.setCurrentProject(projectId);
  await llmsStore.fetchLLMs({
    status: selectedFilters.value.status[0],
    tags: selectedFilters.value.tags,
    sort: "newest",
  });
});

const handleAddLLM = () => {
  showAddModal.value = true;
};

const handleMenuClick = async (data: {
  action: "edit" | "archive" | "delete" | "toggleActive";
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
}) => {
  if (data.resourceType !== "llm") return;
  const llmResource = data.resource as LLMResource;

  selectedLLMId.value = llmResource.id;
  if (data.action === "edit") {
    showEditModal.value = true;
  } else if (data.action === "archive") {
    showArchiveModal.value = true;
  } else if (data.action === "delete") {
    showDeleteModal.value = true;
  } else if (data.action === "toggleActive") {
    if (llmResource.paused) {
      await llmsStore.resumeLLM(llmResource.id);
    } else {
      await llmsStore.pauseLLM(llmResource.id);
    }
  }
};

// Watch for changes in filters and sort
watch([selectedFilters, sortBy], async () => {
  await llmsStore.fetchLLMs({
    status: selectedFilters.value.status[0],
    tags: selectedFilters.value.tags,
    sort:
      sortBy.value === "recently-updated"
        ? "updated_desc"
        : sortBy.value === "least-recently-updated"
          ? "updated_asc"
          : sortBy.value === "name-asc"
            ? "name_asc"
            : sortBy.value === "name-desc"
              ? "name_desc"
              : sortBy.value === "oldest"
                ? "oldest"
                : "newest",
  });
});

const toggleArchive = async () => {
  if (projectStore.currentProject?.archived) {
    await projectStore.updateProject(projectStore.currentProject.id, {
      archived: false,
    });
  } else {
    // Open archive modal or handle archive logic
    // You may want to emit or set a modal state here
  }
};

const handleDelete = () => {
  // Open delete modal or handle delete logic
  // You may want to emit or set a modal state here
};
</script>
