import type { File } from "../../types/files";

export const mockFiles: File[] = [
  {
    id: "1",
    name: "training-data.json",
    type: "JSON",
    size: "1.95 MB",
    uploadDate: "2025-04-01",
    tags: ["training"],
    url: "/files/training-data.json",
  },
  {
    id: "2",
    name: "product-catalogue.csv",
    type: "CSV",
    size: "500 KB",
    uploadDate: "2025-03-31",
    tags: ["product"],
    url: "/files/product-catalogue.csv",
  },
  {
    id: "3",
    name: "support-examples.txt",
    type: "TXT",
    size: "82.03 KB",
    uploadDate: "2025-03-31",
    tags: ["support"],
    url: "/files/support-examples.txt",
  },
  {
    id: "4",
    name: "brand-guidelines.pdf",
    type: "PDF",
    size: "3 MB",
    uploadDate: "2025-03-28",
    tags: ["brand", "guidelines"],
    url: "/files/brand-guidelines.pdf",
  },
  {
    id: "5",
    name: "company-logo.png",
    type: "PNG",
    size: "250 KB",
    uploadDate: "2025-03-28",
    tags: ["brand", "logo", "image"],
    url: "/files/company-logo.png",
  },
];
