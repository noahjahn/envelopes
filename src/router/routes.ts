import { RouteRecordRaw } from 'vue-router';
import envelopes from 'src/envelopes';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/UnauthenticatedLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/Login.vue'),
      },
    ],
  },
  {
    path: '/logout',
    name: 'logout',
    component: {
      async beforeRouteEnter(to, from, next) {
        try {
          await envelopes.user().logout();
        } catch (error) {
          // TODO: log error
        } finally {
          next({
            path: '/login',
          });
        }
      },
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
