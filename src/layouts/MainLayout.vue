<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="text-black" style="background-color: #f3f3f7">
        <q-btn
          size="16px"
          class="bg-grey-4"
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
        >
          <q-icon name="menu" size="20px" color="grey-7" />
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left">
      <div class="main-bar">
        <!-- ใส่ component มั้ง -->
      </div>
    </q-drawer>

    <q-page-container class="main-body">
      <q-page class="q-pa-md">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.main-bar {
  height: 100%;
  background-color: $grey-9;
}

.main-body {
  height: 100%;
  background-color: #f3f3f7;
}
</style>
