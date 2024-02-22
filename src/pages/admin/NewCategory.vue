<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QInput } from 'quasar';
import { useIssueStore } from 'src/stores/issue';

const issueStore = useIssueStore();

const openModal = defineModel('open', { default: false });

const newCategory = ref('');
const newCategoryRef = ref<QInput>();

async function onSubmit() {
  if (!newCategoryRef.value?.validate()) return;

  await issueStore
    .createIssueCategory({
      name: newCategory.value,
    })
    .then(() => {
      newCategory.value = '';
      openModal.value = false;
    });
}

onMounted(async () => {
  newCategory.value = '';
});
</script>

<template>
  <q-dialog v-model="openModal" persistent>
    <q-card style="width: 500px">
      <q-form ref="myForm" @submit.prevent.stop="onSubmit">
        <q-card-section class="row justify-between">
          <span class="text-weight-bold text-h6 text-primary">
            เพิ่มกลุ่มคำร้องใหม่
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
          <div class="row col-12 items-center q-col-gutter-y-sm">
            <q-input
              type="text"
              ref="newCategoryRef"
              outlined
              dense
              hide-bottom-space
              lazy-rules
              class="full-width inputgreen cursor-pointer"
              label="กลุ่มคำร้องใหม่"
              v-model="newCategory"
              :rules="[
                (val) => (val && val.length > 0) || 'กรุณากรอกกลุ่มคำร้องใหม่',
              ]"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-ma-sm">
          <q-btn
            label="เพิ่มกลุ่มคำร้องใหม่"
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
