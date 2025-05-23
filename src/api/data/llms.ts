import type { LLMResource } from "../../types/types";

export const llms: LLMResource[] = [
  {
    id: "1",
    projectId: "1",
    name: "Customer Support Assistant",
    type: "gpt-4",
    description:
      "Handles customer inquiries and support tickets with advanced context understanding",
    maxTokens: 4096,
    temperature: 0.7,
    tags: ["support", "customer-service"],
    trainingFiles: ["support-guidelines.pdf"],
    archived: false,
    paused: false,
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-04-01T15:30:00Z",
  },
  {
    id: "2",
    projectId: "1",
    name: "Product Recommendation Engine",
    type: "gpt-3.5-turbo",
    description:
      "Analyses user preferences to provide personalised product recommendations",
    maxTokens: 2048,
    temperature: 0.5,
    tags: ["recommendations", "e-commerce"],
    trainingFiles: ["product-catalog.json"],
    archived: false,
    paused: true,
    createdAt: "2024-03-10T09:00:00Z",
    updatedAt: "2024-03-28T11:20:00Z",
  },
  {
    id: "3",
    projectId: "2",
    name: "Content Moderator",
    type: "gpt-4",
    description:
      "Automated content moderation system for user-generated content",
    maxTokens: 8192,
    temperature: 0.3,
    tags: ["moderation", "content", "safety"],
    trainingFiles: ["moderation-rules.pdf", "content-guidelines.md"],
    archived: true,
    paused: false,
    createdAt: "2024-02-20T14:00:00Z",
    updatedAt: "2024-03-25T16:45:00Z",
  },
  {
    id: "4",
    projectId: "1",
    name: "Code Review Assistant",
    type: "gpt-4",
    description: "Analyses pull requests and provides code review suggestions",
    maxTokens: 16384,
    temperature: 0.4,
    tags: ["development", "code-review"],
    trainingFiles: ["coding-standards.md"],
    archived: false,
    paused: false,
    createdAt: "2024-03-20T08:00:00Z",
    updatedAt: "2024-04-02T09:15:00Z",
  },
  // Adding more dummy LLMs for testing
  {
    id: "5",
    projectId: "3",
    name: "Marketing Copy Generator",
    type: "gpt-4",
    description: "Generates engaging marketing copy and social media content",
    maxTokens: 4096,
    temperature: 0.8,
    tags: ["marketing", "content-creation"],
    trainingFiles: ["brand-guidelines.pdf"],
    archived: false,
    paused: false,
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-03-20T14:30:00Z",
  },
  {
    id: "6",
    projectId: "3",
    name: "Data Analysis Assistant",
    type: "gpt-4",
    description: "Helps analyse and interpret complex data sets",
    maxTokens: 8192,
    temperature: 0.2,
    tags: ["analytics", "data-science"],
    trainingFiles: ["analysis-templates.ipynb"],
    archived: false,
    paused: true,
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-03-15T16:45:00Z",
  },
  {
    id: "7",
    projectId: "2",
    name: "Email Response Generator",
    type: "gpt-3.5-turbo",
    description: "Drafts professional email responses based on context",
    maxTokens: 2048,
    temperature: 0.6,
    tags: ["communication", "email"],
    trainingFiles: ["email-templates.md"],
    archived: true,
    paused: false,
    createdAt: "2024-01-25T11:00:00Z",
    updatedAt: "2024-03-10T09:20:00Z",
  },
];
