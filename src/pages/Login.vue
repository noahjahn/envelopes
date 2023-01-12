<template>
  <q-page class="row items-center justify-evenly">
    <q-card flat class="q-pa-lg">
      <q-card-section align="center">
        <div class="text-h6 text-center">Login to Envelopes</div>
      </q-card-section>
      <q-separator inset class="q-mb-sm" />
      <q-card-section>
        <!-- TODO: make these env vars -->
        <sign-in-with-git-hub
          client-id="c79c9e09ae5619a0f440"
          class="text-center"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SignInWithGitHub from 'src/components/SignInWithGitHub.vue';

export default defineComponent({
  name: 'LoginPage',
  components: { SignInWithGitHub },
  setup() {
    return {};
  },
});
</script>
