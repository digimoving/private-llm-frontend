<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { EllipsisHorizontalIcon } from "@heroicons/vue/24/outline";
import type { Project } from "../../data/projects";

interface Props {
  project: Project;
}

defineProps<Props>();

defineEmits<{
  (
    e: "menuClick",
    data: { action: "edit" | "archive" | "delete"; project: Project }
  ): void;
}>();
</script>

<template>
  <Menu as="div" class="relative">
    <MenuButton class="p-1 rounded-full hover:bg-gray-100">
      <EllipsisHorizontalIcon class="w-5 h-5 text-gray-500" />
    </MenuButton>
    <MenuItems
      class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10"
    >
      <MenuItem v-slot="{ active }">
        <button
          class="w-full text-left px-4 py-2 text-sm"
          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700']"
          @click="$emit('menuClick', { action: 'edit', project })"
        >
          Edit project
        </button>
      </MenuItem>
      <MenuItem v-slot="{ active }">
        <button
          class="w-full text-left px-4 py-2 text-sm"
          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700']"
          @click="$emit('menuClick', { action: 'archive', project })"
        >
          {{ project.archived ? "Unarchive" : "Archive" }} project
        </button>
      </MenuItem>
      <MenuItem v-slot="{ active }">
        <button
          class="w-full text-left px-4 py-2 text-sm text-red-600"
          :class="[active ? 'bg-red-50' : '']"
          @click="$emit('menuClick', { action: 'delete', project })"
        >
          Delete project
        </button>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>
