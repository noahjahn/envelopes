<template>
  <q-page class="row items-center justify-evenly">
    <q-form class="q-gutter-md">
      <h2>Profile</h2>
      <p style="max-width: 200px">
        This information is pulled automatically from the OAuth provider you
        logged in with and thus is read-only.
      </p>
      <q-input v-model="name" label="Name" readonly />
      <q-input v-model="email" label="Email" readonly />
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from 'src/stores/profile';

export default defineComponent({
  name: 'ProfilePage',
  setup() {
    const profile = useProfileStore();

    const { name, email } = storeToRefs(profile);

    return {
      name,
      email,
    };
  },
});
</script>
