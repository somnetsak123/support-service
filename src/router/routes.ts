import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MainPage.vue') },
      { path: 'issue', component: () => import('pages/issue/MainPage.vue') },
      {
        path: 'issue/category',
        component: () => import('pages/issue/category/MainPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error/NotFound.vue'),
  },
];

export default routes;
