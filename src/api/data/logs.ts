export const mockLogs = Array.from({ length: 30 }, (_, i) => {
  const idx = i + 1;
  return {
    time: `10:${(46 + idx).toString().padStart(2, "0")}:35 16 Apr`,
    requestId: `req_${idx}`,
    model: idx % 2 === 0 ? "Support Agent" : "Content Generator",
    user: `user_${100 + idx}`,
    tokens: 500 + idx * 10,
    latency: `${(Math.random() * 4 + 1).toFixed(2)}s`,
    status: ["success", "pending", "error"][idx % 3],
    prompt:
      idx % 3 === 0
        ? "Summarise the key points of this technical documentation..."
        : idx % 3 === 1
          ? "Translate this customer feedback from Spanish to English"
          : "Generate a customer support response for a billing inquiry",
  };
});
