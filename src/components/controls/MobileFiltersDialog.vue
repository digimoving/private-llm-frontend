<template>
  <!-- WIP -->
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50 lg:hidden" @close="close">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="translate-x-full"
        >
          <DialogPanel
            class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl"
          >
            <div class="flex items-center justify-between px-4">
              <h2 class="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                @click="close"
              >
                <span class="sr-only">Close menu</span>
                <XMarkIcon class="h-6 w-6 text-gray-700" aria-hidden="true" />
              </button>
            </div>

            <!-- Filter Controls -->
            <div class="mt-4 space-y-4 px-4">
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">View</h3>
                <ProjectsListToggle
                  :model-value="viewMode"
                  @update:model-value="updateViewMode"
                  :disabled="isDisabled"
                  class="w-full"
                />
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">Sort</h3>
                <SortProjectsDropdown
                  :model-value="sortBy"
                  @update:model-value="updateSortBy"
                  :disabled="isDisabled"
                  class="w-full"
                />
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">
                  Show Archived
                </h3>
                <ToggleArchivedCheckbox
                  :model-value="showArchived"
                  @update:model-value="updateShowArchived"
                  :disabled="isDisabled"
                />
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">Filter</h3>
                <FilterProjectsDropdown :disabled="isDisabled" class="w-full" />
              </div>
            </div>

            <!-- Apply button -->
            <div class="mt-auto border-t border-gray-200 px-4 pt-4">
              <Button
                variant="primary"
                class="w-full"
                @click="close"
                :disabled="isDisabled"
              >
                Apply filters
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Mobile FAB -->
  <button
    type="button"
    class="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 lg:hidden"
    @click="open = true"
    :disabled="isDisabled"
  >
    <FunnelIcon class="h-6 w-6" aria-hidden="true" />
    <span class="sr-only">Open filters</span>
  </button>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { FunnelIcon } from "@heroicons/vue/24/solid";
import Button from "../ui/Button.vue";
import ProjectsListToggle from "./ProjectsListToggle.vue";
import SortProjectsDropdown from "./SortProjectsDropdown.vue";
import ToggleArchivedCheckbox from "./ToggleArchivedCheckbox.vue";
import FilterProjectsDropdown from "./FilterProjectsDropdown.vue";
import { useProjectsStore } from "../../stores/projects";

type SortOption =
  | "newest"
  | "oldest"
  | "recently-updated"
  | "least-recently-updated"
  | "name-asc"
  | "name-desc";

const props = defineProps<{
  viewMode: boolean;
  sortBy: SortOption;
  showArchived: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (event: "update:viewMode", value: boolean): void;
  (event: "update:sortBy", value: SortOption): void;
  (event: "update:showArchived", value: boolean): void;
}>();

const projectsStore = useProjectsStore();
const open = ref(false);

const isDisabled = computed(
  () => props.disabled || projectsStore.loading.projects
);

const viewMode = ref(props.viewMode);
const sortBy = ref(props.sortBy);
const showArchived = ref(props.showArchived);

watch(viewMode, (value) => {
  emit("update:viewMode", value);
});

watch(sortBy, (value) => {
  emit("update:sortBy", value);
});

watch(showArchived, (value) => {
  emit("update:showArchived", value);
});

const close = () => {
  open.value = false;
};

const updateViewMode = (value: boolean) => {
  viewMode.value = value;
};

const updateSortBy = (value: SortOption) => {
  sortBy.value = value;
};

const updateShowArchived = (value: boolean) => {
  showArchived.value = value;
};
</script>
