<!-- MetricsPage.vue -->
<template>
  <div>
    <form @submit.prevent="saveSettings">
      <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div class="mb-6">
          <Input
            v-model="form.name"
            label="Project name"
            placeholder="Project name"
            :disabled="loading"
            class="mb-4"
          />
          <Input
            v-model="form.description"
            label="Description"
            type="textarea"
            placeholder="Describe your project..."
            :rows="2"
            :disabled="loading"
          />
        </div>
        <div class="border-t my-6" />
        <div class="space-y-6">
          <Toggle
            v-model="form.apiAccess"
            label="API Access"
            description="Enable API access to this project"
            :disabled="loading"
          />
          <Toggle
            v-model="form.requestLogging"
            label="Request Logging"
            description="Log all requests for analysis"
            :disabled="loading"
          />
          <Toggle
            v-model="form.autoScaling"
            label="Auto-scaling"
            description="Automatically scale resources based on usage"
            :disabled="loading"
          />
          <Toggle
            v-model="form.cacheResults"
            label="Cache results"
            description="Cache responses for similar requests"
            :disabled="loading"
          />
        </div>
        <div class="flex justify-end mt-8">
          <Button
            type="submit"
            :loading="loading"
            :disabled="loading"
            variant="primary"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectsStore } from "../../stores/projects";
import Input from "../../components/ui/Input.vue";
import Toggle from "../../components/ui/Toggle.vue";
import Button from "../../components/ui/Button.vue";

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();

const loading = ref(false);

const currentProject = computed(() => projectsStore.currentProject);

const form = ref({
  name: "",
  description: "",
  apiAccess: false,
  requestLogging: false,
  autoScaling: false,
  cacheResults: false,
});

watch(
  currentProject,
  (project) => {
    if (project) {
      form.value = {
        name: project.name || "",
        description: project.description || "",
        apiAccess: project.apiAccess ?? false,
        requestLogging: project.requestLogging ?? false,
        autoScaling: project.autoScaling ?? false,
        cacheResults: project.cacheResults ?? false,
      };
    }
  },
  { immediate: true }
);

const saveSettings = async () => {
  if (!currentProject.value) return;
  loading.value = true;
  try {
    await projectsStore.updateProject(currentProject.value.id, {
      name: form.value.name,
      description: form.value.description,
      apiAccess: form.value.apiAccess,
      requestLogging: form.value.requestLogging,
      autoScaling: form.value.autoScaling,
      cacheResults: form.value.cacheResults,
    });
  } finally {
    loading.value = false;
  }
};

const archiveProject = () => {
  router.push({ name: "project-settings" });
  // Actual archive logic is handled in the ProjectLayout modal
};
</script>
