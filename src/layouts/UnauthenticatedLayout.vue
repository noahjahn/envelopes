<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <Suspense>
        <router-view />
      </Suspense>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'UnauthenticatedLayout',
});
</script>
