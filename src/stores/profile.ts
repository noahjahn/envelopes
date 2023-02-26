import { defineStore } from 'pinia';
import { ref } from 'vue';
import envelopes from 'src/envelopes';
import * as gravatar from 'gravatar';

export const useProfileStore = defineStore('profile', () => {
  const name = ref('');
  const email = ref('');
  const avatarUrl = ref('');
  const hasGravatar = ref(false);

  async function update() {
    const profile = await envelopes.profile().me();
    name.value = profile.name;
    email.value = profile.email;
    avatarUrl.value = gravatar.url(profile.email, {
      protocol: 'https',
      default: '404',
    });
    if ((await fetch(avatarUrl.value)).status !== 404) {
      hasGravatar.value = true;
    }
    return profile;
  }

  return { name, email, avatarUrl, hasGravatar, update };
});
