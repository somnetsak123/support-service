<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useIssueStore } from 'src/stores/issue';

import DialogEditTicket from './DialogEditTicket.vue';

const issueStore = useIssueStore();
const { issueStats } = storeToRefs(issueStore);

onMounted(async () => {
  await issueStore.fetchIssueStats();
  console.log(issueStats.value);
});

const link = ref<number>();
const open = ref<boolean>(false);

interface DataListsObject {
  id: number;
  count: number;
  name: string;
}

const lists = ref<DataListsObject[]>([
  { name: 'ปัญหาใหม่', count: 555, id: 1 },
  { name: 'กำลังดำเนินการ', count: 5, id: 2 },
  { name: 'เสร็จสิ้น', count: 4, id: 3 },
  { name: 'ทดสอบ', count: 5, id: 4 },
  { name: 'ทดสอบ1', count: 5, id: 5 },
]);
</script>

<template>
  <div class="container-stats bg-white q-mt-sm">
    <div class="layout-category">
      <div class="text-subtitle1 text-grey-9 items-center">
        <q-list class="text-primary" v-for="list in lists" :key="list.name">
          <q-item
            dense
            clickable
            v-ripple
            :active="link === list.id"
            @click="
              () => {
                link = list.id;
              }
            "
            active-class="my-list-link text-blue-9 text-weight-medium"
            class="my-list text-dark text-body2 row"
          >
            <div class="ellipsis">{{ list.name }}</div>
            <q-space />
            <q-badge
              color="grey-4"
              class="q-px-sm my-list-badge q-py-xs text-weight-medium"
              :label="list.count"
              rounded
            />
          </q-item>
        </q-list>
      </div>
    </div>
    <div class="layout-statistics container-count align-center">
      <div class="layout-new q-px-md align-center">
        <q-card bordered flat class="row fit cardNum items-center align-center">
          <div class="row items-center">
            <div class="col-12 text-h5 text-weight-bold text-red">555</div>
            <div class="col-12 text-dark ellipsis">ปัญหาใหม่</div>
          </div>
        </q-card>
      </div>
      <div class="layout-ongoing q-px-md align-center">
        <q-card bordered flat class="row fit cardNum items-center align-center">
          <div class="row items-center">
            <div class="col-12 text-h5 text-weight-bold text-warning">5</div>
            <div class="col-12 text-dark ellipsis">กำลังดำเนินการ</div>
          </div>
        </q-card>
      </div>
      <div class="layout-resolved q-px-md align-center">
        <q-card bordered flat class="row fit cardNum items-center align-center">
          <div class="row items-center">
            <div class="col-12 text-h5 text-weight-bold text-green">4</div>
            <div class="col-12 text-dark ellipsis">เสร็จสิ้น</div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="layout-issue q-pa-sm"></div>

    <div class="layout-manage">2</div>
  </div>

  <div class="container-details bg-white q-my-md">
    <div class="layout-details row align-center">
      <div class="q-ma-sm">
        <q-card class="my-card">
          <q-card-section style="height: 40px" class="text-back align-left">
            <div class="">ประเภท (4)</div>
          </q-card-section>
          <q-separator color="grey-4" />
          <q-card-actions vertical>
            <div class="container-detail-issue q-my-sm">
              <div class="layout-icon">
                <q-icon name="date_range" size="18px" />
              </div>
              <div class="layout-issueId q-ml-sm">TK0124022001</div>
              <div class="layout-actions q-mr-md">
                <div class="q-mb-sx q-mr-md">
                  <q-btn
                    size="12px"
                    flat
                    round
                    @click="
                      () => {
                        open = true;
                      }
                    "
                    icon="mdi-pencil-outline"
                  >
                    <q-tooltip>แก้ไขข้อมูล</q-tooltip>
                  </q-btn>
                </div>
                <div>เปิด</div>
              </div>
              <div class="layout-name q-ml-sm">ธนพนธ์ แสงจันทร์</div>
              <div class="layout-time q-ml-sm">
                <q-icon name="hourglass_empty" />
                ล่าช้าไป 1 วัน 13 ชั่วโมง
              </div>
            </div>
            <q-separator color="grey-4" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>

  <dialog-edit-ticket v-model="open" />
</template>

<style scoped>
.my-card {
  width: 350px;
}

.my-list-link {
  color: rgb(118, 168, 222);
  border-radius: 5px;
  background: #a3d3fb48 !important;
  font-weight: 600;
  border: 1px solid rgba(175, 185, 196, 0.217);
  /*  box-shadow: 1px 1px 7px 1px rgba(41, 95, 255, 0.15) !important; */
}

.my-list-link .my-list-badge {
  color: rgb(5, 86, 173);
  background: #a3d3fb00 !important;
  font-weight: 800;
  /*  border: 1px solid rgba(62, 139, 222, 0.217); */
}

.cardNum {
  border-radius: 5px;
  /* border-left: 3px solid #016987 !important; */
  padding-left: 8px;
}

.align-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.align-left {
  display: flex;
  align-items: center;
  justify-content: left;
}

.container-detail-issue {
  display: grid;
  grid-template-areas:
    'icon issueId actions'
    'icon name    actions'
    'icon time    actions';
  grid-template-rows: 20px 20px 20px;
  grid-template-columns: 20px 1fr 30px;
}

.layout-icon {
  grid-area: icon;
}

.layout-issueId {
  grid-area: issueId;
}

.layout-actions {
  grid-area: actions;
}

.layout-name {
  grid-area: name;
}

.layout-time {
  grid-area: time;
}

.container-count {
  display: grid;
  grid-template-areas: 'new ongoing resolved';
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr;
}

.layout-new {
  grid-area: new;
}

.layout-ongoing {
  grid-area: ongoing;
}

.layout-resolved {
  grid-area: resolved;
}

.container-stats {
  display: grid;
  grid-template-areas:
    'category statistics'
    'category issue'
    'manage   manage';
  grid-template-rows: 100px 1fr 50px;
  grid-template-columns: 0.8fr 1fr;
}

.container-details {
  display: grid;
  grid-template-areas: 'details';
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
}

.layout-details {
  grid-area: details;
}

.layout-issue {
  grid-area: issue;
}

.layout-manage {
  grid-area: manage;
}

.layout-category {
  grid-area: category;
}

.layout-statistics {
  grid-area: statistics;
}
</style>
