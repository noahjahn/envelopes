<template>
  <q-page class="row items-center"> ${{ balance }} </q-page>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';

import envelopes from 'src/envelopes';

export default defineComponent({
  name: 'IndexPage',
  async setup() {
    const balance: Ref<number> = ref(0);

    balance.value = (await envelopes.balance().get()).current;

    return {
      balance,
    };
  },
});
</script>
