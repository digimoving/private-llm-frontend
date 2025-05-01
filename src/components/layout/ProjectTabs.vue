<template>
  <nav
    class="flex space-x-1 border-b border-gray-200 mx-5 px-4"
    aria-label="Tabs"
  >
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="tab.to"
      :class="[
        'px-3 py-2 text-sm font-medium',
        isActiveTab(tab.to)
          ? projectStore.currentProject?.archived
            ? 'border-b-2 border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-b-2 border-primary-500 text-primary-600'
          : projectStore.currentProject?.archived
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300',
      ]"
      @click="projectStore.currentProject?.archived && $event.preventDefault()"
    >
      {{ tab.name }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, RouterLink } from "vue-router";
import { useProjectsStore } from "../../stores/projects";

const route = useRoute();
const projectStore = useProjectsStore();

const tabs = [
  { name: "LLM Resources", to: { name: "project-llms" } },
  { name: "Usage Metrics", to: { name: "project-metrics" } },
  { name: "Files", to: { name: "project-files" } },
  { name: "Settings", to: { name: "project-settings" } },
];

const isActiveTab = (tabTo: any) => {
  return route.name === tabTo.name;
};
</script>
