<template>
  <nav
    class="isolate inline-flex -space-x-px rounded-md shadow-xs"
    aria-label="Pagination"
  >
    <a
      href="#"
      class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      :class="{ 'pointer-events-none opacity-50': currentPage === 1 }"
      @click.prevent="goToPage(currentPage - 1)"
      aria-label="Previous page"
    >
      <span class="sr-only">Previous</span>
      <ChevronLeftIcon class="size-5" aria-hidden="true" />
    </a>
    <template v-for="page in paginationPages" :key="page">
      <a
        v-if="typeof page === 'number'"
        href="#"
        :aria-current="page === currentPage ? 'page' : undefined"
        @click.prevent="goToPage(page)"
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        :class="
          page === currentPage
            ? 'z-10 bg-indigo-600 text-white'
            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
        "
      >
        {{ page }}
      </a>
      <span
        v-else
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0 select-none"
      >
        ...
      </span>
    </template>
    <a
      href="#"
      class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      :class="{ 'pointer-events-none opacity-50': currentPage === totalPages }"
      @click.prevent="goToPage(currentPage + 1)"
      aria-label="Next page"
    >
      <span class="sr-only">Next</span>
      <ChevronRightIcon class="size-5" aria-hidden="true" />
    </a>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{ (e: "pageChange", page: number): void }>();

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return;
  emit("pageChange", page);
}

const paginationPages = computed<(number | string)[]>(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  if (current > 4) pages.push(1);
  if (current > 5) pages.push("...");
  for (
    let i = Math.max(2, current - 2);
    i <= Math.min(total - 1, current + 2);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 4) pages.push("...");
  if (current < total - 3) pages.push(total);
  return pages;
});
</script>
