<script setup lang="ts">
import moment from 'moment';
import { Issue } from 'src/stores/issue/types';
import { dateFormat } from 'src/utils/datetime';

defineProps<{ data: Issue }>();
defineEmits<{ edit: [data: Issue] }>();
</script>

<template>
  <q-card
    @click="() => $emit('edit', $props.data)"
    class="card q-mb-sm"
    flat
    bordered
  >
    <q-card-section class="q-pa-sm">
      <article class="flex" style="flex-wrap: nowrap; gap: 1rem">
        <div>
          <q-avatar
            size="42px"
            font-size="24px"
            color="grey-2"
            :icon="
              {
                new: 'mdi-file-outline',
                ongoing: 'mdi-timer-sand',
                resolved: 'mdi-check-bold',
              }[data.status]
            "
            :text-color="
              {
                new: 'negative',
                ongoing: 'warning',
                resolved: 'positive',
              }[data.status]
            "
          />
        </div>
        <div style="flex-grow: 1; overflow: hidden">
          <div class="ellipsis" style="text-wrap: nowrap">
            <q-badge
              outline
              color="secondary"
              :label="data.category?.name || 'ไม่ทราบประเภท'"
            />
            {{ data.title }}
          </div>
          <div class="text-grey-6 text-caption">
            {{
              data.sla && new Date(data.sla).getTime() > Date.now()
                ? `กำหนดการแก้ไขใน${moment(data.sla).fromNow()}`
                : data.sla
                  ? `แก้ไขเมื่อ ${dateFormat(data.sla, false, true)}`
                  : 'ไม่มีกำหนดแก้ไข'
            }}
          </div>
        </div>
      </article>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.card {
  cursor: pointer;
}
</style>
