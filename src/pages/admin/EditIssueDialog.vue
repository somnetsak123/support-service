<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { IssueStatus, Issue } from 'src/stores/issue/types';
import { useIssueStore } from 'src/stores/issue';
import { thaiDate } from 'src/utils/datetime';
import moment from 'moment';

const issueStore = useIssueStore();
const { issueCategory } = storeToRefs(issueStore);

const editOpen = defineModel<boolean>('editOpen', { default: false });
const editData = defineModel<Issue>('editData', { required: true });

const editState = ref(false);

const currentSla = computed<string | null>(() =>
  thaiDate(editData.value.sla, false, true),
);
const inputModeSla = ref<'hour' | 'day'>('hour');
const inputSla = ref<string>('');
const inputCateId = ref<string | null>(editData.value.category?.id || null);
const cateOptions = issueCategory.value?.result.map((item) => {
  return { label: item.name, value: item.id };
});

const responsibleUserId = ref('');

const issueStatusOptions: { label: string; value: IssueStatus }[] = [
  { label: 'ปัญหาใหม่', value: IssueStatus.New },
  { label: 'กำลังดำเนินการ', value: IssueStatus.OnGoing },
  { label: 'เสร็จสิ้น', value: IssueStatus.Resolved },
];

const slaError = ref(false);
const slaErrorMessage = ref('');

async function onSubmit() {
  const result = await issueStore.editIssue(editData.value.id, {
    title: editData.value.title,
    categoryId: inputCateId.value,
    solution: editData.value.solution,
    sla:
      currentSla.value === null
        ? moment()
            .add(inputSla.value, `${inputModeSla.value === 'day' ? 'd' : 'h'}`)
            .toDate()
        : undefined,
    status: editData.value.status,
  });
  if (result) issueStore.fetchIssue();
}

watch([editOpen], () => {
  if (editOpen.value === true) {
    inputCateId.value = editData.value.category?.id || null;
  }
});
</script>

<template>
  <q-dialog v-model="editOpen" class="dialog">
    <q-card style="width: 400px">
      <q-card-section class="row justify-between items-center">
        <div class="text-weight-bold row items-center" style="width: 80%">
          <div class="row text-lg q-pr-md">ข้อมูลปัญหา</div>
          <q-btn
            size="12px"
            v-if="!editState"
            flat
            round
            :color="editState ? 'grey-7' : 'secondary'"
            @click="() => (editState = true)"
            icon="mdi-pencil-outline"
          >
            <q-tooltip>แก้ไขข้อมูล</q-tooltip>
          </q-btn>
          <q-btn
            v-if="editState"
            flat
            round
            size="12px"
            icon="mdi-content-save-outline"
            color="secondary"
            @click="() => (onSubmit(), (editState = false))"
          >
            <q-tooltip>บันทึกข้อมูล</q-tooltip>
          </q-btn>
          <q-btn
            v-if="editState"
            size="12px"
            flat
            round
            color="negative"
            @click="() => (editState = false)"
            icon="mdi-undo"
          >
            <q-tooltip>ยกเลิก</q-tooltip>
          </q-btn>
        </div>
        <q-btn
          flat
          rounded
          v-close-popup
          padding="xs"
          icon="close"
          color="negative"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="column">
          <q-select
            :hide-dropdown-icon="!editState"
            :readonly="!editState"
            :borderless="!editState"
            outlined
            dense
            emit-value
            map-options
            color="secondary"
            v-model="inputCateId"
            :options="cateOptions"
            label="ประเภท"
          />
        </div>
        <div class="container-input bg-white rounded-borders">
          <div class="layout-detail-user row q-gutter-x-lg">
            <div class="column">
              <span>จาก</span>
              <span>วันที่แจ้ง</span>
            </div>
            <div class="column">
              <span>{{ editData.createdByUserName }} </span>
              <span>{{ thaiDate(editData.createdAt, false, true) }}</span>
            </div>
          </div>
          <div>
            <span class="text-subtitle2 text-bold">รายละเอียดคำร้อง</span>
            <q-input
              v-model="editData.description"
              readonly
              outlined
              autogrow
            />
          </div>
          <div>
            <div class="text-subtitle2 text-bold">รายละเอียดสถานะ</div>
          </div>
          <div>
            <div class="row" v-if="editState && currentSla === null">
              <div class="q-mb-sm">
                <q-radio
                  v-model="inputModeSla"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="hour"
                  label="ชั่วโมง"
                  dense
                  :disable="!editState"
                />
                <q-radio
                  class="q-ml-sm"
                  v-model="inputModeSla"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="day"
                  label="วัน"
                  dense
                  :disable="!editState"
                />
              </div>
            </div>
            <div class="row">
              <q-input
                v-if="editState && currentSla === null"
                hide-bottom-space
                dense
                lazy-rules
                v-model="inputSla"
                :outlined="editState"
                :readonly="!editState"
                :borderless="!editState"
                :label="`คาดว่าจะเสร็จสิ้น`"
                :error="slaError"
                :error-message="slaErrorMessage"
              />
              <!-- mask="##/##/#### ##:## น" -->
              <q-input
                v-else
                hide-bottom-space
                dense
                lazy-rules
                outlined
                readonly
                :model-value="currentSla || 'ยังไม่ได้กำหนด'"
                :rules="[
                  (val: string) => !!val || `${'กรุณาเลือก วัน/เดือน/ปี เกิด'}`,
                ]"
                :label="`คาดว่าจะเสร็จสิ้น`"
              />
            </div>
          </div>

          <div class="layout-solution">
            <q-input
              :readonly="!editState"
              outlined
              v-model="editData.solution"
              label="วิธีเเก้ปัญหา"
              dense
              autogrow
            />
          </div>

          <div>
            <q-select
              :hide-dropdown-icon="!editState"
              :readonly="!editState"
              :borderless="!editState"
              outlined
              dense
              color="secondary"
              v-model="responsibleUserId"
              :options="[]"
              label="รับงานโดย"
            />
          </div>
          <div>
            <q-select
              dense
              outlined
              label="สถานะ"
              color="secondary"
              emit-value
              map-options
              v-model="editData.status"
              :hide-dropdown-icon="!editState"
              :readonly="!editState"
              :borderless="!editState"
              :options="issueStatusOptions"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
