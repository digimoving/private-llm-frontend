<template>
    <div>
      <AppNav />
  
      <main class="p-6">
        <h1 class="text-2xl font-bold mb-4">Projects</h1>
        <!-- Filters, sort, view mode toggles go here -->
  
        <!-- Project list or grid will be conditionally rendered -->
        <ProjectsList />
        <!-- or -->
        <!-- <ProjectsGrid /> -->
      </main>
    </div>
  </template>
  <script setup lang="ts">
  import AppNav from '../../components/layout/AppNav.vue'
  import ProjectsList from '../../components/projects/ProjectsList.vue'
  // import ProjectsGrid from '@/components/projects/ProjectsGrid.vue'
  </script>
  <style scoped>
  /* You can add page-specific styles here */
  </style>
  