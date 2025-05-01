<template>
  <div
    class="flex h-8 items-center rounded-lg border border-gray-200 bg-gray-100"
  >
    <Button
      variant="flat"
      size="sm"
      :icon="Squares2X2Icon"
      @click="enabled = false"
      :class="[
        !enabled ? 'bg-white shadow-sm' : 'hover:bg-gray-200',
        'h-full rounded-l-lg px-2.5',
        disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : '',
      ]"
      :disabled="disabled"
      aria-label="Grid view"
    />
    <Button
      variant="flat"
      size="sm"
      :icon="ListBulletIcon"
      @click="enabled = true"
      :class="[
        enabled ? 'bg-white shadow-sm' : 'hover:bg-gray-200',
        'h-full rounded-r-lg px-2.5',
        disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : '',
      ]"
      :disabled="disabled"
      aria-label="List view"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/vue/24/outline";
import Button from "../../components/ui/Button.vue";

const props = defineProps<{
  modelValue: boolean;
  disabled?: boolean;
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
