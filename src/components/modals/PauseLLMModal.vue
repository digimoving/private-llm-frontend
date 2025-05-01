<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    :primary-button="{
      text: isPaused ? 'Resume Resource' : 'Pause Resource',
      variant: 'danger',
      loading: llmsStore.loading.pause,
    }"
    @primary-click="handleAction"
    @secondary-click="$emit('update:model-value', false)"
  >
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">
        {{ isPaused ? "Resume" : "Pause" }} LLM Resource
      </h3>
      <p class="text-sm text-gray-600">
        Are you sure you want to {{ isPaused ? "resume" : "pause" }} this LLM
        resource?
        <template v-if="!isPaused">
          While paused:
          <ul class="list-disc pl-5 text-sm text-gray-600 space-y-2 mt-2">
            <li>The model will stop processing new requests</li>
            <li>Existing data and configurations will be preserved</li>
            <li>No compute resources will be used (cost saving)</li>
          </ul>
          <p class="mt-2">
            You can unpause the resource at any time to resume operations.
          </p>
        </template>
        <template v-else>
          When resumed:
          <ul class="list-disc pl-5 text-sm text-gray-600 space-y-2 mt-2">
            <li>The model will start processing new requests</li>
            <li>Compute resources will be allocated</li>
            <li>You can pause the resource again at any time</li>
          </ul>
        </template>
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "../ui/Modal.vue";
import { useLLMsStore } from "../../stores/llms";

interface Props {
  modelValue: boolean;
  llmId: string;
  isPaused: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:model-value": [value: boolean];
  "state-changed": [id: string];
}>();

const llmsStore = useLLMsStore();

const handleAction = async () => {
  try {
    if (props.isPaused) {
      await llmsStore.resumeLLM(props.llmId);
    } else {
      await llmsStore.pauseLLM(props.llmId);
    }
    emit("state-changed", props.llmId);
    emit("update:model-value", false);
  } catch (error) {
    console.error(
      `Failed to ${props.isPaused ? "resume" : "pause"} LLM:`,
      error
    );
  }
};
</script>
