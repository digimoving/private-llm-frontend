export interface Project {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  lastUpdated: string;
  archived: boolean;
  tags: string[];
}

export const projects: Project[] = [
  {
    id: "proj_01",
    name: "Customer Support Bot",
    description:
      "An AI-powered chatbot trained on our product documentation and support tickets to provide instant customer assistance.",
    dateCreated: "2024-02-15T09:00:00Z",
    lastUpdated: "2024-03-18T14:30:00Z",
    archived: false,
    tags: ["production", "customer-service", "gpt-4"],
  },
  {
    id: "proj_02",
    name: "Code Review Assistant",
    description:
      "ML model that analyzes pull requests and suggests improvements based on our team's best practices.",
    dateCreated: "2024-01-20T10:15:00Z",
    lastUpdated: "2024-03-19T11:45:00Z",
    archived: false,
    tags: ["development", "internal-tools", "code-quality"],
  },
  {
    id: "proj_03",
    name: "Sales Call Analyzer",
    description:
      "Speech-to-text model with sentiment analysis for automatically extracting insights from sales calls.",
    dateCreated: "2023-11-05T16:20:00Z",
    lastUpdated: "2024-02-28T09:15:00Z",
    archived: true,
    tags: ["sales", "analytics", "archived"],
  },
  {
    id: "proj_04",
    name: "Document Classifier",
    description:
      "Fine-tuned language model for automatically categorizing and routing incoming support documents.",
    dateCreated: "2024-03-01T08:45:00Z",
    lastUpdated: "2024-03-20T16:00:00Z",
    archived: false,
    tags: ["machine-learning", "documentation", "beta"],
  },
  {
    id: "proj_05",
    name: "Image Generation API",
    description:
      "Custom stable diffusion model trained on our brand guidelines for consistent marketing visuals.",
    dateCreated: "2024-02-10T13:30:00Z",
    lastUpdated: "2024-03-15T10:20:00Z",
    archived: false,
    tags: ["marketing", "stable-diffusion", "api"],
  },
  {
    id: "proj_06",
    name: "Legacy Data Processor",
    description:
      "Data transformation pipeline for converting historical customer data to the new schema.",
    dateCreated: "2023-09-15T11:00:00Z",
    lastUpdated: "2023-12-20T15:45:00Z",
    archived: true,
    tags: ["data-migration", "internal-tools", "archived"],
  },
  {
    id: "proj_07",
    name: "Recommendation Engine",
    description:
      "Personalized product recommendation system based on user behavior and preferences.",
    dateCreated: "2024-03-10T09:30:00Z",
    lastUpdated: "2024-03-21T13:15:00Z",
    archived: false,
    tags: ["machine-learning", "e-commerce", "beta"],
  },
  {
    id: "proj_08",
    name: "Email Summarizer",
    description:
      "AI model that generates concise summaries of long email threads for quick understanding.",
    dateCreated: "2024-01-05T14:20:00Z",
    lastUpdated: "2024-03-17T11:30:00Z",
    archived: false,
    tags: ["productivity", "internal-tools", "gpt-4"],
  },
  {
    id: "proj_09",
    name: "Bug Prediction Model",
    description:
      "Machine learning model that identifies code patterns likely to cause issues in production.",
    dateCreated: "2023-12-01T10:45:00Z",
    lastUpdated: "2024-02-25T16:20:00Z",
    archived: false,
    tags: ["development", "machine-learning", "code-quality"],
  },
  {
    id: "proj_10",
    name: "Translation Service",
    description:
      "Custom machine translation model optimized for technical documentation and UI strings.",
    dateCreated: "2023-10-20T15:15:00Z",
    lastUpdated: "2024-01-15T09:45:00Z",
    archived: true,
    tags: ["localization", "machine-learning", "archived"],
  },
];
