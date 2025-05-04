<template>
  <!-- TODO: Create mobile version of tabs -->
  <nav class="flex space-x-1 border-b border-gray-200" aria-label="Tabs">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="tab.to"
      :class="[
        'px-3 py-2 text-md font-medium',
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

// Map of parent routes to their child routes
const routeGroups = {
  "project-metrics": ["metrics-overview", "metrics-reporting", "metrics-logs"],
};

const isActiveTab = (tabTo: any) => {
  // Check if current route matches the tab directly
  if (route.name === tabTo.name) return true;

  // Check if current route is a child of the tab's route
  const childRoutes = routeGroups[tabTo.name as keyof typeof routeGroups];
  return childRoutes?.includes(route.name as string) || false;
};
</script>
