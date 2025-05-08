<template>
  <div
    class="relative bg-white rounded-lg border border-gray-200 p-4 transition-shadow duration-200 h-[72px]"
    :class="{
      'hover:shadow-sm cursor-pointer':
        !isDisabled && resourceType === 'project',
      'opacity-75 cursor-not-allowed': isDisabled,
    }"
    @click="handleCardClick"
  >
    <div class="flex items-center justify-between h-full">
      <div class="flex items-center gap-3 min-w-0">
        <h3
          class="font-semibold truncate"
          :class="isDisabled ? 'text-gray-500' : 'text-gray-900'"
        >
          {{ resource.name }}
        </h3>
        <StatusChip :status="getResourceStatus(resource)" />
        <div class="flex flex-wrap gap-1 overflow-hidden">
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
      <ResourceActionsMenu
        :resource="resource"
        :resource-type="resourceType"
        :disabled="isDisabled"
        @menu-click="handleMenuClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project, LLMResource } from "../../types/types";
import StatusChip from "../global/StatusChip.vue";
import ResourceActionsMenu from "./ResourceActionsMenu.vue";
import Chip from "../ui/Chip.vue";
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

const navigateToResource = () => {
  const basePath = props.resourceType === "project" ? "projects" : "llms";
  router.push(`/${basePath}/${props.resource.id}/llms`);
};

const handleMenuClick = (event: {
  action: "edit" | "archive" | "delete" | "toggleActive";
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
}) => {
  // Stop the click event from bubbling up to the card
  if (event instanceof Event) {
    event.stopPropagation();
  }
  emit("menuClick", event);
};

const getResourceStatus = (
  resource: Project | LLMResource
): "active" | "paused" | "archived" => {
  if (resource.archived) return "archived";
  if ("paused" in resource && resource.paused) return "paused";
  return "active";
};

const handleCardClick = (event: MouseEvent) => {
  if (props.resourceType === "project" && !isDisabled.value) {
    navigateToResource();
  }
  // For LLMs, do nothing
};
</script>
