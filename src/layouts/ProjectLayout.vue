<!-- ProjectLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <header class="bg-white border-b border-gray-200">
      <div
        class="container mx-auto px-4 h-16 flex items-center justify-between"
      >
        <div class="flex items-center space-x-4">
          <!-- Back Button -->
          <RouterLink
            to="/projects"
            class="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ChevronLeftIcon class="h-5 w-5" />
            <span class="sr-only">Back to Projects</span>
          </RouterLink>

          <!-- Project Title with Edit -->
          <div class="flex items-center">
            <h1
              v-if="!isEditing"
              class="text-xl font-semibold text-gray-900 flex items-center"
            >
              {{ projectStore.currentProject?.name }}
              <button
                @click="startEditing"
                class="ml-2 text-gray-400 hover:text-gray-600"
              >
                <PencilIcon class="h-4 w-4" />
                <span class="sr-only">Edit Project Name</span>
              </button>
            </h1>
            <div v-else class="flex items-center space-x-2">
              <input
                ref="titleInput"
                v-model="editedTitle"
                type="text"
                class="text-xl font-semibold text-gray-900 border-b border-gray-300 focus:border-primary-500 focus:ring-0 bg-transparent"
                @keyup.enter="saveTitle"
                @keyup.esc="cancelEditing"
              />
              <div class="flex items-center space-x-1">
                <button
                  @click="saveTitle"
                  class="text-green-600 hover:text-green-700"
                >
                  <CheckIcon class="h-5 w-5" />
                </button>
                <button
                  @click="cancelEditing"
                  class="text-red-600 hover:text-red-700"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Archive Button -->
        <Button
          variant="secondary"
          @click="archiveProject"
          :loading="isArchiving"
        >
          Archive Project
        </Button>
      </div>

      <!-- Tabs -->
      <div class="container mx-auto px-4">
        <nav class="flex space-x-1 border-b border-gray-200" aria-label="Tabs">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.to"
            :class="[
              'px-3 py-2 text-sm font-medium',
              isActiveTab(tab.to)
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300',
            ]"
          >
            {{ tab.name }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useProjectsStore } from "../stores/projects";
import {
  ChevronLeftIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import Button from "../components/ui/Button.vue";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectsStore();

const isEditing = ref(false);
const editedTitle = ref("");
const titleInput = ref<HTMLInputElement | null>(null);
const isArchiving = ref(false);

const tabs = [
  { name: "LLM Resources", to: { name: "project-llms" } },
  { name: "Usage Metrics", to: { name: "project-metrics" } },
  { name: "Files", to: { name: "project-files" } },
  { name: "Settings", to: { name: "project-settings" } },
  { name: "Archived LLMs", to: { name: "project-archived-llms" } },
];

const isActiveTab = (tabTo: any) => {
  return route.name === tabTo.name;
};

const startEditing = () => {
  editedTitle.value = projectStore.currentProject?.name || "";
  isEditing.value = true;
  nextTick(() => {
    titleInput.value?.focus();
  });
};

const saveTitle = async () => {
  if (projectStore.currentProject && editedTitle.value.trim()) {
    await projectStore.updateProject(projectStore.currentProject.id, {
      name: editedTitle.value.trim(),
    });
    isEditing.value = false;
  }
};

const cancelEditing = () => {
  isEditing.value = false;
};

const archiveProject = async () => {
  if (!projectStore.currentProject) return;

  isArchiving.value = true;
  try {
    await projectStore.updateProject(projectStore.currentProject.id, {
      archived: true,
    });
    router.push("/projects");
  } finally {
    isArchiving.value = false;
  }
};
</script>
