<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue';
import { storeToRefs } from 'pinia';
import { useIssueStore } from 'src/stores/issue';
import { Issue } from 'stores/issue/types';

import IssueCard from 'components/issue/IssueCard.vue';
import EditIssueDialog from 'components/issue/EditIssueDialog.vue';

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
      <h5 class="q-mt-none q-mb-md text-weight-bold">สถานะปัจจุบัน</h5>
      <div class="stats-container">
        <div
          v-for="[key, val] in Object.entries(issueStats?.status || {})"
          :key="key"
          class="stats-card column"
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
      <h5 class="q-mt-none q-mb-md text-weight-bold bg-white">รายการคำร้อง</h5>
      <div class="text-center q-my-md" v-if="!issue">
        <q-spinner-dots color="primary" size="40px" />
      </div>
      <issue-card
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
  text-align: center;
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
