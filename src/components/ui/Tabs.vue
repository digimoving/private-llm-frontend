<template>
  <nav
    class="-mb-px flex space-x-8 border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap"
    aria-label="Tabs"
  >
    <component
      v-for="tab in tabs"
      :key="tab.id"
      :is="useRouterLink ? RouterLink : 'button'"
      :to="useRouterLink ? tab.to : undefined"
      @click="handleTabClick(tab)"
      :aria-disabled="isTabDisabled(tab)"
      :class="[
        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex-shrink-0 cursor-pointer',
        activeTab === tab.id
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        isTabDisabled(tab)
          ? 'opacity-50 cursor-not-allowed pointer-events-none'
          : '',
        useRouterLink ? 'focus:outline-none' : '',
      ]"
      type="button"
    >
      <slot name="tab" :tab="tab">
        {{ tab.label }}
      </slot>
    </component>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
const props = defineProps<{
  tabs: { id: string; label: string; to?: any }[];
  activeTab: string;
  useRouterLink?: boolean;
  disabled?: string[];
}>();

const emit = defineEmits<{
  (e: "update:activeTab", tabId: string): void;
}>();

const isTabDisabled = (tab: { id: string }) => props.disabled?.includes(tab.id);

const handleTabClick = (tab: { id: string }) => {
  if (isTabDisabled(tab)) return;
  if (!props.useRouterLink) emit("update:activeTab", tab.id);
};
</script>
