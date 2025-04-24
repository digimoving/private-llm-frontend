import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    component: () => import("../pages/projects/ProjectListPage.vue"),
  },
  {
    path: "/projects",
    component: () => import("../pages/projects/ProjectListPage.vue"),
  },
  {
    path: "/style-guide",
    component: () => import("../pages/misc/StyleGuide.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
