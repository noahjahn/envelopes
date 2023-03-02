<template>
  <q-page class="row items-center">
    ${{ showBalance ? balance : '******' }}
    <q-btn
      rounded
      :icon="showBalance ? 'visibility_off' : 'visibility'"
      @click="showBalance = !showBalance"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';

import envelopes from 'src/envelopes';

export default defineComponent({
  name: 'IndexPage',
  async setup() {
    const balance: Ref<number> = ref(0);
    const showBalance = ref(false);

    balance.value = (await envelopes.balance().get()).current;

    return {
      balance,
      showBalance,
    };
  },
});
</script>
