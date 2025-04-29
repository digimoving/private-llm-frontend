<!-- LLMResourcesPage.vue -->
<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">LLM Resources</h2>
      <div class="flex items-center space-x-4">
        <!-- Filter Button -->
        <Button
          variant="secondary"
          class="flex items-center space-x-2"
          @click="showFilters = !showFilters"
        >
          <FunnelIcon class="h-5 w-5" />
          <span>Filter</span>
        </Button>

        <!-- Sort Dropdown -->
        <Menu as="div" class="relative">
          <MenuButton
            as="button"
            class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <span>Sort by: {{ currentSort.label }}</span>
            <ChevronDownIcon class="h-5 w-5" />
          </MenuButton>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none"
            >
              <div class="py-1">
                <MenuItem v-for="option in sortOptions" :key="option.value">
                  <button
                    @click="updateSort(option)"
                    :class="[
                      'block w-full text-left px-4 py-2 text-sm',
                      currentSort.value === option.value
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50',
                    ]"
                  >
                    {{ option.label }}
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>

        <!-- View Toggle -->
        <div class="flex items-center rounded-lg border border-gray-300 p-1">
          <button
            @click="viewMode = 'list'"
            :class="[
              'p-1 rounded',
              viewMode === 'list'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900',
            ]"
          >
            <Bars3Icon class="h-5 w-5" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-1 rounded',
              viewMode === 'grid'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900',
            ]"
          >
            <Squares2X2Icon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- LLM Resources Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <!-- Add LLM Card -->
      <RouterLink
        :to="{ name: 'project-new-llm' }"
        class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        <PlusIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-semibold text-gray-900">
          Add LLM Resource
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Configure a new AI model resource
        </p>
      </RouterLink>

      <!-- LLM Cards -->
      <div
        v-for="llm in sortedLLMs"
        :key="llm.id"
        class="relative rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
      >
        <!-- Status Badge -->
        <div class="absolute top-6 right-6 flex items-center space-x-2">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              llm.paused
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800',
            ]"
          >
            {{ llm.paused ? "Paused" : "Active" }}
          </span>
          <span
            class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
          >
            {{ llm.type }}
          </span>
        </div>

        <div class="mt-4">
          <h3 class="text-lg font-medium text-gray-900">{{ llm.name }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ llm.description }}</p>
          <p class="mt-4 text-sm text-gray-500">
            Last updated: {{ formatDate(llm.updatedAt) }}
          </p>
        </div>

        <div class="mt-6 flex justify-between items-center">
          <!-- Action Buttons -->
          <div class="flex space-x-3">
            <button
              v-if="llm.paused"
              @click="resumeLLM(llm.id)"
              class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <PlayIcon class="h-5 w-5" />
            </button>
            <button
              v-else
              @click="pauseLLM(llm.id)"
              class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <PauseIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Menu -->
          <Menu as="div" class="relative">
            <MenuButton
              class="flex items-center rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <EllipsisHorizontalIcon class="h-5 w-5" />
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem>
                  <button
                    @click="editLLM(llm.id)"
                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    @click="archiveLLM(llm.id)"
                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Archive
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    @click="deleteLLM(llm.id)"
                    class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useLLMsStore } from "../../stores/llms";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import {
  PlusIcon,
  FunnelIcon,
  ChevronDownIcon,
  Bars3Icon,
  Squares2X2Icon,
  PlayIcon,
  PauseIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/vue/24/outline";
import Button from "../../components/ui/Button.vue";
import { useFormattedTimeAgo } from "../../composables/useFormattedTimeAgo";

const router = useRouter();
const llmsStore = useLLMsStore();

const viewMode = ref<"list" | "grid">("grid");
const showFilters = ref(false);

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
  { value: "updated_desc", label: "Recently Updated" },
  { value: "updated_asc", label: "Least Recently Updated" },
];

const currentSort = ref(sortOptions[0]);

const updateSort = (option: (typeof sortOptions)[0]) => {
  currentSort.value = option;
  llmsStore.fetchLLMs({
    sort: option.value as
      | "newest"
      | "oldest"
      | "name_asc"
      | "name_desc"
      | "updated_desc"
      | "updated_asc",
  });
};

const sortedLLMs = computed(() => {
  return llmsStore.activeLLMs;
});

const formatDate = (date: string) => {
  return useFormattedTimeAgo(date);
};

const pauseLLM = async (id: string) => {
  await llmsStore.pauseLLM(id);
};

const resumeLLM = async (id: string) => {
  await llmsStore.resumeLLM(id);
};

const editLLM = (id: string) => {
  router.push({ name: "project-edit-llm", params: { llmId: id } });
};

const archiveLLM = async (id: string) => {
  await llmsStore.archiveLLM(id);
};

const deleteLLM = async (id: string) => {
  if (confirm("Are you sure you want to delete this LLM?")) {
    await llmsStore.deleteLLM(id);
  }
};
</script>
