<template>
  <q-btn
    color="primary"
    label="Link new bank account"
    @click="beginPlaidLink"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import envelopes from 'src/envelopes';

export default defineComponent({
  name: 'PlaidLink',
  emits: ['plaid-link-success'],

  async setup(props, ctx) {
    const plaidTokenBody = await envelopes.plaid.linkToken();

    const plaidHandler = window.Plaid.create({
      token: plaidTokenBody.link_token,
      onSuccess: async (publicToken: string, metadata) => {
        await envelopes.plaid.createItemAccessToken({
          publicToken,
          bankName: metadata.institution?.name,
        });
        ctx.emit('plaid-link-success');
      },
      onLoad: () => {
        console.log('load');
      },
      onExit: (err, metadata) => {
        console.error(err);
        console.log(metadata);
      },
      onEvent: (eventName, metadata) => {
        console.log(eventName);
        console.log(metadata);
      },
    });

    return {
      beginPlaidLink: () => {
        plaidHandler.open();
      },
      plaidTokenBody,
    };
  },
});
</script>
