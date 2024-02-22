<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { getName, getRole } from 'src/services/keycloak';
import { useIssueStore } from 'src/stores/issue';

const issueStore = useIssueStore();
const { issueCategory, selectedIssueCateId } = storeToRefs(issueStore);

onMounted(async () => {
  await issueStore.fetchIssueCategory();
});

interface NotificationButton {
  item: string;
  bgColor: string;
  iconColor?: string;
  active: boolean;
}

const leftDrawerOpen = ref(false);

const notiOpen = ref(false);
const notiMenu = ref<NotificationButton[]>([
  { item: 'ทั้งหมด', bgColor: 'grey-7', iconColor: 'grey-7', active: false },
  {
    item: 'ยังไม่ได้อ่าน',
    bgColor: 'grey-7',
    iconColor: 'grey-7',
    active: false,
  },
]);

function setActive(button: NotificationButton) {
  notiMenu.value = notiMenu.value.map((current) => ({
    item: current.item,
    bgColor: current.item !== button.item ? 'grey-7' : 'light-blue-2',
    iconColor: current.item !== button.item ? 'grey-7' : 'primary',
    active: current.item === button.item,
  }));
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        class="text-black justify-between q-py-sm"
        style="background-color: #f3f3f7"
      >
        <div>
          <q-btn
            flat
            dense
            round
            @click="toggleLeftDrawer"
            size="16px"
            class="bg-grey-4"
            aria-label="Menu"
          >
            <q-icon name="menu" size="20px" color="grey-7" />
          </q-btn>
        </div>

        <div class="q-gutter-x-md">
          <!-- Search -->
          <q-btn round dense flat no-caps size="16px" class="bg-grey-4">
            <q-icon name="mdi-magnify" size="20px" color="grey-7" />
          </q-btn>

          <!-- Notification -->
          <q-btn
            round
            dense
            no-caps
            flat
            size="16px"
            :class="notiOpen ? 'bg-light-blue-2' : 'bg-grey-4'"
            class="q-mr-md"
            @click="notiOpen = !notiOpen"
          >
            <q-icon
              name="mdi-bell"
              size="20px"
              :color="notiOpen ? 'primary' : 'grey-7'"
            />
            <q-badge rounded floating color="negative" text-color="white">
              8
            </q-badge>
            <q-menu
              :offset="[0, 10]"
              anchor="bottom middle"
              self="top middle"
              style="width: 300px"
              @before-hide="notiOpen = false"
            >
              <div class="q-px-md q-py-sm row col-12 items-center">
                <div class="text-subtitle1 text-dark text-weight-bold">
                  แจ้งเตือน
                </div>
                <q-space />
              </div>
              <div class="q-px-md q-gutter-x-md">
                <q-btn
                  rounded
                  padding="0px 10px"
                  class="text-weight-medium"
                  v-for="(btn, index) in notiMenu"
                  :flat="!btn.active"
                  :unelevated="btn.active"
                  :key="index"
                  :color="btn.bgColor"
                  :label="btn.item"
                  :text-color="btn.iconColor"
                  @click="setActive(btn)"
                />
              </div>
              <q-infinite-scroll :offset="250">
                <div class="caption">
                  <q-item v-ripple dense class="q-py-sm col-12">
                    <q-avatar color="positive">
                      <q-icon
                        color="white"
                        name="mdi-check"
                        style="height: 20px; max-width: 20px"
                      />
                    </q-avatar>

                    <div class="col-6 column text-caption q-pl-md">
                      <span class="text-weight-bold">หัวข้อ</span>
                      <span class="text-grey-7">รายละเอียด</span>
                    </div>
                    <span align="right" class="col text-caption text-grey">
                      10 นาทีที่แล้ว
                    </span>
                  </q-item>
                </div>

                <div class="caption">
                  <q-item v-ripple dense class="q-py-sm col-12">
                    <q-avatar color="teal-3">
                      <q-icon
                        color="white"
                        name="mdi-check"
                        style="height: 20px; max-width: 20px"
                      />
                    </q-avatar>

                    <div class="col-6 column text-caption q-pl-md">
                      <span class="text-weight-bold text-grey-7">หัวข้อ</span>
                      <span class="text-grey-5">รายละเอียด</span>
                    </div>
                  </q-item>
                </div>

                <!-- <template v-slot:loading>
                  <div class="text-center q-my-md">
                    <q-spinner-dots color="primary" size="40px" />
                  </div>
                </template> -->
              </q-infinite-scroll>
            </q-menu>
          </q-btn>

          <!-- User -->
          <q-btn-dropdown
            rounded
            dense
            flat
            color="dark"
            class="q-pr-sm"
            dropdown-icon="mdi-menu-down"
          >
            <template v-slot:label>
              <q-item dense v-close-popup class="q-pa-none q-pr-md">
                <q-item-section
                  avatar
                  class="q-pa-none"
                  style="min-width: 30px"
                >
                  <q-avatar class="bg-grey-4">
                    <q-icon
                      color="grey-7"
                      name="mdi-account"
                      style="height: 30px; max-width: 30px"
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section class="text-left text-dark q-pa-none q-pl-sm">
                  <q-item-label class="text-caption column">
                    <span class="text-weight-bold q-pb-xs">
                      {{ getName() }}
                    </span>
                    <span style="font-size: 11px">
                      {{ getRole().includes('admin') ? 'Admin' : 'User' }}
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section avatar style="min-width: 30px">
                  <q-icon
                    color="secondary"
                    size="18px"
                    name="mdi-lock-outline"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>เปลี่ยนรหัสผ่าน</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section avatar style="min-width: 30px">
                  <q-icon
                    color="primary"
                    size="18px"
                    name="mdi-logout-variant"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>ออกจากระบบ</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left">
      <div class="main-bar">
        <q-list class="q-pt-xl">
          <q-expansion-item
            class="text-weight-bold"
            label="คำร้อง"
            icon="mdi-package-variant"
            @click="() => {}"
            hide-expand-icon
          />
          <q-expansion-item
            class="text-weight-bold"
            label="กลุ่มคำร้อง"
            icon="mdi-package-variant"
          >
            <q-expansion-item
              v-for="item in issueCategory?.result"
              :key="item.id"
              :header-inset-level="0.3"
              :label="item.name"
              @click="() => (selectedIssueCateId = item.id)"
              class="text-weight-medium"
              hide-expand-icon
              dense
            />
          </q-expansion-item>
        </q-list>
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
  background-color: white;
}

.main-body {
  height: 100%;
  background-color: #f3f3f7;
}
</style>
