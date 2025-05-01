<template>
  <Card
    class="group w-full transition-all duration-200 bg-white border border-dashed"
    :class="{
      'p-8 h-[250px]': !showAsList,
      'p-4 h-[72px]': showAsList,
      'border-gray-400 hover:border-gray-500 hover:shadow-md cursor-pointer':
        !disabled,
      'border-gray-300 opacity-50 cursor-not-allowed': disabled,
    }"
    @click="!disabled && $emit('click')"
  >
    <template v-if="showAsList">
      <div class="flex items-center gap-3 h-full">
        <PlusIcon :disabled="disabled" size="sm" />
        <span class="text-gray-700 font-medium"
          >Add {{ resourceType === "project" ? "Project" : "LLM" }}</span
        >
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center justify-center h-full text-center">
        <PlusIcon :disabled="disabled" size="md" />
        <div class="text-gray-900 font-medium mt-2">
          Add {{ resourceType === "project" ? "Project" : "LLM" }}
        </div>
        <div class="mt-1 text-sm text-gray-500">
          Create a new
          {{ resourceType === "project" ? "AI model project" : "LLM model" }}
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "../ui/Card.vue";
import PlusIcon from "../global/PlusIcon.vue";
import { useProjectsStore } from "../../stores/projects";
import { computed } from "vue";

const projectsStore = useProjectsStore();

const props = withDefaults(
  defineProps<{
    showAsList?: boolean;
    resourceType: "project" | "llm";
  }>(),
  {
    showAsList: false,
  }
);

const disabled = computed(() => {
  if (props.resourceType === "llm") {
    return projectsStore.currentProject?.archived || false;
  }
  return false;
});

defineEmits<{
  (e: "click"): void;
}>();
</script>
