<template>
  <Menu as="div" class="relative">
    <div>
      <MenuButton as="div">
        <Button
          variant="secondary"
          :icon="ArrowsUpDownIcon"
          class="whitespace-nowrap"
          :disabled="disabled"
          :text="buttonText"
        />
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
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        <MenuItem
          v-for="option in sortOptions"
          :key="option.label"
          v-slot="{ active }"
        >
          <button
            type="button"
            @click="option.onClick"
            :class="[
              active ? 'bg-gray-100' : '',
              'w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 cursor-pointer transition-colors duration-200',
              option.label === buttonText.split(': ')[1]
                ? 'font-bold'
                : 'font-normal',
            ]"
          >
            {{ option.label }}
            <CheckIcon
              v-if="option.label === buttonText.split(': ')[1]"
              class="h-4 w-4 text-gray-600"
              aria-hidden="true"
            />
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ArrowsUpDownIcon } from "@heroicons/vue/24/outline";
import Button from "../../components/ui/Button.vue";
import { CheckIcon } from "@heroicons/vue/24/outline";

type SortOption =
  | "newest"
  | "oldest"
  | "recently-updated"
  | "least-recently-updated"
  | "name-asc"
  | "name-desc";

const props = defineProps<{
  modelValue: SortOption;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: SortOption): void;
}>();

const buttonText = computed(() => {
  const labels: Record<SortOption, string> = {
    newest: "Newest",
    oldest: "Oldest",
    "recently-updated": "Recently Updated",
    "least-recently-updated": "Least Recently Updated",
    "name-asc": "Name (A-Z)",
    "name-desc": "Name (Z-A)",
  };
  return `Sort by: ${labels[props.modelValue]}`;
});

const sortOptions = [
  {
    label: "Newest",
    onClick: () => emit("update:modelValue", "newest"),
  },
  {
    label: "Oldest",
    onClick: () => emit("update:modelValue", "oldest"),
  },
  {
    label: "Recently Updated",
    onClick: () => emit("update:modelValue", "recently-updated"),
  },
  {
    label: "Least Recently Updated",
    onClick: () => emit("update:modelValue", "least-recently-updated"),
  },
  {
    label: "Name (A-Z)",
    onClick: () => emit("update:modelValue", "name-asc"),
  },
  {
    label: "Name (Z-A)",
    onClick: () => emit("update:modelValue", "name-desc"),
  },
];
</script>
