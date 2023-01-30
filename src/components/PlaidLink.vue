<!-- eslint-disable @typescript-eslint/no-empty-function -->
<template>
  <div>Plaid Link</div>
  {{ body }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlaidLink',
  props: {},
  async setup() {
    const response = await fetch('http://localhost:3333/link/token', {
      credentials: 'include',
    });
    const body = await response.json();

    const handler = window.Plaid.create({
      token: body.link_token,
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
      body,
    };
  },
});
</script>
