<template>
  <q-page class="row items-center justify-evenly">
    <plaid-link></plaid-link>
  </q-page>
</template>

<script lang="ts">
import PlaidLink from 'components/PlaidLink.vue';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { PlaidLink },
  setup() {
    return {};
  },
});
</script>
