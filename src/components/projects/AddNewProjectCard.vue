<template>
  <Card
    class="group w-full h-full transition-all duration-200 bg-white border border-dashed border-gray-400 hover:border-gray-500 hover:shadow-md cursor-pointer"
    :class="{
      'p-8': !showAsList,
      'p-4': showAsList,
    }"
    @click="$emit('click')"
  >
    <template v-if="showAsList">
      <div class="flex items-center gap-3">
        <div class="rounded-full bg-primary-50 p-2">
          <PlusIcon class="w-5 h-5 text-primary-600" />
        </div>
        <span class="text-gray-700 font-medium">Add Project</span>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center justify-center h-full text-center">
        <div class="rounded-full bg-primary-50 p-4 mb-4">
          <PlusIcon class="w-6 h-6 text-primary-600" />
        </div>
        <div class="text-gray-900">Add Project</div>
        <div class="mt-1 text-sm text-gray-500">
          Create a new AI model project
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/outline";
import Card from "../ui/Card.vue";

withDefaults(
  defineProps<{
    showAsList?: boolean;
  }>(),
  {
    showAsList: false,
  }
);

defineEmits<{
  (e: "click"): void;
}>();
</script>
