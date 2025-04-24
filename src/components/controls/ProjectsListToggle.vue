<template>
  <div
    class="flex h-8 items-center rounded-lg border border-gray-200 bg-gray-100"
  >
    <button
      type="button"
      @click="enabled = false"
      :class="[
        !enabled ? 'bg-white shadow-sm' : 'hover:bg-gray-200',
        'flex h-full items-center justify-center rounded-l-lg px-2.5 transition-colors duration-200',
      ]"
    >
      <Squares2X2Icon class="size-5 text-gray-700" />
      <span class="sr-only">Grid view</span>
    </button>
    <button
      type="button"
      @click="enabled = true"
      :class="[
        enabled ? 'bg-white shadow-sm' : 'hover:bg-gray-200',
        'flex h-full items-center justify-center rounded-r-lg px-2.5 transition-colors duration-200',
      ]"
    >
      <ListBulletIcon class="size-5 text-gray-700" />
      <span class="sr-only">List view</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const enabled = ref(props.modelValue);

watch(enabled, (value) => {
  emit("update:modelValue", value);
});

watch(
  () => props.modelValue,
  (value) => {
    enabled.value = value;
  }
);
</script>
