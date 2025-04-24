import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../pages/projects/ProjectsList.vue') },
  { path: '/projects', component: () => import('../pages/projects/ProjectsList.vue') },
  {
    path: '/projects/:id',
    component: () => import('../pages/projects/ProjectView.vue'),
    children: [
      { path: '', redirect: 'llms' },
      { path: 'llms', component: () => import('../pages/projects/ProjectLLMs.vue') },
      { path: 'reports', component: () => import('../pages/projects/ProjectReports.vue') },
      { path: 'metrics', component: () => import('../pages/projects/ProjectMetrics.vue') },
      { path: 'settings', component: () => import('../pages/projects/ProjectSettings.vue') },
      { path: 'archived', component: () => import('../pages/projects/ProjectLLMsArchive.vue') },
    ]
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
