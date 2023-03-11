import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import envelopes from 'src/envelopes';
import { HealthCheckError } from 'src/envelopes/health';
import { Loading, Notify } from 'quasar';
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  let createHistory;
  if (process.env.SERVER) {
    createHistory = createMemoryHistory;
  } else if (process.env.VUE_ROUTER_MODE === 'history') {
    createHistory = createWebHistory;
  } else {
    createHistory = createWebHashHistory;
  }

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    try {
      Loading.show({
        message: 'This is taking longer than expected...',
      });
      await envelopes.health();
      if (await envelopes.auth.isLoggedIn()) {
        if (to.fullPath === '/login') {
          next({
            path: '/',
          });
          return;
        }
        next();
        return;
      }

      if (to.fullPath !== '/login') {
        next({
          path: '/login',
        });
        return;
      }
      next();
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof HealthCheckError) {
        Notify.create({
          type: 'negative',
          message: `${error.message}. Please check the app configuration and ensure the server is reachable at ${envelopes.baseUrl}`,
          timeout: 0,
        });
      } else {
        next({
          path: '/login',
        });
      }
    } finally {
      Loading.hide();
    }
  });

  return Router;
});
