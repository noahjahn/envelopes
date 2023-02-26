<template>
  <q-page class="row items-center justify-evenly">
    <plaid-link></plaid-link>
  </q-page>
</template>

<script lang="ts">
import PlaidLink from 'components/PlaidLink.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SettingsPage',
  components: { PlaidLink },
});
</script>
