<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useIssueStore } from 'src/stores/issue';

const issueStore = useIssueStore();

const { issue: issueData } = storeToRefs(issueStore);

onMounted(issueStore.fetchIssue);
</script>
<template>
  <q-page class="row items-center justify-evenly">
    <div style="width: 100%; overflow-x: auto" class="bg-white rounded-borders">
      <pre>{{ JSON.stringify(issueData, null, 2) }}</pre>
    </div>
  </q-page>
</template>
