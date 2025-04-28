<template>
  <Listbox as="div" v-model="modelValue" multiple>
    <div class="relative">
      <ListboxButton as="div">
        <Button variant="secondary" class="w-full" :disabled="disabled">
          <div class="flex items-center gap-1.5">
            <FunnelIcon class="size-4 text-gray-500" aria-hidden="true" />
            <span class="truncate">{{
              selectedCount ? "Filters" : "Filter"
            }}</span>
            <span
              v-if="selectedCount"
              class="min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-primary-50 px-1.5 text-xs font-medium text-primary-700"
            >
              {{ selectedCount }}
            </span>
          </div>
        </Button>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 w-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <div
            class="px-3 py-2 border-b border-gray-100 flex justify-between items-center"
          >
            <h3 class="text-sm font-semibold text-gray-900">Filters</h3>
            <Button
              variant="flat"
              size="xs"
              @click="clearAllFilters"
              :disabled="disabled"
            >
              Clear all
            </Button>
          </div>

          <!-- Status section -->
          <div class="px-3 py-2">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Status</h4>
            <div class="space-y-1">
              <ListboxOption
                v-slot="{ active, selected }"
                :value="'all'"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-primary-50 text-primary-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    disabled && 'opacity-50 cursor-not-allowed',
                  ]"
                >
                  <span
                    :class="[
                      selected ? 'font-semibold' : 'font-normal',
                      'block truncate',
                    ]"
                  >
                    All
                  </span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary-600"
                  >
                    <CheckIcon class="size-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption
                v-for="status in statusOptions"
                :key="status"
                v-slot="{ active, selected }"
                :value="status"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-primary-50 text-primary-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    disabled && 'opacity-50 cursor-not-allowed',
                  ]"
                >
                  <span
                    :class="[
                      selected ? 'font-semibold' : 'font-normal',
                      'block truncate',
                    ]"
                  >
                    {{ status.charAt(0).toUpperCase() + status.slice(1) }}
                  </span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary-600"
                  >
                    <CheckIcon class="size-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </div>
          </div>

          <!-- Tags section -->
          <div class="px-3 py-2 border-t border-gray-100">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Tags</h4>
            <div class="space-y-1">
              <ListboxOption
                v-slot="{ active, selected }"
                :value="'all_tags'"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-primary-50 text-primary-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    disabled && 'opacity-50 cursor-not-allowed',
                  ]"
                >
                  <span
                    :class="[
                      selected ? 'font-semibold' : 'font-normal',
                      'block truncate',
                    ]"
                  >
                    All
                  </span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary-600"
                  >
                    <CheckIcon class="size-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
              <ListboxOption
                v-for="tag in tags"
                :key="tag"
                v-slot="{ active, selected }"
                :value="tag"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-primary-50 text-primary-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    disabled && 'opacity-50 cursor-not-allowed',
                  ]"
                >
                  <span
                    :class="[
                      selected ? 'font-semibold' : 'font-normal',
                      'block truncate',
                    ]"
                  >
                    {{ tag }}
                  </span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary-600"
                  >
                    <CheckIcon class="size-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </div>
          </div>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { FunnelIcon } from "@heroicons/vue/24/outline";
import { CheckIcon } from "@heroicons/vue/20/solid";
import Button from "../../components/ui/Button.vue";
import { useProjectsStore } from "../../stores/projects";

defineProps<{
  disabled?: boolean;
}>();

const statusOptions = ["active", "archived"] as const;
type Status = (typeof statusOptions)[number];

const projectsStore = useProjectsStore();
const tags = computed(() => projectsStore.allTags());

const selectedFilters = ref<string[]>([]);

// Helper functions to manage selections
const getAllStatusFilters = () => [...statusOptions];
const getAllTagFilters = () => [...tags.value];

const updateFilters = (newValue: string[]) => {
  const statusFilters = newValue.filter((f) =>
    ["all", ...statusOptions].includes(f)
  );
  const tagFilters = newValue.filter((f) =>
    ["all_tags", ...tags.value].includes(f)
  );

  let newFilters = [...newValue];

  // Handle "All" selections
  if (statusFilters.includes("all")) {
    // Remove 'all' and add all status options
    newFilters = newFilters
      .filter((f) => f !== "all")
      .concat(getAllStatusFilters());
  }
  if (tagFilters.includes("all_tags")) {
    // Remove 'all_tags' and add all tag options
    newFilters = newFilters
      .filter((f) => f !== "all_tags")
      .concat(getAllTagFilters());
  }

  selectedFilters.value = [...new Set(newFilters)];

  // Emit the filtered selections
  emit("update:filters", {
    status: statusFilters.includes("all") ? ["all"] : statusFilters,
    tags: tagFilters.includes("all_tags")
      ? ["all_tags"]
      : tagFilters.filter((t) => tags.value.includes(t)),
  });
};

const selectedCount = computed(() => {
  const statusCount = selectedFilters.value.filter((f) =>
    statusOptions.includes(f as Status)
  ).length;
  const tagCount = selectedFilters.value.filter((f) =>
    tags.value.includes(f)
  ).length;
  return statusCount + tagCount;
});

const emit = defineEmits<{
  (
    event: "update:filters",
    filters: { status: string[]; tags: string[] }
  ): void;
}>();

// Handle v-model updates from Listbox
const modelValue = computed({
  get: () => selectedFilters.value,
  set: updateFilters,
});

const clearAllFilters = () => {
  selectedFilters.value = [];
  emit("update:filters", {
    status: ["all"],
    tags: ["all_tags"],
  });
};
</script>
