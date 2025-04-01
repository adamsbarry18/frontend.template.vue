<template>
  <home v-loading.fullscreen.lock="fullscreenLoading" class="login">
    <form class="form" datu-nav="login-form" @submit.prevent="onSubmit">
      <u-form-input
        v-model="email"
        input-name="username"
        autocomplete="email"
        :label="$t('login.email.label')"
        :placeholder="$t('login.email.placeholder')"
        :validator="emailValidator"
      />
      <u-form-input
        v-model="password"
        type="password"
        autocomplete="current-password"
        :validator="passwordValidator"
        :label="$t('login.password.label')"
      />
      <div class="form-actions">
        <div class="forgot-password">
          <router-link to="/forgot-password">
            {{ $t('login.password.lost') }}
          </router-link>
        </div>
        <u-button class="login-button" type="primary" :disabled="!canSubmit">
          {{ $t('login.submit') }}
        </u-button>
      </div>
    </form>
  </home>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUsersStore } from '@/stores/users/user';
  import { useNotification } from '@/composables/notfication';
  import UFormInput from '@/modules/common/forms/UFormInput.vue';
  import UButton from '@/modules/common/basic/UButton.vue';
  import Home from '../_components/Home.vue';
  import { isValidEmail } from '@/libs/utils/String';
  import i18n from '@/i18n';

  const router = useRouter();
  const route = useRoute();
  const usersStore = useUsersStore();
  const { $notification, $errorMsg } = useNotification();

  // Données réactives
  const fullscreenLoading = ref(false);
  const email = ref('');
  const password = ref('');

  // Computed property
  const canSubmit = computed(() => {
    console.log(email.value);
    return !emailValidator(email.value) && !passwordValidator(password.value);
  });

  // Lifecycle hook
  onMounted(() => {
    if (route.params.updatePassword) {
      $notification.notify({
        title: 'Success',
        message: 'Password updated!',
        type: 'success',
      });
    }
  });

  // Fonctions de validation
  function emailValidator(value) {
    if (value.length === 0) {
      return i18n.global.t('login.email.required');
    }
    if (!isValidEmail(value)) {
      return i18n.global.t('login.valid.email');
    }
    return null;
  }

  function passwordValidator(value) {
    if (value.length === 0) {
      return i18n.global.t('login.password.required');
    }
    return null;
  }

  // Méthodes
  async function onSubmit() {
    fullscreenLoading.value = true;
    try {
      await usersStore.login({
        email: email.value,
        password: password.value,
      });

      if (route.query?.redirect) {
        const redirectParam = Array.isArray(route.query.redirect)
          ? route.query.redirect[0]
          : route.query.redirect;
        const url = decodeURIComponent(redirectParam);
        if (url.startsWith('/#/')) {
          window.location.href = url;
          window.location.reload();
        } else {
          await redirectToDashboard();
        }
      } else {
        await redirectToDashboard();
      }
    } catch (error) {
      password.value = '';
      if (error === 'BAD_CREDENTIALS') {
        $errorMsg('login.bad.credentials');
      } else if (error === 'ERR_PWD_EXPIRED') {
        $errorMsg('login.error.passwordExpired');
        router.push({ name: 'login.expired', params: { email: email.value } });
      } else if (error === 'ERR_PWD_VALIDATING') {
        $errorMsg('login.error.validating.status');
      } else if (error === 'INTERNAL_ONLY') {
        $errorMsg('Internal only!');
      } else {
        console.error('Unknown login error!', error);
      }
    } finally {
      fullscreenLoading.value = false;
    }
  }

  async function redirectToDashboard() {
    await router.push({
      name: 'dashboard',
    });
  }
</script>

<style lang="scss" scoped>
  .login {
    :deep(.rebranding-text) {
      display: flex;
      align-items: center;
      a {
        margin-left: 4px;
        text-decoration: underline;
      }
      img {
        height: 24px;
      }
      .advalo-logo {
        margin: 0 2px;
      }
    }
    .form {
      width: 550px;

      :deep(.u-form-input) {
        margin-bottom: 24px;
      }

      .form-actions {
        text-align: center;

        .forgot-password a {
          text-decoration: underline;
        }
      }
    }
  }
</style>
