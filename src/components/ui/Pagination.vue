<template>
  <div
    v-bind="$attrs"
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
  >
    <!-- Mobile -->
    <div class="flex flex-1 justify-between sm:hidden">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        class="relative inline-flex items-center"
        :disabled="currentPage === 1"
        @click="$emit('pageChange', currentPage - 1)"
        text="Previous"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        class="relative ml-3 inline-flex items-center"
        :disabled="currentPage === totalPages"
        @click="$emit('pageChange', currentPage + 1)"
        text="Next"
      />
    </div>
    <!-- Desktop -->
    <div
      class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full"
    >
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ startItem }}</span>
          to
          <span class="font-medium">{{ endItem }}</span>
          of
          <span class="font-medium">{{ totalItems }}</span>
          results
        </p>
      </div>
      <div>
        <PaginationButtonGroup
          :current-page="currentPage"
          :total-pages="totalPages"
          @pageChange="$emit('pageChange', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PaginationButtonGroup from "./PaginationButtonGroup.vue";
import Button from "./Button.vue";

const props = withDefaults(
  defineProps<{
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  }>(),
  {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  }
);

defineEmits<{
  (e: "pageChange", page: number): void;
}>();

const startItem = computed(() =>
  props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1
);
const endItem = computed(() =>
  Math.min(props.currentPage * props.pageSize, props.totalItems)
);

defineOptions({ inheritAttrs: false });
</script>
