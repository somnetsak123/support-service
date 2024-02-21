<script setup lang="ts">
import { ref } from 'vue';
import NewIssue from 'src/pages/user/components/NewIssue.vue';

const openNewIssue = ref<boolean>(false);
</script>

<template>
  <div class="col-12 row justify-center q-gutter-x-xl q-mt-lg">
    <q-card class="col-5 q-py-md">
      <q-card-section class="column items-center">
        <span class="text-weight-bold text-h6 text-primary">
          เปิดคำร้องใหม่
        </span>
        <span class="text-center q-my-md">
          กรุณาให้รายละเอียดมากที่สุดเท่าที่เป็นไป<br />
          เพื่อให้เราสามารถช่วยเหลือคุณได้อย่างเต็มที่
        </span>
        <q-btn
          color="secondary"
          icon="add"
          label="เปิดคำร้องใหม่"
          @click="openNewIssue = true"
        />
      </q-card-section>
    </q-card>

    <q-card class="col-5 q-py-md">
      <q-card-section class="column items-center">
        <span class="text-weight-bold text-h6 text-primary">
          ตรวจสอบสถานะคำร้อง
        </span>
        <span class="text-center q-my-md">
          เรามีบริการเก็บรวบรวมและเก็บข้อมูลประวัติของคำขอความช่วยเหลือ<br />
          ทั้งปัจจุบันและที่ผ่านมาของคุณ พร้อมการตอบกลับที่ครบถ้วน
        </span>
        <q-btn color="primary" icon="check" label="เช็คสถานะ" />
      </q-card-section>
    </q-card>
  </div>
  <new-issue v-model:open="openNewIssue" />
</template>

<style scoped lang="scss">
.text-center {
  text-align: center;
}
</style>
