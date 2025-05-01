<template>
  <div class="min-h-screen bg-gray-50">
    <AppNav />
    <main class="py-8">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-3">
          <h1 class="text-2xl font-semibold text-gray-900">
            {{ route.meta.title }}
          </h1>
          <p v-if="route.meta.subtitle" class="mt-2 text-md text-gray-700">
            {{ route.meta.subtitle }}
          </p>
        </div>
        <div class="min-h-[calc(100vh-16rem)]">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNav from "../components/layout/AppNav.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>
