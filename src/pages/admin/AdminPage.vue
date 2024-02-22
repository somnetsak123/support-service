<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue';
import { storeToRefs } from 'pinia';
import { useIssueStore } from 'src/stores/issue';
import { Issue } from 'src/stores/issue/types';

import EditIssueDialog from './EditIssueDialog.vue';
import CardIssue from 'src/components/issue/CardIssue.vue';

const issueStore = useIssueStore();
const { issueStats, issue } = storeToRefs(issueStore);

onMounted(async () => {
  await issueStore.fetchIssue();
  await issueStore.fetchIssueStats();
});

const editOpen = ref(false);
const editData = ref<Issue>();

function editIssue(data: Issue) {
  editData.value = structuredClone(toRaw(data));
  editOpen.value = true;
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem">
    <div class="bg-white q-pa-md rounded-borders">
      <h4 class="q-my-none">สถานะปัจจุบัน</h4>
      <q-separator class="q-my-lg" />
      <div class="stats-container">
        <div
          class="stats-card column"
          :key="key"
          v-for="[key, val] in Object.entries(issueStats?.status || {})"
        >
          <span
            :id="`stats-card-${key}-count`"
            :class="{
              'text-negative': key === 'new',
              'text-warning': key === 'ongoing',
              'text-positive': key === 'resolved',
            }"
            class="text-h5"
          >
            {{ val }}
          </span>
          <span :id="`stats-card-${key}-name`" class="text-subtitle1">
            {{
              {
                new: 'ปัญหาใหม่',
                ongoing: 'กำลังดำเนินการ',
                resolved: 'แก้ไขแล้ว',
              }[key]
            }}
          </span>
        </div>
      </div>
    </div>

    <div class="bg-white q-pa-md rounded-borders">
      <card-issue
        v-for="item in issue?.result"
        :key="item.id"
        :data="item"
        @edit="editIssue"
      />
    </div>
  </div>

  <edit-issue-dialog
    v-if="editData"
    v-model:editOpen="editOpen"
    v-model:editData="editData"
  />
</template>

<style lang="scss" scoped>
.stats-card {
  border: 1px solid #e1e1e8;
  border-radius: 5px;
  padding-block: 0.25rem;
  padding-inline: 1rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(var(--cols, 4), auto);
  gap: 1rem;
}

@media screen and (max-width: $breakpoint-sm) {
  .stats-container {
    --cols: 3;
  }
}

@media screen and (max-width: $breakpoint-xs) {
  .stats-container {
    --cols: 2;
  }
}
</style>
