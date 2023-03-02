<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar flat class="bg-grey-10">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Envelopes </q-toolbar-title>

        <q-btn icon="account_circle" flat round>
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item>
                <q-item-section avatar>
                  <q-avatar color="secondary">
                    <img v-if="hasGravatar" :src="avatarUrl" />
                    {{ name.substring(0, 1) }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{ name }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup :to="{ name: 'profile' }">
                <q-item-section avatar>
                  <q-avatar icon="account_circle"> </q-avatar>
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup :to="{ name: 'settings' }">
                <q-item-section avatar>
                  <q-avatar icon="settings"> </q-avatar>
                </q-item-section>
                <q-item-section>Settings </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="logout">
                <q-item-section avatar>
                  <q-avatar icon="logout"> </q-avatar>
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <Suspense>
        <router-view />
      </Suspense>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
import EssentialLink from 'components/EssentialLink.vue';
import { useProfileStore } from 'stores/profile';

const essentialLinks = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    to: {
      name: 'dashboard',
    },
  },
  {
    title: 'Settings',
    icon: 'settings',
    to: {
      name: 'settings',
    },
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    const profile = useProfileStore();
    profile.update();
    const { name, avatarUrl, hasGravatar } = storeToRefs(profile);

    return {
      essentialLinks,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      name,
      avatarUrl,
      hasGravatar,
    };
  },
});
</script>
