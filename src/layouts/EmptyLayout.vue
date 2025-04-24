<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Page header -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900">{{ title }}</h1>
          <p v-if="subtitle" class="mt-2 text-sm text-gray-700">
            {{ subtitle }}
          </p>
        </div>

        <!-- Page content -->
        <div class="min-h-[calc(100vh-16rem)]">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
  }>(),
  {
    subtitle: "",
  }
);
</script>
