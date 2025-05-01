<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="mx-5 px-4 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- Back Button -->
        <Button
          variant="icon"
          :icon="ArrowLeftIcon"
          @click="$router.push('/projects')"
          aria-label="Back to Projects"
        />

        <!-- Project Title with Edit -->
        <div class="flex items-center">
          <div class="flex items-center">
            <div
              v-if="isLoading"
              class="h-[18px] w-48 bg-gray-200 rounded-lg animate-pulse"
            ></div>
            <h1
              v-else-if="!isEditing"
              class="text-xl font-semibold"
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
              class="ml-2"
              aria-label="Edit Project Name"
            />
          </div>
          <div v-if="isEditing" class="flex items-center">
            <Input
              ref="titleInput"
              v-model="editedTitle"
              class="font-semibold text-gray-900"
              @blur="saveTitle"
              @keyup.esc="cancelEditing"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <Button
          v-if="projectStore.currentProject?.archived"
          variant="secondary"
          @click="toggleArchived"
          :loading="isTogglingArchived"
          :text="
            projectStore.currentProject?.archived
              ? 'Unarchive Project'
              : 'Archive Project'
          "
        />
        <!-- <Button
          v-else
          variant="secondary"
          @click="handleArchiveClick"
          text="Archive Project"
        /> -->
        <Button
          v-if="projectStore.currentProject?.archived"
          variant="danger"
          @click="$emit('delete')"
          text="Delete Project"
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
