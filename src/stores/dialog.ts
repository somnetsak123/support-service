import { useQuasar } from 'quasar';
import { defineStore } from 'pinia';
import DialogComponent from 'src/components/DialogComponent.vue';

export const useDialog = defineStore('custom-dialog', () => {
  const $q = useQuasar();

  return {
    openDialog: (opts: {
      title: string;
      message: string;
      color?: string;
      icon?: string;
      action?: (...args: unknown[]) => unknown;
      cancel?: (...args: unknown[]) => unknown;
    }) => {
      $q.dialog({
        component: DialogComponent,
        componentProps: opts,
      });
    },
  };
});
