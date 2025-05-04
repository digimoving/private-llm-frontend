<template>
  <!-- TODO: Create mobile version of tabs -->

  <div class="mb-6 rounded-md p-2 bg-gray-100">
    <div class="grid grid-cols-1 sm:hidden">
      <!-- Mobile dropdown -->
      <select
        v-model="currentTab"
        aria-label="Select a tab"
        class="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
        @change="handleTabChange"
      >
        <option
          v-for="tab in tabs"
          :key="tab.name"
          :value="tab.to.name"
          :selected="isActiveTab(tab.to)"
        >
          {{ tab.name }}
        </option>
      </select>
      <ChevronDownIcon
        class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        aria-hidden="true"
      />
    </div>
    <div class="hidden sm:block">
      <nav class="flex space-x-4" aria-label="Tabs">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.to"
          :class="[
            isActiveTab(tab.to)
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700',
            'rounded-md px-3 py-2 text-sm font-medium',
          ]"
          :aria-current="isActiveTab(tab.to) ? 'page' : undefined"
        >
          {{ tab.name }}
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { ChevronDownIcon } from "@heroicons/vue/16/solid";

const route = useRoute();
const router = useRouter();
const currentTab = ref("metrics-overview");

const tabs = [
  { name: "Overview", to: { name: "metrics-overview" } },
  { name: "Reporting", to: { name: "metrics-reporting" } },
  { name: "Request Logs", to: { name: "metrics-logs" } },
];

const isActiveTab = (tabTo: any) => {
  return route.name === tabTo.name;
};

const handleTabChange = () => {
  router.push({ name: currentTab.value });
};

// Handle initial navigation
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === "project-metrics") {
      router.push({ name: "metrics-overview" });
    }
    // Update currentTab when route changes
    if (
      typeof newRouteName === "string" &&
      tabs.some((tab) => tab.to.name === newRouteName)
    ) {
      currentTab.value = newRouteName;
    }
  },
  { immediate: true }
);
</script>
