<!-- LLMResourcesPage.vue -->
<template>
  <div class="space-y-8">
    <!-- Desktop Controls -->
    <div class="hidden lg:flex items-center justify-end gap-4 mb-4">
      <div class="flex items-center gap-2">
        <ToggleArchivedCheckbox
          v-model="showArchived"
          :disabled="llmsStore.isLoading"
        />
        <FilterDropdown
          :show-archived="showArchived"
          :disabled="llmsStore.isLoading"
          :filters="{ status: selectedFilters.status, tags: [] }"
          @update:filters="handleFiltersUpdate"
        />
        <SortDropdown v-model="sortBy" :disabled="llmsStore.isLoading" />
        <ListToggle v-model="showAsList" :disabled="llmsStore.isLoading" />
      </div>
    </div>

    <div class="relative min-h-[600px]">
      <SkeletonLoader
        v-if="llmsStore.isLoading"
        :show-as-list="showAsList"
        resource-type="LLM"
        @add-resource="handleAddLLM"
      />
      <ResourcesContainer
        v-else
        :show-as-list="showAsList"
        :show-archived="showArchived"
        :selected-filters="{ status: selectedFilters.status, tags: [] }"
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

    <!-- TODO: Mobile Filters Dialog -->
    <!-- <MobileFiltersDialog
      v-model:viewMode="showAsList"
      v-model:sortBy="sortBy"
      v-model:showArchived="showArchived"
      :disabled="llmsStore.isLoading"
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
import SkeletonLoader from "../../components/ui/SkeletonLoader.vue";
import ResourceDetailsModal from "../../components/modals/ResourceDetailsModal.vue";
import ArchiveResourceModal from "../../components/modals/ArchiveResourceModal.vue";
import DeleteResourceModal from "../../components/modals/DeleteResourceModal.vue";
import { useLLMsStore } from "../../stores/llms";
import type { LLMResource, Project } from "../../types/types";

const llmsStore = useLLMsStore();

// Load LLMs when component mounts
onMounted(async () => {
  await llmsStore.fetchLLMs();
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
  tags: [],
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const showArchiveModal = ref(false);
const showDeleteModal = ref(false);
const selectedLLMId = ref<string | null>(null);

const handleFiltersUpdate = (filters: { status: string[]; tags: string[] }) => {
  selectedFilters.value = filters;
};

const handleAddLLM = () => {
  showAddModal.value = true;
};

const handleMenuClick = (data: {
  action: "edit" | "archive" | "delete";
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
  }
};
</script>
