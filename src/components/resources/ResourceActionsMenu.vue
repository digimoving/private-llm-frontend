<template>
  <div @click.stop>
    <ActionMenu
      :items="menuItems"
      @menu-click="handleMenuClick"
      :disabled="disabled"
    />
    <ArchiveResourceModal
      v-model="showArchiveModal"
      :resource-id="resource.id"
      :resource-type="capitalizedResourceType"
    />
    <DeleteResourceModal
      v-model="showDeleteModal"
      :resource-id="resource.id"
      :resource-type="capitalizedResourceType"
    />
    <PauseLLMModal
      v-if="showToggleStatusModal"
      v-model="showToggleStatusModal"
      :llm-id="resource.id"
      :is-paused="isLLMPaused"
      @state-changed="handleStateChanged"
    />
  </div>
</template>

<script setup lang="ts">
import {
  PencilSquareIcon,
  ArchiveBoxIcon,
  ArchiveBoxArrowDownIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/vue/24/outline";
import type { Project, LLMResource } from "../../types/types";
import { computed, ref } from "vue";
import ArchiveResourceModal from "../modals/ArchiveResourceModal.vue";
import DeleteResourceModal from "../modals/DeleteResourceModal.vue";
import PauseLLMModal from "../modals/PauseLLMModal.vue";
import ActionMenu from "../ui/ActionMenu.vue";
import type { MenuItemType } from "../ui/ActionMenu.vue";

interface Props {
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
  disabled?: boolean;
}

const props = defineProps<Props>();

const showArchiveModal = ref(false);
const showDeleteModal = ref(false);
const showToggleStatusModal = ref(false);

const capitalizedResourceType = computed<"Project" | "LLM">(() =>
  props.resourceType === "project" ? "Project" : "LLM"
);

const isLLMPaused = computed(() => {
  if (props.resourceType !== "llm") return false;
  return (props.resource as LLMResource).paused;
});

const menuItems = computed<MenuItemType[]>(() => {
  const items: MenuItemType[] = [
    {
      action: "edit",
      label: `Edit ${capitalizedResourceType.value}`,
      class: "text-gray-700",
      activeClass: "bg-gray-100 text-gray-900",
      icon: PencilSquareIcon,
      disabled: props.disabled,
    },
    {
      action: "archive",
      label: `${props.resource.archived ? "Unarchive" : "Archive"} ${capitalizedResourceType.value}`,
      class: "text-gray-700",
      activeClass: "bg-gray-100 text-gray-900",
      icon: props.resource.archived ? ArchiveBoxIcon : ArchiveBoxArrowDownIcon,
      disabled: props.disabled,
    },
    {
      action: "delete",
      label: `Delete ${capitalizedResourceType.value}`,
      class: "text-red-600",
      activeClass: "bg-red-50",
      showIf: () => props.resource.archived,
      icon: TrashIcon,
      disabled: props.disabled,
    },
  ];

  // Add Play/Pause action for LLMs only
  if (props.resourceType === "llm" && !props.resource.archived) {
    items.unshift({
      action: "toggleActive",
      label: `${isLLMPaused.value ? "Resume" : "Pause"} LLM`,
      class: "text-gray-700",
      activeClass: "bg-gray-100 text-gray-900",
      icon: isLLMPaused.value ? PlayIcon : PauseIcon,
      disabled: props.disabled,
    });
  }

  return items;
});

const handleMenuClick = async (action: string) => {
  if (!["edit", "archive", "delete", "toggleActive"].includes(action)) return;
  if (props.disabled) return;

  const typedAction = action as "edit" | "archive" | "delete" | "toggleActive";

  if (typedAction === "archive" && !props.resource.archived) {
    showArchiveModal.value = true;
  } else if (typedAction === "delete") {
    showDeleteModal.value = true;
  } else if (typedAction === "toggleActive") {
    showToggleStatusModal.value = true;
  } else {
    emit("menuClick", {
      action: typedAction,
      resource: props.resource,
      resourceType: props.resourceType,
    });
  }
};

const handleStateChanged = () => {
  showToggleStatusModal.value = false;
};

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
</script>
