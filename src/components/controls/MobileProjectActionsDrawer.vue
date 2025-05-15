<!-- MobileProjectActionsDrawer.vue -->
<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog as="div" class="relative z-50 sm:hidden" @close="close">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
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
              <h2 class="text-lg font-medium text-gray-900">Actions</h2>
              <Button
                variant="icon"
                :icon="XMarkIcon"
                @click="close"
                aria-label="Close menu"
                class="text-gray-700"
              />
            </div>

            <!-- Filter Controls -->
            <div class="mt-4 space-y-4 px-4">
              <h3 class="text-sm font-medium text-gray-900 mb-2">View</h3>
              <div class="flex items-center gap-2">
                <ListToggle
                  :model-value="showAsList"
                  @update:model-value="updateShowAsList"
                  :disabled="disabled"
                  class="inline-flex"
                />
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">Sort</h3>
                <SortDropdown
                  :model-value="sortBy"
                  @update:model-value="updateSortBy"
                  :disabled="disabled"
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
                  :disabled="disabled"
                />
              </div>

              <h3 class="text-sm font-medium text-gray-900 mb-2">Filter</h3>
              <div class="flex items-center gap-2">
                <FilterDropdown
                  :show-archived="showArchived"
                  :disabled="disabled"
                  :tags="tags"
                  :status-options="statusOptions"
                  @update:filters="handleFiltersUpdate"
                  class="inline-flex"
                />
              </div>

              <!-- Archive/Unarchive Button -->
              <div v-if="resourceType === 'LLM'">
                <div v-if="archived !== undefined">
                  <h3 class="text-sm font-medium mb-2">Archive</h3>
                  <Button
                    variant="flat"
                    :text="archived ? 'Unarchive Project' : 'Archive Project'"
                    :loading="archiveLoading"
                    :disabled="disabled"
                    class="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    @click="$emit('toggle-archive')"
                  />
                </div>

                <!-- Delete Button -->
                <div v-if="archived" class="flex justify-end">
                  <Button
                    variant="danger"
                    text="Delete Project"
                    :disabled="disabled"
                    @click="$emit('delete')"
                  />
                </div>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import Button from "../ui/Button.vue";
import ListToggle from "./ListToggle.vue";
import SortDropdown from "./SortDropdown.vue";
import ToggleArchivedCheckbox from "./ToggleArchivedCheckbox.vue";
import FilterDropdown from "./FilterDropdown.vue";

type SortOption =
  | "newest"
  | "oldest"
  | "recently-updated"
  | "least-recently-updated"
  | "name-asc"
  | "name-desc";

const props = defineProps<{
  modelValue: boolean;
  showAsList: boolean;
  sortBy: SortOption;
  showArchived: boolean;
  archived?: boolean;
  archiveLoading?: boolean;
  disabled?: boolean;
  tags: string[];
  statusOptions: string[];
  resourceType: "project" | "LLM";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:showAsList", value: boolean): void;
  (e: "update:sortBy", value: SortOption): void;
  (e: "update:showArchived", value: boolean): void;
  (e: "update:filters", value: { status: string[]; tags: string[] }): void;
  (e: "toggle-archive"): void;
  (e: "delete"): void;
}>();

const close = () => {
  emit("update:modelValue", false);
};

const updateShowAsList = (value: boolean) => {
  emit("update:showAsList", value);
};

const updateSortBy = (value: SortOption) => {
  emit("update:sortBy", value);
};

const updateShowArchived = (value: boolean) => {
  emit("update:showArchived", value);
};

const handleFiltersUpdate = (filters: { status: string[]; tags: string[] }) => {
  emit("update:filters", filters);
};
</script>
