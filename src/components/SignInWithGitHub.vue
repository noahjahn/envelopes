<template>
  <q-btn
    align="between"
    class="full-width"
    color="dark"
    label="Sign in with GitHub"
    icon="mdi-github"
    @click="startSignInWithGitHub"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const githubIdentityURL = new URL(
  'login/oauth/authorize',
  'https://github.com'
);

export default defineComponent({
  name: 'SignInWithGitHub',
  props: {
    clientId: {
      type: String,
      required: true,
    },
    redirectUri: {
      type: String,
    },
  },
  async setup(props) {
    function startSignInWithGitHub() {
      const githubSignInParams = new URLSearchParams([
        ['client_id', props.clientId],
        ['state', '//TODO: something-that-is-unguessable-and-super-random'],
      ]);
      if (props.redirectUri !== undefined) {
        githubSignInParams.append('redirect_uri', props.redirectUri);
      }
      window.location.href = `${githubIdentityURL.toString()}?${githubSignInParams.toString()}`;
    }
    return {
      startSignInWithGitHub,
    };
  },
});
</script>
