<!-- ProjectLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <div class="bg-white border-b border-gray-200">
      <div
        class="container mx-auto px-4 h-16 flex items-center justify-between"
      >
        <div class="flex items-center space-x-4">
          <!-- Back Button -->
          <Button variant="icon" @click="$router.push('/projects')">
            <ArrowLeftIcon class="h-5 w-5" />
            <span class="sr-only">Back to Projects</span>
          </Button>

          <!-- Project Title with Edit -->
          <div class="flex items-center">
            <div class="flex items-center">
              <div
                v-if="isLoading"
                class="h-[18px] w-48 bg-gray-200 rounded-lg animate-pulse"
              ></div>
              <h1
                v-else-if="!isEditing"
                class="text-xl font-semibold text-gray-900"
              >
                {{ projectStore.currentProject?.name }}
              </h1>
              <Button variant="icon" @click="startEditing" class="ml-2">
                <PencilSquareIcon class="h-5 w-5" />
                <span class="sr-only">Edit Project Name</span>
              </Button>
            </div>
            <div v-if="isEditing" class="flex items-center">
              <Input
                ref="titleInput"
                v-model="editedTitle"
                class="font-semibold text-gray-900"
                @blur="saveTitle"
                @keyup.esc="cancelEditing"
              />
            </div>
          </div>
        </div>

        <!-- Archive Button -->
        <Button
          variant="secondary"
          @click="handleArchiveClick"
          :loading="isUnarchiving"
        >
          {{ projectStore.currentProject?.archived ? "Unarchive" : "Archive" }}
          Project
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
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>

    <!-- Modals -->
    <ArchiveProjectModal
      v-model="showArchiveModal"
      :project-id="route.params.projectId as string"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useProjectsStore } from "../stores/projects";
import { ArrowLeftIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import Button from "../components/ui/Button.vue";
import Input from "../components/ui/Input.vue";
import ArchiveProjectModal from "../components/modals/ArchiveProjectModal.vue";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectsStore();

const isEditing = ref(false);
const editedTitle = ref("");
const titleInput = ref<{ focus: () => void }>();
const showArchiveModal = ref(false);
const isUnarchiving = ref(false);
const isLoading = computed(() => projectStore.loading.project);

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
  if (
    projectStore.currentProject &&
    editedTitle.value.trim() &&
    editedTitle.value !== projectStore.currentProject.name
  ) {
    await projectStore.updateProject(projectStore.currentProject.id, {
      name: editedTitle.value.trim(),
    });
  }
  isEditing.value = false;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const handleArchiveClick = async () => {
  if (!projectStore.currentProject) return;

  if (projectStore.currentProject.archived) {
    // Directly unarchive
    isUnarchiving.value = true;
    try {
      await projectStore.updateProject(projectStore.currentProject.id, {
        archived: false,
      });
      router.push("/projects");
    } finally {
      isUnarchiving.value = false;
    }
  } else {
    // Show confirmation modal for archiving
    showArchiveModal.value = true;
  }
};

onMounted(() => {
  projectStore.fetchProjectById(route.params.projectId as string);
});
</script>
