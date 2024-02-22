<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { IssueStatus, Issue } from 'src/stores/issue/types';
import { useIssueStore } from 'src/stores/issue';
import { dateFormat } from 'src/utils/datetime';
import moment from 'moment';

const issueStore = useIssueStore();
const { issueCategory } = storeToRefs(issueStore);

const defaultValue = ref<Issue>();

const editOpen = defineModel<boolean>('editOpen', { default: false });
const editData = defineModel<Issue>('editData', { required: true });

const editState = ref(false);

const currentSla = computed<string | null>(() =>
  dateFormat(editData.value.sla, false, true),
);
const inputModeSla = ref<'hour' | 'day'>('hour');
const inputSla = ref<string>('');
const inputCateId = ref<string | null>(editData.value.category?.id || null);
const cateOptions = issueCategory.value?.result.map((item) => {
  return { label: item.name, value: item.id };
});

const responsibleUserId = ref('');
const responsibleUserIdOptions: { label: string; value: string }[] = [
  { label: 'ขวัญจิรา', value: '1' },
  { label: 'จอมขวัญ', value: '2' },
  { label: 'ชนกันต์', value: '3' },
  { label: 'ญาณิดา', value: '4' },
];

const issueStatusOptions: { label: string; value: IssueStatus }[] = [
  { label: 'ปัญหาใหม่', value: IssueStatus.New },
  { label: 'กำลังดำเนินการ', value: IssueStatus.OnGoing },
  { label: 'เสร็จสิ้น', value: IssueStatus.Resolved },
];

const slaError = ref(false);
const slaErrorMessage = ref('');

async function submit() {
  const result = await issueStore.editIssue(editData.value.id, {
    title: editData.value.title,
    categoryId: inputCateId.value,
    solution: editData.value.solution,
    description: editData.value.description,
    sla:
      currentSla.value === null
        ? moment()
            .add(inputSla.value, `${inputModeSla.value === 'day' ? 'd' : 'h'}`)
            .toDate()
        : undefined,
    status: editData.value.status,
  });
  if (result) {
    issueStore.fetchIssue();
    issueStore.fetchIssueStats();
  }
}

watch([editOpen], () => {
  if (editOpen.value === true) {
    defaultValue.value = editData.value;
    inputCateId.value = editData.value.category?.id || null;
  }
});
</script>

<template>
  <q-dialog v-model="editOpen">
    <q-card style="min-width: 300px; max-width: 1024px">
      <q-card-section class="row justify-between items-center">
        <div class="text-weight-bold row items-center" style="width: 80%">
          <span class="text-weight-bold text-h6 text-primary q-mr-sm">
            ข้อมูลคำร้อง
          </span>
          <q-btn
            v-if="!editState"
            flat
            round
            size="12px"
            color="secondary"
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
            @click="() => (submit(), (editState = false))"
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
          @click="() => (editState = false)"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="column" style="gap: 0.5rem">
        <div class="row q-gutter-x-lg">
          <div class="column">
            <span>จาก</span>
            <span>วันที่แจ้ง</span>
          </div>
          <div class="column">
            <span>{{ editData.createdByUserName }} </span>
            <span>{{ dateFormat(editData.createdAt, false, true) }}</span>
          </div>
        </div>

        <div class="column" style="gap: 0.5rem">
          <span class="text-subtitle2 text-bold">รายละเอียด</span>
          <q-input
            label="รายละเอียดคำร้อง"
            class="row"
            v-model="editData.description"
            readonly
            outlined
            autogrow
            dense
          />

          <q-select
            :options="cateOptions"
            :hide-dropdown-icon="!editState"
            :readonly="!editState"
            :borderless="!editState"
            outlined
            dense
            emit-value
            map-options
            color="primary"
            label="กลุ่มคำร้อง"
            v-model="inputCateId"
          />

          <div class="text-subtitle2 text-bold">รายละเอียดสถานะ</div>

          <div class="row" v-if="editState && currentSla === null">
            <div class="column">
              <q-radio
                v-model="inputModeSla"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="hour"
                label="ชั่วโมง"
                dense
                :disable="!editState"
              />
            </div>
            <div class="column">
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

          <q-input
            :readonly="!editState"
            outlined
            v-model="editData.solution"
            label="วิธีเเก้ปัญหา"
            dense
            autogrow
          />

          <div class="row q-gutter-x-lg">
            <div class="col">
              <q-select
                :hide-dropdown-icon="!editState"
                :readonly="!editState"
                :borderless="!editState"
                outlined
                dense
                color="primary"
                v-model="responsibleUserId"
                :options="responsibleUserIdOptions"
                label="ผู้รับผิดชอบ"
              />
            </div>
            <div class="col">
              <q-select
                dense
                outlined
                label="สถานะ"
                color="primary"
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
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss"></style>
