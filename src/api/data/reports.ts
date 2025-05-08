export const mockReports = Array.from({ length: 30 }, (_, i) => {
  const idx = i + 1;
  return {
    id: `report_${idx}`,
    name: `Report ${idx}`,
    date: `2024-04-${((idx % 30) + 1).toString().padStart(2, "0")}`,
    models:
      idx % 2 === 0
        ? ["Support Agent"]
        : ["Content Generator", "Support Agent"],
    metrics: idx % 2 === 0 ? "Tokens, Latency" : "Tokens, Status, Latency",
    format: idx % 3 === 0 ? "PDF" : idx % 3 === 1 ? "CSV" : "XLSX",
    timeRange: `2024-04-01 to 2024-04-${((idx % 30) + 1).toString().padStart(2, "0")}`,
  };
});
