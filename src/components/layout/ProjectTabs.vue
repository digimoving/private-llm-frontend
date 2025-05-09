<template>
  <!-- TODO: Create mobile version of tabs -->
  <Tabs
    :tabs="tabs"
    :active-tab="activeTab"
    :use-router-link="true"
    :disabled="
      projectStore.currentProject?.archived ? tabs.map((t) => t.id) : []
    "
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectsStore } from "../../stores/projects";
import Tabs from "../ui/Tabs.vue";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectsStore();

const tabs = [
  { id: "project-llms", label: "LLM Resources", to: { name: "project-llms" } },
  {
    id: "project-metrics",
    label: "Usage Metrics",
    to: { name: "project-metrics" },
  },
  { id: "project-files", label: "Files", to: { name: "project-files" } },
  {
    id: "project-settings",
    label: "Settings",
    to: { name: "project-settings" },
  },
];

const getActiveTab = () => {
  const name = route.name as string;
  if (
    ["metrics-overview", "metrics-reporting", "metrics-logs"].includes(name)
  ) {
    return "project-metrics";
  }
  return tabs.find((tab) => tab.to.name === name)?.id || "project-llms";
};

const activeTab = computed(getActiveTab);
</script>
