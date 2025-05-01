<template>
  <div>
    <div
      :class="{
        'space-y-2': showAsList,
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4': !showAsList,
      }"
    >
      <AddNewResourceCard
        :show-as-list="showAsList"
        :resource-type="resourceType"
        @click="$emit('add-resource')"
      />
      <template v-for="resource in resources" :key="resource.id">
        <ResourceListCard
          v-if="showAsList"
          :resource="resource"
          :resource-type="resourceType"
          @menuClick="(data) => $emit('menu-click', { ...data, resourceType })"
        />
        <ResourceGridCard
          v-else
          :resource="resource"
          :resource-type="resourceType"
          @menuClick="(data) => $emit('menu-click', { ...data, resourceType })"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useProjectsStore } from "../../stores/projects";
import { useLLMsStore } from "../../stores/llms";
import type { Project, LLMResource } from "../../types/types";
import ResourceListCard from "./ResourceListCard.vue";
import ResourceGridCard from "./ResourceGridCard.vue";
import AddNewResourceCard from "./AddNewResourceCard.vue";

const props = defineProps<{
  showAsList: boolean;
  showArchived: boolean;
  resourceType: "project" | "llm";
  selectedFilters: {
    status: string[];
    tags: string[];
  };
  sortBy:
    | "newest"
    | "oldest"
    | "recently-updated"
    | "least-recently-updated"
    | "name-asc"
    | "name-desc";
}>();

const projectsStore = useProjectsStore();
const llmsStore = useLLMsStore();

const getUpdateDate = (resource: Project | LLMResource) => {
  if ("updatedAt" in resource) {
    return resource.updatedAt;
  }
  return resource.lastUpdated;
};

const resources = computed(() => {
  const store = props.resourceType === "project" ? projectsStore : llmsStore;
  if (!store) return [];

  const filteredResources =
    props.resourceType === "project"
      ? projectsStore.filteredProjects(
          props.showArchived,
          props.selectedFilters.tags
        )
      : llmsStore.llms.filter((llm: LLMResource) => {
          if (!props.showArchived && llm.archived) return false;

          if (
            props.selectedFilters.tags.length &&
            !props.selectedFilters.tags.includes("all")
          ) {
            return llm.tags?.some((tag: string) =>
              props.selectedFilters.tags.includes(tag)
            );
          }
          return true;
        });

  return [...filteredResources].sort((a, b) => {
    switch (props.sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "recently-updated": {
        const bDate = getUpdateDate(b);
        const aDate = getUpdateDate(a);
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      }
      case "least-recently-updated": {
        const bDate = getUpdateDate(b);
        const aDate = getUpdateDate(a);
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      }
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
});

defineEmits<{
  (e: "add-resource"): void;
  (
    e: "menu-click",
    data: {
      action: "edit" | "archive" | "delete" | "toggleActive";
      resource: Project | LLMResource;
      resourceType: "project" | "llm";
    }
  ): void;
}>();
</script>
