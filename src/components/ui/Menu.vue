<template>
  <Menu as="div" class="relative">
    <div>
      <MenuButton
        class="relative flex rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer transition-colors duration-200"
        :aria-label="ariaLabel"
      >
        <span class="sr-only">{{ ariaLabel }}</span>
        <component :is="icon" class="h-6 w-6" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
        :aria-label="ariaLabel"
      >
        <MenuItem
          v-for="(item, index) in items"
          :key="index"
          v-slot="{ active, disabled }"
        >
          <Button
            variant="flat"
            :icon="item.icon"
            :text="item.label"
            @click="handleItemClick(item)"
            :class="[
              active ? 'bg-gray-100' : '',
              'w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700',
              disabled ? 'opacity-50 cursor-not-allowed' : '',
            ]"
            :disabled="disabled"
          />
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { UserCircleIcon } from "@heroicons/vue/24/outline";
import type { FunctionalComponent } from "vue";
import Button from "./Button.vue";

export interface MenuItemType {
  label: string;
  onClick?: () => void;
  icon?: FunctionalComponent;
  disabled?: boolean;
}

withDefaults(
  defineProps<{
    items: MenuItemType[];
    icon?: FunctionalComponent;
    ariaLabel?: string;
  }>(),
  {
    icon: () => UserCircleIcon,
    ariaLabel: "User menu",
  }
);

/**
 * @param item The menu item that was clicked
 */
const handleItemClick = (item: MenuItemType) => {
  if (item.disabled) return;
  if (item.onClick) {
    item.onClick();
  } else {
    console.warn(`Menu item "${item.label}" has no onClick handler`);
  }
};
</script>
