<template>
  <div class="space-y-6 px-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Overview</h2>
      <p class="mt-1 text-sm text-gray-500">
        High-level metrics and key performance indicators.
      </p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <span class="text-gray-500">Loading metrics...</span>
    </div>
    <div v-else-if="error" class="text-center py-12">
      <span class="text-red-500">{{ error }}</span>
    </div>
    <div v-else-if="overview" class="space-y-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="rounded-lg border p-6 text-center">
          <div class="text-3xl font-bold">
            {{ overview.summary.totalRequests.toLocaleString() }}
          </div>
          <div class="text-gray-500 mt-1">Total Requests</div>
        </div>
        <div class="rounded-lg border p-6 text-center">
          <div class="text-3xl font-bold">
            {{ overview.summary.avgRequestsPerDay.toLocaleString() }}
          </div>
          <div class="text-gray-500 mt-1">Avg. Requests/Day</div>
        </div>
        <div class="rounded-lg border p-6 text-center">
          <div class="text-3xl font-bold">
            {{ overview.summary.totalTokens.toLocaleString() }}
          </div>
          <div class="text-gray-500 mt-1">Total Tokens</div>
        </div>
        <div class="rounded-lg border p-6 text-center">
          <div class="text-3xl font-bold">
            £{{ overview.summary.estimatedCost.toFixed(2) }}
          </div>
          <div class="text-gray-500 mt-1">Estimates Cost</div>
        </div>
      </div>

      <div>
        <div class="flex flex-wrap gap-2 items-center mt-2">
          <span class="text-sm text-gray-600">Filter by tags</span>
          <span
            v-for="tag in overview.tags"
            :key="tag"
            class="px-2 py-1 bg-gray-100 rounded text-xs"
            >{{ tag }}</span
          >
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border rounded-lg p-4 bg-white">
          <div class="font-semibold mb-2">Requests over time</div>
          <Bar
            :data="requestsChartData"
            :options="barChartOptions('Number of API requests per day')"
            height="220"
          />
        </div>
        <div class="border rounded-lg p-4 bg-white">
          <div class="font-semibold mb-2">Token Usage</div>
          <Bar
            :data="tokensChartData"
            :options="barChartOptions('Number of tokens processed per day')"
            height="220"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useMetricsStore } from "../../../stores/metrics";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const metricsStore = useMetricsStore();
const { overview, loading, error, fetchOverview } = metricsStore;

onMounted(() => {
  if (!overview) fetchOverview();
});

const requestsChartData = computed(() => {
  if (!overview) return { labels: [], datasets: [] };
  return {
    labels: overview.timeSeries.map((d) => d.date),
    datasets: [
      {
        label: "Requests",
        backgroundColor: "#6366f1",
        data: overview.timeSeries.map((d) => d.requests),
      },
    ],
  };
});

const tokensChartData = computed(() => {
  if (!overview) return { labels: [], datasets: [] };
  return {
    labels: overview.timeSeries.map((d) => d.date),
    datasets: [
      {
        label: "Tokens",
        backgroundColor: "#10b981",
        data: overview.timeSeries.map((d) => d.tokens),
      },
    ],
  };
});

function barChartOptions(yLabel: string) {
  return {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: false } },
      y: {
        title: { display: true, text: yLabel },
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };
}
</script>
