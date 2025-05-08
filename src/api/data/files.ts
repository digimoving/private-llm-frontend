const fileTypes = ["json", "csv", "txt", "pdf", "png"];

export const mockFiles = Array.from({ length: 30 }, (_, i) => {
  const idx = i + 1;
  const type = fileTypes[i % fileTypes.length].toUpperCase();
  return {
    id: `file_${idx}`,
    name: `Document_${idx}.${type}`,
    type,
    size: (10 * (idx + 1)).toString() + "MB",
    uploadDate: `2024-04-${((idx % 30) + 1).toString().padStart(2, "0")}`,
    tags: idx % 2 === 0 ? ["project", "important"] : ["archive"],
  };
});
