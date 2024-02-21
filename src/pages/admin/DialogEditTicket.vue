<script setup lang="ts">
import { ref } from 'vue';
const [open] = defineModel<boolean>();
const edit = ref<boolean>(false);
const isTime = ref<string | null>('');

const editedBy = ref<string>('');
const text = ref<string>('');
const editedByIssue: ('ปัญหาใหม่' | 'กำลังดำเนินการ' | 'เสร็จสิ้น')[] = [
  'ปัญหาใหม่',
  'กำลังดำเนินการ',
  'เสร็จสิ้น',
];
const messageErrorSla = ref<string>('');
const currentSla = ref<string>('');
const inputSla = ref<string>('');
const dayCheckedSla = ref<boolean>(false);
const statusIssue: ('ปัญหาใหม่' | 'กำลังดำเนินการ' | 'เสร็จสิ้น')[] = [
  'ปัญหาใหม่',
  'กำลังดำเนินการ',
  'เสร็จสิ้น',
];

const inputStatus = ref<string>('');
</script>

<template>
  <q-dialog v-model="open" class="dialog" persistent>
    <q-card style="width: 400px; height: 650px" class="bg-grey-11">
      <q-card-section class="flex justify-between" style="padding: 0">
        <q-toolbar>
          <q-toolbar-title class="text-subtitle2 text-bold"
            >หัวเรื่อง</q-toolbar-title
          >
          <q-btn
            icon="close"
            unelevated
            round
            dense
            @click="
              () => {
                open = false;
              }
            "
            style="color: #ff8080; background-color: #ffdede"
          />
        </q-toolbar>
      </q-card-section>

      <q-separator color="grey-4" />
      <q-card-section class="q-pa-none align-center">
        <div class="container-input bg-white q-ma-sm border_black">
          <div class="layout-detailsUser container-detailsUser">
            <div class="q-ml-sm layout-from align-left">จาก</div>
            <div class="q-ml-sm layout-when align-left">เมื่อ</div>
            <div class="layout-createBy align-left">ธนพนธ์ แสงจันทร์</div>
            <div class="layout-createdAt align-left">19/03/2544</div>
          </div>

          <div class="layout-details">
            <q-separator class="q-mb-sm" color="grey-4" />
            <div class="q-ml-sm text-subtitle2 text-bold">รายละเอียดคำร้อง</div>
            <div class="q-pa-sm" style="width: 300px; height: 80px">
              <q-input
                readonly
                style="width: 365px; height: 80px"
                v-model="text"
                filled
                type="textarea"
              />
            </div>
          </div>

          <div class="layout-titleedit align-left">
            <div class="q-ml-sm text-subtitle2 text-bold">
              รายละเอียดสถานะ

              <q-btn
                size="12px"
                v-if="!edit"
                flat
                round
                :color="edit ? 'grey-7' : 'primary'"
                @click="
                  () => {
                    edit = true;
                  }
                "
                icon="mdi-pencil-outline"
              >
                <q-tooltip>แก้ไขข้อมูล</q-tooltip>
              </q-btn>

              <q-btn
                size="12px"
                flat
                round
                v-if="edit"
                :color="!edit ? 'grey-7' : 'public'"
                @click="() => {}"
                icon="mdi-content-save-outline"
              >
                <q-tooltip>บันทึกข้อมูล</q-tooltip>
              </q-btn>

              <q-btn
                size="12px"
                flat
                round
                v-if="edit"
                :color="!edit ? 'grey-7' : 'red'"
                @click="
                  () => {
                    edit = false;
                  }
                "
                icon="mdi-undo"
              >
                <q-tooltip>ยกเลิก</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div class="layout-sla align-left">
            <div class="col q-pa-sm">
              <div class="row">
                <div v-if="edit" class="q-mb-xs">
                  <q-radio
                    v-model="isTime"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="false"
                    label="ชั่วโมง"
                    dense
                    :disable="!edit"
                  />
                  <q-radio
                    class="q-ml-sm"
                    v-model="isTime"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="true"
                    label="วัน"
                    dense
                    :disable="!edit"
                  />
                </div>
              </div>
              <div class="row">
                <q-input
                  v-if="edit"
                  hide-bottom-space
                  :outlined="edit"
                  dense
                  lazy-rules
                  :readonly="!edit"
                  :borderless="!edit"
                  v-model="inputSla"
                  :label="`คาดว่าจะเสร็จสิ้น`"
                  :error="dayCheckedSla"
                  :error-message="messageErrorSla"
                />
                <!-- mask="##/##/#### ##:## น" -->
                <q-input
                  v-else
                  hide-bottom-space
                  :outlined="edit"
                  dense
                  lazy-rules
                  :readonly="!edit"
                  :borderless="!edit"
                  :model-value="currentSla"
                  :rules="[
                    (val: string) =>
                      !!val || `${'กรุณาเลือก วัน/เดือน/ปี เกิด'}`,
                  ]"
                  :label="`คาดว่าจะเสร็จสิ้น`"
                />
              </div>
            </div>
          </div>

          <div class="layout-solution">
            <div class="q-pa-sm">
              <q-input
                :readonly="!edit"
                label="วิธีเเก้ปัญหา"
                style="width: 365px"
                v-model="text"
                filled
                autogrow
              />
            </div>
          </div>

          <div class="layout-editedBy">
            <q-select
              class="q-pa-sm"
              :hide-dropdown-icon="!edit"
              :readonly="!edit"
              :borderless="!edit"
              outlined
              dense
              color="secondary"
              v-model="editedBy"
              :options="editedByIssue"
              label="รับงานโดย"
            />
          </div>
          <div class="layout-status">
            <q-select
              class="q-pa-sm"
              :hide-dropdown-icon="!edit"
              :readonly="!edit"
              :borderless="!edit"
              outlined
              dense
              color="secondary"
              v-model="inputStatus"
              :options="statusIssue"
              label="สถานะ"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator color="grey-4" />
    </q-card>
  </q-dialog>
</template>

<style scoped>
.align-left {
  display: flex;
  align-items: center;
  justify-content: left;
}

.container-detailsUser {
  display: grid;
  grid-template-areas:
    'from  createBy '
    'when createdAt';

  grid-template-rows: 40px 40px;
  grid-template-columns: 50px 1fr;
}

.container-input {
  display: grid;
  grid-template-areas:
    'detailsUser detailsUser '
    'detailsUser detailsUser'
    'details     details   '
    'titleedit   titleedit'
    'sla         sla'
    'solution    solution  '
    'editedBy    status ';

  grid-template-rows: 15px 60px 180px 30px 65px 1fr 1fr;
  grid-template-columns: 1fr 1fr;
}

.layout-titleedit {
  grid-area: titleedit;
}

.layout-from {
  grid-area: from;
}
.layout-when {
  grid-area: when;
}

.layout-detailsUser {
  grid-area: detailsUser;
}

.layout-createBy {
  grid-area: createBy;
}

.layout-createdAt {
  grid-area: createdAt;
}

.layout-details {
  grid-area: details;
}

.layout-sla {
  grid-area: sla;
}

.layout-solution {
  grid-area: solution;
}

.layout-editedBy {
  grid-area: editedBy;
}

.layout-status {
  grid-area: status;
}
</style>
