<template>
  <div class="flex-shrink-0">
    <!-- JSON -->
    <CodeBracketIcon v-if="type === 'JSON'" class="w-5 h-5 text-blue-500" />

    <!-- CSV -->
    <TableCellsIcon v-else-if="type === 'CSV'" class="w-5 h-5 text-green-500" />

    <!-- TXT -->
    <DocumentTextIcon
      v-else-if="type === 'TXT'"
      class="w-5 h-5 text-gray-500"
    />

    <!-- PDF -->
    <DocumentIcon v-else-if="type === 'PDF'" class="w-5 h-5 text-red-500" />

    <!-- Image (PNG, JPG, etc) -->
    <PhotoIcon
      v-else-if="['PNG', 'JPG', 'JPEG', 'GIF'].includes(type)"
      class="w-5 h-5 text-purple-500"
    />

    <!-- Default/Unknown -->
    <DocumentIcon v-else class="w-5 h-5 text-gray-400" />
  </div>
</template>

<script setup lang="ts">
import {
  CodeBracketIcon,
  TableCellsIcon,
  DocumentTextIcon,
  DocumentIcon,
  PhotoIcon,
} from "@heroicons/vue/24/outline";

defineProps<{
  type: string;
}>();
</script>
