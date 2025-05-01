<template>
  <div @click.stop>
    <ActionMenu :items="menuItems" @menu-click="handleMenuClick" />
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
  </div>
</template>

<script setup lang="ts">
import {
  PencilSquareIcon,
  ArchiveBoxIcon,
  ArchiveBoxArrowDownIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import type { Project, LLMResource } from "../../types/types";
import { computed, ref } from "vue";
import ArchiveResourceModal from "../modals/ArchiveResourceModal.vue";
import DeleteResourceModal from "../modals/DeleteResourceModal.vue";
import ActionMenu from "../ui/ActionMenu.vue";
import type { MenuItemType } from "../ui/ActionMenu.vue";

interface Props {
  resource: Project | LLMResource;
  resourceType: "project" | "llm";
}

const props = defineProps<Props>();

const showArchiveModal = ref(false);
const showDeleteModal = ref(false);

const capitalizedResourceType = computed<"Project" | "LLM">(() =>
  props.resourceType === "project" ? "Project" : "LLM"
);

const menuItems = computed<MenuItemType[]>(() => [
  {
    action: "edit",
    label: `Edit ${capitalizedResourceType.value}`,
    class: "text-gray-700",
    activeClass: "bg-gray-100 text-gray-900",
    icon: PencilSquareIcon,
  },
  {
    action: "archive",
    label: `${props.resource.archived ? "Unarchive" : "Archive"} ${capitalizedResourceType.value}`,
    class: "text-gray-700",
    activeClass: "bg-gray-100 text-gray-900",
    icon: props.resource.archived ? ArchiveBoxIcon : ArchiveBoxArrowDownIcon,
  },
  {
    action: "delete",
    label: `Delete ${capitalizedResourceType.value}`,
    class: "text-red-600",
    activeClass: "bg-red-50",
    showIf: () => props.resource.archived,
    icon: TrashIcon,
  },
]);

const handleMenuClick = (action: string) => {
  if (!["edit", "archive", "delete"].includes(action)) return;

  const typedAction = action as "edit" | "archive" | "delete";

  if (typedAction === "archive" && !props.resource.archived) {
    showArchiveModal.value = true;
  } else if (typedAction === "delete") {
    showDeleteModal.value = true;
  } else {
    emit("menuClick", {
      action: typedAction,
      resource: props.resource,
      resourceType: props.resourceType,
    });
  }
};

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
</script>
