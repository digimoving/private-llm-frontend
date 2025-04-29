<template>
  <Menu as="div" class="relative">
    <MenuButton class="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
      <EllipsisHorizontalIcon class="w-5 h-5 text-gray-500" />
    </MenuButton>
    <MenuItems
      class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10"
    >
      <template v-for="item in items" :key="item.action">
        <MenuItem v-if="!item.showIf || item.showIf()" v-slot="{ active }">
          <button
            class="w-full text-left px-4 py-2 text-sm cursor-pointer flex items-center gap-2"
            :class="[active ? item.activeClass : item.class]"
            @click="handleMenuClick(item.action)"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </button>
        </MenuItem>
      </template>
    </MenuItems>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { EllipsisHorizontalIcon } from "@heroicons/vue/24/outline";
import type { Component } from "vue";

export interface MenuItemType {
  action: string;
  label: string;
  class: string;
  activeClass: string;
  showIf?: () => boolean;
  icon: Component;
}

interface Props {
  items: MenuItemType[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "menuClick", action: string): void;
}>();

const handleMenuClick = (action: string) => {
  emit("menuClick", action);
};
</script>
