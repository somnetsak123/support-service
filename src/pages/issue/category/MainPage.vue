<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';
import { useIssueStore } from 'stores/issue';
import { dateFormat } from 'src/utils/datetime';

const issueStore = useIssueStore();
const { issueCategory } = storeToRefs(issueStore);

const columns = [
  { name: 'name', field: 'name', label: 'ชื่อ', align: 'left' },
  {
    name: 'createdAt',
    field: (row) => dateFormat(row.createdAt),
    label: 'สร้างเมื่อ',
    align: 'center',
  },
  { name: 'actions', field: 'actions', label: '' },
] satisfies QTableColumn[];

onMounted(async () => {
  await issueStore.fetchIssueCategory();
  console.log(issueCategory.value);
});
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem">
    <div class="bg-white q-pa-md rounded-borders">
      <h5 class="q-mt-none q-mb-md text-weight-bold">จัดการประเภทคำร้อง</h5>
      <q-table
        ref="table"
        :columns="columns"
        :rows="issueCategory?.result || []"
        :paging="true"
        flat
        bordered
        dense
      >
        <template v-slot:body-cell-actions="data">
          <q-td auto-width>
            <div class="align-right">
              <q-btn
                flat
                dense
                rounded
                id="edit-issue-cate"
                icon="edit"
                color="secondary"
                @click="() => {}"
              >
                <q-tooltip>แก้ไขข้อมูล</q-tooltip>
              </q-btn>
              <q-btn
                class="q-ma-sm"
                flat
                dense
                rounded
                id="delete-issue-cate"
                color="negative"
                icon="mdi-delete"
                @click="() => console.log(data)"
              >
                <q-tooltip>ลบข้อมูล</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
