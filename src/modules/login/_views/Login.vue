<template>
  <home v-loading.fullscreen.lock="fullscreenLoading" class="login">
    <form class="form" data-cy="login-form" @submit.prevent="onSubmit">
      <u-form-input
        v-model="email"
        input-name="username"
        autocomplete="email"
        :label="$t('login.email.label')"
        :placeholder="$t('login.email.placeholder')"
        :validator="emailValidator"
        data-cy="login-email-input"
      />
      <u-form-input
        v-model="password"
        type="password"
        input-name="current-password"
        autocomplete="current-password"
        :validator="passwordValidator"
        :label="$t('login.password.label')"
        data-cy="login-password-input"
      />
      <div class="form-actions">
        <u-button
          class="login-button"
          native-type="submit"
          type="primary"
          :disabled="!canSubmit"
          data-cy="login-submit-button"
        >
          {{ $t('login.submit') }}
        </u-button>
        <div class="forgot-password">
          <router-link
            :to="{ name: 'password.forgot' }"
            data-cy="forgot-password-link"
          >
            {{ $t('login.password.lost') }}
          </router-link>
        </div>
      </div>
    </form>
  </home>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNotification } from '@/composables/notfication';
  import { UFormInput, UButton } from '@/modules/ui';
  import Home from '../_components/Home.vue';
  import { isValidEmail } from '@/libs/utils/String';
  import i18n from '@/i18n';

  const router = useRouter();
  const route = useRoute();
  const usersStore = useUsersStore();
  const { $notification, $errorMsg } = useNotification();

  const fullscreenLoading = ref(false);
  const email = ref('');
  const password = ref('');

  type ValidatorFn = (value: string) => string | null;

  const emailValidator: ValidatorFn = (value) => {
    if (!value || value.length === 0) {
      return i18n.global.t('login.email.required');
    }
    if (!isValidEmail(value)) {
      return i18n.global.t('login.valid.email');
    }
    return null;
  };

  const passwordValidator: ValidatorFn = (value) => {
    if (!value || value.length === 0) {
      return i18n.global.t('login.password.required');
    }
    return null;
  };

  const canSubmit = computed(() => {
    return !emailValidator(email.value) && !passwordValidator(password.value);
  });

  async function onSubmit() {
    if (!canSubmit.value) return;

    fullscreenLoading.value = true;
    try {
      await usersStore.login({
        email: email.value,
        password: password.value,
      });

      await getRedirect();
    } catch (error: any) {
      console.error('Login process failed:', error);
      password.value = '';
      const errorMap: Record<string, string> = {
        ERR_UNAUTHORIZED: 'login.bad.credentials',
        BAD_CREDENTIALS: 'login.bad.credentials',
        ERR_PWD_EXPIRED: 'login.error.password-expired',
        ERR_PWD_VALIDATING: 'login.error.validating.status',
        INTERNAL_ONLY: 'login.error.internal-only',
        ERR_NETWORK: 'login.error.network',
      };

      const errorKey = error in errorMap ? error : 'default';
      $errorMsg(i18n.global.t(errorMap[errorKey] || 'login.error.generic'));

      if (error === 'ERR_PWD_EXPIRED') {
        await router.push({
          name: 'login.expired',
          params: { email: email.value },
        });
      }
    } finally {
      fullscreenLoading.value = false;
    }
  }

  async function getRedirect() {
    const redirectQuery = route.query?.redirect;
    let targetPath: string | null = null;

    if (redirectQuery) {
      const potentialPath = Array.isArray(redirectQuery)
        ? redirectQuery[0]
        : redirectQuery;

      if (potentialPath) {
        try {
          const decodedPath = decodeURIComponent(potentialPath);

          const resolvedRoute = router.resolve(decodedPath);

          if (
            resolvedRoute.matched.length > 0 &&
            resolvedRoute.name !== '404'
          ) {
            targetPath = resolvedRoute.fullPath;
          }
        } catch (error) {
          console.error(`Erreur de redirection '${potentialPath}':`, error);
        }
      }
    }

    if (targetPath) {
      await router.push(targetPath);
    } else {
      await redirectToDashboard();
    }
  }

  async function redirectToDashboard() {
    await router.replace({ name: 'dashboard' });
  }

  onMounted(() => {
    if (route.query.passwordUpdated === 'true') {
      $notification.notify({
        title: i18n.global.t('notification.success-title'),
        message: i18n.global.t('login.notification.password-updated'),
        type: 'success',
      });
      router.replace({ query: { ...route.query, passwordUpdated: undefined } });
    }
  });
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
        .login-button {
          margin-bottom: 8px;
          width: 100%;
        }
      }
    }
  }
</style>
