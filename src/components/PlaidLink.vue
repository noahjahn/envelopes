<!-- eslint-disable @typescript-eslint/no-empty-function -->
<template>
  <div>Plaid Link</div>
  {{ plaidTokenBody }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import envelopes from 'src/envelopes';

export default defineComponent({
  name: 'PlaidLink',
  async setup() {
    const plaidTokenBody = await envelopes.plaid().linkToken();

    const handler = window.Plaid.create({
      token: plaidTokenBody.link_token,
      onSuccess: (public_token, metadata) => {
        console.log(public_token);
        console.log(metadata);
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

    handler.open();
    return {
      plaidTokenBody,
    };
  },
});
</script>
