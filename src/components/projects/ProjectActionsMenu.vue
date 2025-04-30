<template>
  <div @click.stop>
    <ActionMenu :items="menuItems" @menu-click="handleMenuClick" />
    <ArchiveProjectModal v-model="showArchiveModal" :project-id="project.id" />
    <DeleteProjectModal v-model="showDeleteModal" :project-id="project.id" />
  </div>
</template>

<script setup lang="ts">
import {
  PencilSquareIcon,
  ArchiveBoxIcon,
  ArchiveBoxArrowDownIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import type { Project } from "../../types/types";
import { computed, ref } from "vue";
import ArchiveProjectModal from "../modals/ArchiveProjectModal.vue";
import DeleteProjectModal from "../modals/DeleteProjectModal.vue";
import ActionMenu from "../ui/ActionMenu.vue";
import type { MenuItemType } from "../ui/ActionMenu.vue";

interface Props {
  project: Project;
}

const props = defineProps<Props>();

const showArchiveModal = ref(false);
const showDeleteModal = ref(false);

const menuItems = computed<MenuItemType[]>(() => [
  {
    action: "edit",
    label: "Edit Project",
    class: "text-gray-700",
    activeClass: "bg-gray-100 text-gray-900",
    icon: PencilSquareIcon,
  },
  {
    action: "archive",
    label: `${props.project.archived ? "Unarchive" : "Archive"} Project`,
    class: "text-gray-700",
    activeClass: "bg-gray-100 text-gray-900",
    icon: props.project.archived ? ArchiveBoxIcon : ArchiveBoxArrowDownIcon,
  },
  {
    action: "delete",
    label: "Delete Project",
    class: "text-red-600",
    activeClass: "bg-red-50",
    showIf: () => props.project.archived,
    icon: TrashIcon,
  },
]);

const handleMenuClick = (action: string) => {
  if (action === "archive" && !props.project.archived) {
    showArchiveModal.value = true;
  } else if (action === "delete") {
    showDeleteModal.value = true;
  } else {
    emit("menuClick", { action, project: props.project });
  }
};

const emit = defineEmits<{
  (e: "menuClick", data: { action: string; project: Project }): void;
}>();
</script>
