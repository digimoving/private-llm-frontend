<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Overview</h2>
      <p class="mt-1 text-sm text-gray-500">
        High-level metrics and key performance indicators.
      </p>
    </div>

    <div v-if="metricsStore.loading" class="text-center py-12">
      <LoadingSpinner size="lg" class="mx-auto mb-2" />
    </div>
    <div v-else-if="metricsStore.error" class="text-center py-12">
      <span class="text-red-500">{{ metricsStore.error }}</span>
    </div>
    <div v-else-if="metricsStore.overview" class="space-y-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          v-for="card in summaryCards"
          :key="card.key"
          class="p-6 text-center bg-white"
        >
          <div class="text-3xl font-bold">
            <span v-if="card.prefix">{{ card.prefix }}</span
            >{{ card.value }}
          </div>
          <div class="text-gray-500 mt-1">{{ card.label }}</div>
        </Card>
      </div>

      <div>
        <div class="flex flex-wrap gap-2 items-center mt-2">
          <span class="text-sm text-gray-600">Filter by tags:</span>
          <Chip
            v-for="tag in metricsStore.overview.tags"
            :key="tag"
            :text="tag"
            size="xs"
            :class="[
              'bg-gray-100 text-gray-700 font-medium cursor-pointer hover:bg-gray-200',
              selectedTag === tag ? 'ring-2 ring-primary-500' : '',
            ]"
            @click="handleTagClick(tag)"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border rounded-lg p-4 bg-white">
          <div class="font-semibold mb-2">Requests over time</div>
          <template v-if="chartsLoading">
            <BasicSkeletonLoader
              width="w-full"
              height="h-[220px]"
              class="my-2"
            />
          </template>
          <template v-else>
            <Bar
              :data="requestsChartData"
              :options="barChartOptions('Number of API requests per day')"
              height="220"
            />
          </template>
        </div>
        <div class="border rounded-lg p-4 bg-white">
          <div class="font-semibold mb-2">Token Usage</div>
          <template v-if="chartsLoading">
            <BasicSkeletonLoader
              width="w-full"
              height="h-[220px]"
              class="my-2"
            />
          </template>
          <template v-else>
            <Bar
              :data="tokensChartData"
              :options="barChartOptions('Number of tokens processed per day')"
              height="220"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref } from "vue";
import { useMetricsStore } from "../../../stores/metrics";
import { Bar } from "vue-chartjs";
import Card from "../../../components/ui/Card.vue";
import Chip from "../../../components/ui/Chip.vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useRoute } from "vue-router";
import { metricsApi } from "../../../api/api";
import type { MetricsOverview } from "../../../types/types";
import BasicSkeletonLoader from "../../../components/skeletons/BasicSkeletonLoader.vue";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const metricsStore = useMetricsStore();
const route = useRoute();
const selectedTag = ref<string | null>(null);
const chartsLoading = ref(false);
const filteredOverview = ref<MetricsOverview | null>(null);

const fetchWithFilter = async (useGlobalLoading = true) => {
  // Always fetch the global summary (no tag) for the cards
  if (!metricsStore.overview || useGlobalLoading) {
    await metricsStore.fetchOverview(undefined, useGlobalLoading);
  }
  // If a tag is selected, fetch filtered data for the charts only (store in a local ref)
  if (selectedTag.value) {
    chartsLoading.value = true;
    const { data } = await metricsApi.list(selectedTag.value);
    filteredOverview.value = data;
    chartsLoading.value = false;
  } else {
    filteredOverview.value = null;
  }
};

onMounted(() => {
  fetchWithFilter(true);
});

watch(
  () => route.params.projectId,
  () => {
    fetchWithFilter(true);
  }
);

const handleTagClick = async (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? null : tag;
  chartsLoading.value = true;
  await fetchWithFilter(false);
  chartsLoading.value = false;
};

const summaryCards = computed(() => {
  if (!metricsStore.overview) return [];
  return [
    {
      key: "totalRequests",
      label: "Total Requests",
      value: metricsStore.overview.summary.totalRequests.toLocaleString(),
    },
    {
      key: "avgRequestsPerDay",
      label: "Avg. Requests/Day",
      value: metricsStore.overview.summary.avgRequestsPerDay.toLocaleString(),
    },
    {
      key: "totalTokens",
      label: "Total Tokens",
      value: metricsStore.overview.summary.totalTokens.toLocaleString(),
    },
    {
      key: "estimatedCost",
      label: "Estimates Cost",
      value: metricsStore.overview.summary.estimatedCost.toFixed(2),
      prefix: "£",
    },
  ];
});

const filteredTimeSeries = computed(() => {
  if (filteredOverview.value) return filteredOverview.value.timeSeries;
  if (metricsStore.overview) return metricsStore.overview.timeSeries;
  return [] as { date: string; requests: number; tokens: number }[];
});

const requestsChartData = computed(() => {
  if (!metricsStore.overview) return { labels: [], datasets: [] };
  return {
    labels: filteredTimeSeries.value.map((d: { date: string }) => d.date),
    datasets: [
      {
        label: "Requests",
        backgroundColor: "#6366f1",
        data: filteredTimeSeries.value.map(
          (d: { requests: number }) => d.requests
        ),
      },
    ],
  };
});

const tokensChartData = computed(() => {
  if (!metricsStore.overview) return { labels: [], datasets: [] };
  return {
    labels: filteredTimeSeries.value.map((d: { date: string }) => d.date),
    datasets: [
      {
        label: "Tokens",
        backgroundColor: "#10b981",
        data: filteredTimeSeries.value.map((d: { tokens: number }) => d.tokens),
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
