<!-- ProjectLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <ProjectNav
      @archive="showArchiveModal = true"
      @delete="showDeleteModal = true"
    />
    <main class="pt-4 pb-8">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectTabs class="mb-5" />
        <div class="mb-3">
          <h1 class="text-xl font-semibold text-gray-900">
            {{ route.meta.title }}
          </h1>
          <p v-if="route.meta.subtitle" class="mt-2 text-sm text-gray-700">
            {{ route.meta.subtitle }}
          </p>
        </div>
        <div class="min-h-[calc(100vh-16rem)]">
          <router-view />
        </div>
      </div>
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
