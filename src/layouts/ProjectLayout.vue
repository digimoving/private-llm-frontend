<!-- ProjectLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <ProjectNav
      @archive="showArchiveModal = true"
      @delete="showDeleteModal = true"
    />
    <ProjectTabs class="my-4" />
    <!-- Main Content -->
    <main class="min-h-[calc(100vh-12rem)] mx-auto px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Modals -->
    <ArchiveResourceModal
      v-model="showArchiveModal"
      :resource-id="route.params.projectId as string"
      resource-type="Project"
    />
    <DeleteResourceModal
      v-if="showDeleteModal"
      v-model="showDeleteModal"
      :resource-id="route.params.projectId as string"
      resource-type="Project"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProjectsStore } from "../stores/projects";
import { useLLMsStore } from "../stores/llms";
import ProjectNav from "../components/layout/ProjectNav.vue";
import ArchiveResourceModal from "../components/modals/ArchiveResourceModal.vue";
import DeleteResourceModal from "../components/modals/DeleteResourceModal.vue";
import ProjectTabs from "../components/layout/ProjectTabs.vue";

const route = useRoute();
const projectStore = useProjectsStore();
const llmsStore = useLLMsStore();

const showArchiveModal = ref(false);
const showDeleteModal = ref(false);

onMounted(async () => {
  const projectId = route.params.projectId as string;
  await projectStore.fetchProjectById(projectId);
  llmsStore.setCurrentProject(projectId);
});
</script>
