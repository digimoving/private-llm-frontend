<template>
  <div
    class="animate-pulse bg-gray-200 rounded-md"
    :class="[width, height, customClass]"
  ></div>
</template>

<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
  customClass?: string;
}

withDefaults(defineProps<Props>(), {
  width: "w-full",
  height: "h-4",
  customClass: "",
});
</script>
