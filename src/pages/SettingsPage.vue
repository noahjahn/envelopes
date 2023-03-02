<template>
  <q-page padding>
    <div class="col">
      <q-item class="row" v-for="bank in banks" :key="bank.uuid">
        <q-input
          v-model="bankNames[bank.uuid]"
          placeholder="Bank has no friendly name"
        ></q-input>
        <q-btn
          v-if="bank.updateRequired"
          rounded
          icon="warning"
          text-color="warning"
        >
          <q-tooltip>{{ bank.updateRequiredReason }}</q-tooltip>
        </q-btn>
        <q-btn
          rounded
          icon="save"
          @click="($event) => updateBankName($event, bank.uuid)"
        />
        <q-btn
          rounded
          icon="delete"
          @click="($event) => deleteBank($event, bank.uuid)"
        />
      </q-item>
      <div class="row">
        <plaid-link @plaid-link-success="listBanks" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import PlaidLink from 'components/PlaidLink.vue';
import { defineComponent, ref } from 'vue';
import envelopes from 'src/envelopes';

export default defineComponent({
  name: 'SettingsPage',
  components: { PlaidLink },
  async setup() {
    // INFO: This is an interesting typing scenario
    const banks = ref<
      Array<{
        uuid: string;
        name: string;
        updateRequired: boolean;
        updateRequiredReason: string | null;
      }>
    >([]);

    const bankNames = ref<{
      [key: string]: string;
    }>({});

    async function listBanks() {
      banks.value = await envelopes.banks().list();
      banks.value.forEach((bank) => {
        bankNames.value[bank.uuid] = bank.name;
      });
    }

    await listBanks();

    return {
      banks,
      bankNames,
      updateBankName: async ($event: Event, bankUuid: string) => {
        await envelopes.banks().update(bankUuid, {
          name: bankNames.value[bankUuid],
        });
      },
      deleteBank: async ($event: Event, bankUuid: string) => {
        await envelopes.banks().delete(bankUuid);
        await listBanks();
      },
      listBanks,
    };
  },
});
</script>
