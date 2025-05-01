<template>
  <div
    class="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
    @click="navigateToResource"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h3 class="font-semibold text-gray-900">{{ resource.name }}</h3>
        <StatusChip :is-archived="resource.archived" />
        <div class="flex flex-wrap gap-1">
          <Chip
            v-for="tag in resource.tags"
            :key="tag"
            size="xs"
            :text="tag"
            class="bg-secondary-100 text-secondary-700 font-normal"
          />
        </div>
      </div>
      <ResourceActionsMenu
        :resource="resource"
        :resource-type="resourceType"
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
}>();

const navigateToResource = () => {
  const basePath = props.resourceType === "project" ? "projects" : "llms";
  router.push(`/${basePath}/${props.resource.id}/llms`);
};

const handleMenuClick = (event: {
  action: "edit" | "archive" | "delete";
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
}) => {
  // Stop the click event from bubbling up to the card
  if (event instanceof Event) {
    event.stopPropagation();
  }
  emit("menuClick", event);
};
</script>
