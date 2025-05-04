import type { Project } from "../../types/types";

export const projects: Project[] = [
  {
    id: "1",
    name: "Customer Service Bot",
    description: "AI-powered customer service chatbot",
    archived: false,
    createdAt: "2025-04-01T10:00:00Z",
    lastUpdated: "2025-04-14T15:30:00Z",
    tags: ["customer-service", "chatbot"],
  },
  {
    id: "2",
    name: "Product Recommender",
    description: "Personalised product recommendations engine",
    archived: false,
    createdAt: "2025-03-15T09:00:00Z",
    lastUpdated: "2025-04-13T11:20:00Z",
    tags: ["recommendations", "e-commerce"],
  },
  {
    id: "3",
    name: "Content Moderator",
    description: "Automated content moderation system",
    archived: true,
    createdAt: "2025-02-28T14:00:00Z",
    lastUpdated: "2025-04-10T16:45:00Z",
    tags: ["moderation", "content"],
  },
];
