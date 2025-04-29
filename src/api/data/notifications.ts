import type { Notification } from "../../types/types";

export const notifications: Notification[] = [
  {
    id: "1",
    title: "Your model 'Customer Service Bot' has finished training",
    message: "The model has completed training and is ready for deployment",
    timestamp: new Date("2025-04-14T10:33:00").toISOString(),
    read: false,
    type: "training",
  },
  {
    id: "2",
    title: "Your model 'Product Recommender' has finished training",
    message: "The model has completed training and is ready for testing",
    timestamp: new Date("2025-04-13T13:23:00").toISOString(),
    read: false,
    type: "training",
  },
  {
    id: "3",
    title: "System maintenance scheduled for April 16th 2025",
    message: "Scheduled maintenance will occur from 2 AM to 4 AM UTC",
    timestamp: new Date("2025-04-12T08:30:00").toISOString(),
    read: true,
    type: "system",
  },
  {
    id: "4",
    title: "Your subscription will renew in 3 days",
    message: "Your subscription will automatically renew on April 14th, 2025",
    timestamp: new Date("2025-04-11T17:10:00").toISOString(),
    read: true,
    type: "alerts",
  },
  {
    id: "5",
    title: "Your report 'April LLM Reporting' is now ready to download",
    message: "Monthly usage report for your LLM resources is available",
    timestamp: new Date("2025-04-10T12:57:00").toISOString(),
    read: true,
    type: "reports",
  },
];
