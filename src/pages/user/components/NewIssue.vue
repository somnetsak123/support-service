<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useIssueStore } from 'src/stores/issue';
import { getName, getEmail } from 'src/services/keycloak';

const issueStore = useIssueStore();
const { issueCategory } = storeToRefs(issueStore);

const openModal = defineModel('open', { default: false });

const options = ref<{ label: string; value: string }[]>([]);

const title = ref('');
const description = ref('');
const categoryId = ref('');

const titleRef = ref();
const descriptionRef = ref();
const categoryRef = ref();

async function onSubmit() {
  if (
    [
      titleRef.value.validate(),
      categoryRef.value.validate(),
      descriptionRef.value.validate(),
    ].some((v) => !v)
  ) {
    return;
  }

  await issueStore
    .createIssue({
      title: title.value,
      description: description.value,
      categoryId: categoryId.value,
    })
    .then(() => {
      title.value = description.value = categoryId.value = '';
      openModal.value = false;
    });
}

onMounted(async () => {
  title.value = description.value = categoryId.value = '';

  await issueStore.fetchIssueCategory();

  if (issueCategory.value) {
    options.value = issueCategory.value?.result.map((v) => ({
      label: v.name,
      value: v.id,
    }));
  }
});
</script>

<template>
  <q-dialog v-model="openModal" persistent>
    <q-card style="width: 500px">
      <q-form ref="myForm" @submit.prevent.stop="onSubmit">
        <q-card-section class="row justify-between">
          <span class="text-weight-bold text-h6 text-primary">
            เปิดคำร้องใหม่
          </span>
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
          <div class="row q-gutter-x-lg">
            <div class="column">
              <span>จาก</span>
              <span>อีเมล</span>
            </div>
            <div class="column">
              <span>{{ getName() }}</span>
              <span>{{ getEmail() }}</span>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <div class="row col-12 items-center q-col-gutter-y-sm">
            <q-select
              outlined
              dense
              hide-bottom-space
              emit-value
              map-options
              lazy-rules
              ref="categoryRef"
              class="full-width inputgreen cursor-pointer"
              option-value="value"
              option-label="label"
              label="เลือกกลุ่มคำร้อง"
              v-model="categoryId"
              :options="options"
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'กรุณาเลือกกลุ่มคำร้อง',
              ]"
            />

            <div class="column q-mt-md">
              <span class="text-weight-bold">รายละเอียดคำร้อง</span>
              <span class="text-caption">
                กรุณาให้รายละเอียดมากที่สุดเท่าที่เป็นไป
              </span>
            </div>
            <q-input
              type="text"
              ref="titleRef"
              outlined
              dense
              hide-bottom-space
              lazy-rules
              class="full-width inputgreen cursor-pointer"
              label="เรื่องคำร้อง"
              v-model="title"
              :rules="[
                (val) => (val && val.length > 0) || 'กรุณากรอกเรื่องคำร้อง',
              ]"
            />
            <q-input
              type="textarea"
              ref="descriptionRef"
              dense
              outlined
              hide-bottom-space
              lazy-rules
              class="full-width inputgreen cursor-pointer"
              label="รายละเอียดคำร้อง"
              v-model="description"
              :rules="[
                (val) => (val && val.length > 0) || 'กรุณากรอกรายละเอียดคำร้อง',
              ]"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-ma-sm">
          <q-btn
            v-close-popup
            label="เปิดคำร้องใหม่"
            icon="add"
            color="secondary"
            type="submit"
            class="q-px-md"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<style scoped lang="scss"></style>
