import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import ProjectLayout from "../layouts/ProjectLayout.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "projects",
        name: "projects",
        component: () => import("../pages/projects/ProjectsPage.vue"),
        meta: {
          title: "Projects",
          subtitle: "Manage your private AI models and projects.",
        },
      },
      {
        path: "notifications",
        name: "notifications",
        component: () => import("../pages/notifications/NotificationsPage.vue"),
        meta: {
          title: "Notifications",
        },
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
        meta: {
          title: "LLM Resources",
        },
      },
      // {
      //   path: "metrics",
      //   name: "project-metrics",
      //   component: () => import("../pages/project/MetricsPage.vue"),
      //   meta: {
      //     title: "Usage Metrics",
      //   },
      // },
      // {
      //   path: "files",
      //   name: "project-files",
      //   component: () => import("../pages/project/FilesPage.vue"),
      //   meta: {
      //     title: "Project Files",
      //   },
      // },
      // {
      //   path: "settings",
      //   name: "project-settings",
      //   component: () => import("../pages/project/SettingsPage.vue"),
      //   meta: {
      //     title: "Project Settings",
      //   },
      // },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
