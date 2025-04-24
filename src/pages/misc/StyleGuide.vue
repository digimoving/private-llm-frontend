<template>
  <div class="p-10 bg-light min-h-screen">
    <h1 class="text-3xl font-bold">Style Guide</h1>
    <div class="mb-8">
      All colours follow the Tailwind shade scale of -50 to -950, with -500
      being the default.
    </div>

    <div v-for="group in colorGroups" :key="group.name" class="mb-12">
      <h2 class="text-lg font-semibold text-gray-500 mb-4">{{ group.name }}</h2>
      <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
        <div
          v-for="color in group.colors"
          :key="color.name"
          class="flex flex-col items-center gap-1"
        >
          <div
            :class="[color.class, 'aspect-square w-full rounded shadow mb-2']"
          />
          <p class="text-sm font-semibold">{{ color.name }}</p>
          <p class="text-xs text-gray-600">{{ color.class }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorGroups = [
  {
    name: "Brand Colours",
    colors: [
      { name: "Primary", class: "bg-primary-500" },
      { name: "Secondary", class: "bg-secondary-500" },
    ],
  },
  {
    name: "State Colours",
    colors: [
      { name: "Info", class: "bg-info-500" },
      { name: "Success", class: "bg-success-500" },
      { name: "Warning", class: "bg-warning-500" },
      { name: "Error", class: "bg-error-500" },
    ],
  },
];
</script>
