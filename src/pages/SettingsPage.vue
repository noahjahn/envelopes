<template>
  <q-page class="row items-center justify-evenly">
    <q-item v-for="bank in banks" :key="bank.uuid">
      {{ bank.name ? bank.name : 'Bank has no friendly name' }}
    </q-item>

    <plaid-link></plaid-link>
  </q-page>
</template>

<script lang="ts">
import PlaidLink from 'components/PlaidLink.vue';
import { defineComponent, ref } from 'vue';
import envelopes from 'src/envelopes';

interface IBank {
  uuid: string;
  name: string;
}

export default defineComponent({
  name: 'SettingsPage',
  components: { PlaidLink },
  async setup() {
    // INFO: This is an interesting typing scenario
    const banks = ref<Array<IBank>>([]);

    banks.value = await envelopes.banks().list();

    return {
      banks,
    };
  },
});
</script>
