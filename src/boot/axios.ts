import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { getToken } from 'src/services/keycloak';
import { useDialog } from 'src/stores/dialog';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'http://192.168.1.20:3000' });

api.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${await getToken()}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    useDialog().openDialog({
      color: 'negative',
      icon: 'priority_high',
      title: 'Error',
      message: 'Error Message',
      action: () => {},
    });
    console.log(err);
  },
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
