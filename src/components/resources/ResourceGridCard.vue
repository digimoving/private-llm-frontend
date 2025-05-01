<template>
  <div
    class="relative bg-white rounded-lg border border-gray-200 p-6 transition-shadow duration-200 flex flex-col h-[250px]"
    :class="{
      'hover:shadow-sm cursor-pointer': !isDisabled,
      'opacity-75 cursor-not-allowed': isDisabled,
    }"
    @click="!isDisabled && navigateToResource()"
  >
    <div class="flex items-center justify-between">
      <StatusChip :status="getResourceStatus(resource)" />
      <ResourceActionsMenu
        :resource="resource"
        :resource-type="resourceType"
        :disabled="isDisabled"
        @menu-click="handleMenuClick"
      />
    </div>

    <div class="flex flex-col flex-grow">
      <h3
        class="font-semibold text-lg mt-4"
        :class="isDisabled ? 'text-gray-500' : 'text-gray-900'"
      >
        {{ resource.name }}
      </h3>
      <p class="text-sm text-gray-600 mt-2 line-clamp-2">
        {{ resource.description }}
      </p>
    </div>

    <div class="mt-auto">
      <div class="flex flex-wrap gap-2 my-3">
        <Chip
          v-for="tag in resource.tags"
          :key="tag"
          size="xs"
          :text="tag"
          :class="[
            isDisabled || resource.archived
              ? 'bg-gray-100 text-gray-400'
              : 'bg-secondary-100 text-secondary-700',
            'font-normal',
          ]"
        />
      </div>
    </div>
    <div class="text-xs text-gray-500">Last updated: {{ timeAgo }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Project, LLMResource } from "../../types/types";
import Chip from "../ui/Chip.vue";
import StatusChip from "../global/StatusChip.vue";
import ResourceActionsMenu from "./ResourceActionsMenu.vue";
import { useFormattedTimeAgo } from "../../composables/useFormattedTimeAgo";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useProjectsStore } from "../../stores/projects";

const router = useRouter();
const projectsStore = useProjectsStore();

const props = defineProps<{
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
}>();

const emit = defineEmits<{
  (
    e: "menuClick",
    data: {
      action: "edit" | "archive" | "delete" | "toggleActive";
      resource: Project | LLMResource;
      resourceType: "project" | "llm";
    }
  ): void;
}>();

const isDisabled = computed(() => {
  if (props.resourceType === "llm") {
    return projectsStore.currentProject?.archived || false;
  }
  return false;
});

const timeAgo = computed(() => {
  const date =
    "lastUpdated" in props.resource
      ? props.resource.lastUpdated
      : props.resource.updatedAt;
  return useFormattedTimeAgo(date);
});

const navigateToResource = () => {
  const basePath = props.resourceType === "project" ? "projects" : "llms";
  router.push(`/${basePath}/${props.resource.id}/llms`);
};

const handleMenuClick = (event: {
  action: "edit" | "archive" | "delete" | "toggleActive";
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
}) => {
  emit("menuClick", event);
};

const getResourceStatus = (
  resource: Project | LLMResource
): "active" | "paused" | "archived" => {
  if (resource.archived) return "archived";
  if ("paused" in resource && resource.paused) return "paused";
  return "active";
};
</script>
