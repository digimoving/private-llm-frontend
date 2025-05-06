import type { MetricsOverview } from "../../types/types";

export const mockMetrics: MetricsOverview = {
  summary: {
    totalRequests: 1140,
    avgRequestsPerDay: 163,
    totalTokens: 408000,
    estimatedCost: 0.97,
  },
  timeSeries: [
    { date: "2024-06-01", requests: 150, tokens: 52000 },
    { date: "2024-06-02", requests: 170, tokens: 61000 },
    { date: "2024-06-03", requests: 160, tokens: 59000 },
    { date: "2024-06-04", requests: 180, tokens: 65000 },
    { date: "2024-06-05", requests: 140, tokens: 48000 },
    { date: "2024-06-06", requests: 170, tokens: 62000 },
    { date: "2024-06-07", requests: 170, tokens: 66000 },
  ],
  tags: ["support", "marketing", "content", "customer", "analysis"],
};
