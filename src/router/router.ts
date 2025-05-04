// Router configuration
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import ProjectLayout from "../layouts/ProjectLayout.vue";
import { dashboardMetadata, projectMetadata } from "./metadata";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "projects",
        name: "projects",
        component: () => import("../pages/projects/ProjectsPage.vue"),
        meta: dashboardMetadata.projects,
      },
      {
        path: "notifications",
        name: "notifications",
        component: () => import("../pages/notifications/NotificationsPage.vue"),
        meta: dashboardMetadata.notifications,
      },
    ],
  },
  {
    path: "/projects/:projectId",
    component: ProjectLayout,
    children: [
      {
        path: "",
        redirect: { name: "project-llms" },
      },
      {
        path: "llms",
        name: "project-llms",
        component: () => import("../pages/project/LLMResourcesPage.vue"),
        meta: projectMetadata["project-llms"],
      },
      {
        path: "metrics",
        component: () => import("../pages/project/MetricsPage.vue"),
        meta: projectMetadata["project-metrics"],
        children: [
          {
            path: "",
            name: "project-metrics",
            redirect: { name: "metrics-overview" },
          },
          {
            path: "overview",
            name: "metrics-overview",
            component: () =>
              import("../pages/project/metrics/OverviewPage.vue"),
          },
          {
            path: "reporting",
            name: "metrics-reporting",
            component: () =>
              import("../pages/project/metrics/ReportingPage.vue"),
          },
          {
            path: "logs",
            name: "metrics-logs",
            component: () => import("../pages/project/metrics/LogsPage.vue"),
          },
        ],
      },
      {
        path: "files",
        name: "project-files",
        component: () => import("../pages/project/FilesPage.vue"),
        meta: projectMetadata["project-files"],
      },
      {
        path: "settings",
        name: "project-settings",
        component: () => import("../pages/project/SettingsPage.vue"),
        meta: projectMetadata["project-settings"],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
