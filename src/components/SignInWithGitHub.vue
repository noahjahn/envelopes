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
import envelopes from 'src/envelopes';

export default defineComponent({
  name: 'SignInWithGitHub',
  async setup() {
    function startSignInWithGitHub() {
      window.location.href = `${envelopes.oauth('github').getRedirectURL()}`;
    }
    return {
      startSignInWithGitHub,
    };
  },
});
</script>
