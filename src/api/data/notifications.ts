import type { Notification } from "../../stores/notifications";

export const notifications: Notification[] = [
  {
    id: "1",
    title: "Your model 'Customer Service Bot' has finished training",
    timestamp: new Date("2025-04-14T10:33:00"),
    read: false,
    type: "training",
  },
  {
    id: "2",
    title: "Your model 'Product Recommender' has finished training",
    timestamp: new Date("2025-04-13T13:23:00"),
    read: false,
    type: "training",
  },
  {
    id: "3",
    title: "System maintenance scheduled for April 16th 2025",
    timestamp: new Date("2025-04-12T08:30:00"),
    read: true,
    type: "system",
  },
  {
    id: "4",
    title: "Your subscription will renew in 3 days",
    timestamp: new Date("2025-04-11T17:10:00"),
    read: true,
    type: "alerts",
  },
  {
    id: "5",
    title: "Your report 'April LLM Reporting' is now ready to download",
    timestamp: new Date("2025-04-10T12:57:00"),
    read: true,
    type: "reports",
  },
];
