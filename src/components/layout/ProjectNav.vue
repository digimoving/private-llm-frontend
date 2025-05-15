<template>
  <nav class="bg-white border-b border-gray-200">
    <div
      class="mx-2 sm:mx-5 px-2 sm:px-4 h-auto min-h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-2 sm:py-0"
    >
      <div class="w-full my-3 sm:w-auto">
        <div class="flex items-center min-w-0 w-full gap-2">
          <!-- Back Button -->
          <Button
            variant="icon"
            :icon="ArrowLeftIcon"
            @click="$router.push('/projects')"
            aria-label="Back to Projects"
            class="flex-shrink-0"
          />
          <!-- Project Title -->
          <template v-if="!isEditing">
            <h1
              class="text-lg sm:text-xl font-semibold truncate flex-1 min-w-0"
              :class="[
                projectStore.currentProject?.archived
                  ? 'text-gray-500'
                  : 'text-gray-900',
              ]"
            >
              {{ projectStore.currentProject?.name }}
            </h1>
            <StatusChip
              v-if="projectStore.currentProject?.archived"
              status="archived"
              class="ml-2"
              size="sm"
            />
            <Button
              v-else
              variant="icon"
              :icon="PencilSquareIcon"
              @click="startEditing"
              class="ml-2 flex-shrink-0"
              aria-label="Edit Project Name"
            />
          </template>
          <!-- Editing Input -->
          <Input
            v-if="isEditing"
            ref="titleInput"
            v-model="editedTitle"
            class="font-semibold text-gray-900 flex-1 min-w-0"
            @blur="saveTitle"
            @keyup.esc="cancelEditing"
            @keyup.enter="saveTitle"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          variant="secondary"
          @click="toggleArchived"
          :loading="isTogglingArchived"
          :text="
            projectStore.currentProject?.archived
              ? 'Unarchive Project'
              : 'Archive Project'
          "
          class="text-red-700 border border-red-200 hover:bg-red-100"
        />
        <Button
          v-if="projectStore.currentProject?.archived"
          variant="danger"
          @click="$emit('delete')"
          text="Delete Project"
          class="w-full sm:w-auto"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { useProjectsStore } from "../../stores/projects";
import { ArrowLeftIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import Button from "../ui/Button.vue";
import Input from "../ui/Input.vue";
import StatusChip from "../global/StatusChip.vue";

const router = useRouter();
const projectStore = useProjectsStore();

const isEditing = ref(false);
const editedTitle = ref("");
const titleInput = ref<{ focus: () => void }>();
const isTogglingArchived = ref(false);
const isLoading = computed(() => projectStore.loading.project);

const emit = defineEmits<{
  (e: "archive"): void;
  (e: "delete"): void;
}>();

const startEditing = () => {
  if (projectStore.currentProject?.archived) return;
  editedTitle.value = projectStore.currentProject?.name || "";
  isEditing.value = true;
  nextTick(() => {
    titleInput.value?.focus();
  });
};

const saveTitle = async () => {
  if (
    projectStore.currentProject &&
    editedTitle.value.trim() &&
    editedTitle.value !== projectStore.currentProject.name
  ) {
    await projectStore.updateProject(projectStore.currentProject.id, {
      name: editedTitle.value.trim(),
    });
  }
  isEditing.value = false;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const toggleArchived = async () => {
  if (projectStore.currentProject?.archived) {
    if (!projectStore.currentProject) return;

    isTogglingArchived.value = true;
    try {
      await projectStore.updateProject(projectStore.currentProject.id, {
        archived: false,
      });
    } finally {
      isTogglingArchived.value = false;
    }
  } else {
    emit("archive");
  }
};
</script>
