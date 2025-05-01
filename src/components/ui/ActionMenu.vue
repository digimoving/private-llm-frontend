<template>
  <Menu as="div" class="relative">
    <MenuButton
      class="p-1 rounded-full"
      :class="[
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-gray-100 cursor-pointer',
      ]"
      :disabled="disabled"
    >
      <EllipsisHorizontalIcon class="w-5 h-5 text-gray-500" />
    </MenuButton>
    <MenuItems
      class="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10"
    >
      <template v-for="item in items" :key="item.action">
        <MenuItem v-if="!item.showIf || item.showIf()" v-slot="{ active }">
          <Button
            variant="flat"
            :icon="item.icon"
            :text="item.label"
            :class="[
              'w-full text-left',
              active && !disabled ? item.activeClass : item.class,
              disabled || item.disabled ? 'opacity-50 cursor-not-allowed' : '',
            ]"
            :disabled="disabled || item.disabled"
            @click="handleMenuClick(item.action)"
          />
        </MenuItem>
      </template>
    </MenuItems>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { EllipsisHorizontalIcon } from "@heroicons/vue/24/outline";
import type { FunctionalComponent } from "vue";
import Button from "./Button.vue";

export interface MenuItemType {
  action: string;
  label: string;
  class: string;
  activeClass: string;
  showIf?: () => boolean;
  icon: FunctionalComponent;
  disabled?: boolean;
}

interface Props {
  items: MenuItemType[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: "menuClick", action: string): void;
}>();

const handleMenuClick = (action: string) => {
  if (props.disabled) return;
  emit("menuClick", action);
};
</script>
