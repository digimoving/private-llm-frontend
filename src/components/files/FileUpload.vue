<!-- FileUpload.vue -->
<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <div
      v-if="isOpen"
      class="fixed inset-x-0 bottom-0 bg-gray-100 border-t border-gray-200 rounded-t-lg"
    >
      <div class="px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Upload Files</h2>
          <Button
            :icon="XMarkIcon"
            variant="secondary"
            @click="$emit('close')"
          />
        </div>
        <p class="text-sm text-gray-600 mb-4">
          Drag and drop or click to browse.
        </p>
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-12"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
          @click="fileInput?.click()"
        >
          <div class="text-center">
            <ArrowUpTrayIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-semibold text-gray-900">
              Drag files here or click to upload
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Support for JSON, CVS, TXT, PDF, images and more
            </p>
          </div>
        </div>
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "../ui/Button.vue";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/vue/24/outline";

interface Props {
  isOpen: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "upload", files: FileList): void;
}>();

const fileInput = ref<HTMLInputElement>();

const handleFileDrop = (event: DragEvent) => {
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles) {
    emit("upload", droppedFiles);
  }
};

const handleFileSelect = (event: Event) => {
  const selectedFiles = (event.target as HTMLInputElement).files;
  if (selectedFiles) {
    emit("upload", selectedFiles);
  }
};
</script>
