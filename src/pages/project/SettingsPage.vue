<!-- SettingsPage.vue -->
<template>
  <div class="py-12">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
      Project Settings
    </h2>

    <!-- Simple theme toggle as placeholder -->
    <div class="flex items-center justify-center gap-4 mb-8">
      <span class="text-gray-600 dark:text-gray-300">Theme Preference</span>
      <Button
        @click="toggleDark()"
        variant="secondary"
        :text="`${isDark ? 'Dark' : 'Light'} Mode`"
      />
    </div>

    <p class="text-gray-500 dark:text-gray-400 text-center">
      Additional project configuration and settings coming soon...
    </p>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
