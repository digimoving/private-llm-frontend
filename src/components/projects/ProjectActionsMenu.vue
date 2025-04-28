<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  ArchiveBoxArrowDownIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import type { Project } from "../../api/data/projects";
import { computed, ref } from "vue";
import ArchiveProjectModal from "../modals/ArchiveProjectModal.vue";
import DeleteProjectModal from "../modals/DeleteProjectModal.vue";

interface Props {
  project: Project;
}

type MenuAction = "edit" | "archive" | "delete";

interface MenuItem {
  action: MenuAction;
  label: string;
  class: string;
  activeClass: string;
  showIf?: () => boolean;
  icon: typeof PencilSquareIcon;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "menuClick", data: { action: MenuAction; project: Project }): void;
}>();

const showArchiveModal = ref(false);
const showDeleteModal = ref(false);

const menuItems = computed<MenuItem[]>(() => [
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

const handleMenuClick = (data: { action: MenuAction; project: Project }) => {
  if (data.action === "archive" && !props.project.archived) {
    showArchiveModal.value = true;
  } else if (data.action === "delete") {
    showDeleteModal.value = true;
  } else {
    emit("menuClick", data);
  }
};
</script>

<template>
  <Menu as="div" class="relative">
    <MenuButton class="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
      <EllipsisHorizontalIcon class="w-5 h-5 text-gray-500" />
    </MenuButton>
    <MenuItems
      class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10"
    >
      <template v-for="item in menuItems" :key="item.action">
        <MenuItem v-if="!item.showIf || item.showIf()" v-slot="{ active }">
          <button
            class="w-full text-left px-4 py-2 text-sm cursor-pointer flex items-center gap-2"
            :class="[active ? item.activeClass : item.class]"
            @click="handleMenuClick({ action: item.action, project })"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </button>
        </MenuItem>
      </template>
    </MenuItems>
  </Menu>

  <ArchiveProjectModal v-model="showArchiveModal" :project-id="project.id" />

  <DeleteProjectModal v-model="showDeleteModal" :project-id="project.id" />
</template>
