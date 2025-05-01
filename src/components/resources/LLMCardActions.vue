<template>
  <div class="flex justify-between">
    <!-- Play/Pause Button -->
    <Button
      variant="icon"
      size="sm"
      :icon="isActive ? PauseIcon : PlayIcon"
      @click.stop="handleToggleActive"
      :aria-label="isActive ? 'Pause LLM' : 'Resume LLM'"
      class="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-md"
    />

    <!-- Right-side actions -->
    <div class="flex gap-1">
      <Button
        variant="icon"
        size="sm"
        :icon="ArchiveBoxIcon"
        @click.stop="handleArchive"
        aria-label="Archive LLM"
        class="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-md"
      />
      <Button
        variant="icon"
        size="sm"
        :icon="PencilSquareIcon"
        @click.stop="handleEdit"
        aria-label="Edit LLM"
        class="bg-gray-100 hover:bg-gray-200 rounded-md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  PauseIcon,
  PlayIcon,
  ArchiveBoxIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import Button from "../ui/Button.vue";
import type { LLMResource } from "../../types/types";

interface Props {
  llm: LLMResource;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "toggleActive", llm: LLMResource): void;
  (e: "archive", llm: LLMResource): void;
  (e: "edit", llm: LLMResource): void;
}>();

const isActive = computed(() => "active" in props.llm && props.llm.active);

const handleToggleActive = () => {
  emit("toggleActive", props.llm);
};

const handleArchive = () => {
  emit("archive", props.llm);
};

const handleEdit = () => {
  emit("edit", props.llm);
};
</script>
