<!-- MetricsPage.vue -->
<template>
  <div>
    <MetricsTabs />
    <!-- Nested Route Content -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import MetricsTabs from "../../components/metrics/MetricsTabs.vue";
</script>
