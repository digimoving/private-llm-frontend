<template>
  <div
    class="relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200 flex flex-col h-full cursor-pointer"
    @click="navigateToResource"
  >
    <div class="flex items-center justify-between">
      <StatusChip :is-archived="resource.archived" />
      <ResourceActionsMenu
        v-if="resourceType === 'project'"
        :resource="resource"
        :resource-type="resourceType"
        @menu-click="handleMenuClick"
      />
    </div>

    <h3 class="font-semibold text-gray-900 text-lg mt-4">
      {{ resource.name }}
    </h3>
    <p class="text-sm text-gray-600 mt-2 line-clamp-2">
      {{ resource.description }}
    </p>

    <div class="flex flex-wrap gap-2 my-3">
      <Chip
        v-for="tag in resource.tags"
        :key="tag"
        size="xs"
        :text="tag"
        class="bg-secondary-100 text-secondary-700 font-normal"
      />
    </div>
    <div class="text-xs text-gray-500 mt-auto">Last updated: {{ timeAgo }}</div>
    <LLMCardActions
      v-if="resourceType === 'llm'"
      :llm="resource as LLMResource"
      @toggle-active="handleToggleActive"
      @archive="handleArchive"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup lang="ts">
import type { Project, LLMResource } from "../../types/types";
import Chip from "../ui/Chip.vue";
import StatusChip from "../global/StatusChip.vue";
import ResourceActionsMenu from "./ResourceActionsMenu.vue";
import LLMCardActions from "./LLMCardActions.vue";
import { useFormattedTimeAgo } from "../../composables/useFormattedTimeAgo";
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const props = defineProps<{
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
}>();

const emit = defineEmits<{
  (
    e: "menuClick",
    data: {
      action: "edit" | "archive" | "delete";
      resource: Project | LLMResource;
      resourceType: "project" | "llm";
    }
  ): void;
  (e: "toggleActive", llm: LLMResource): void;
}>();

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
  action: "edit" | "archive" | "delete";
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
}) => {
  emit("menuClick", event);
};

const handleToggleActive = (llm: LLMResource) => {
  emit("toggleActive", llm);
};

const handleArchive = (llm: LLMResource) => {
  emit("menuClick", {
    action: "archive",
    resource: llm,
    resourceType: "llm",
  });
};

const handleEdit = (llm: LLMResource) => {
  emit("menuClick", {
    action: "edit",
    resource: llm,
    resourceType: "llm",
  });
};
</script>
