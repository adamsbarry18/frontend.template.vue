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
          <router-link :to="{ name: 'password.forgot' }" data-cy="forgot-password-link">
            {{ $t('login.password.lost') }}
          </router-link>
        </div>
        <div class="signup-prompt">
          <span>{{ $t('login.no-account-prompt') }}</span>
          <router-link :to="{ name: 'signup' }" data-cy="signup-link" class="signup-action-link">
            {{ $t('login.create-account') }}
          </router-link>
        </div>
        <div class="or-divider">
          <span>{{ $t('login.or') }}</span>
        </div>
        <u-button
          class="google-login-button"
          type="secondary"
          data-cy="google-login-button"
          @click="handleGoogleLogin"
        >
          <img src="@/assets/images/svg/google-color-icon.svg" alt="Google logo" class="google-logo" />
          {{ $t('login.google-signin') }}
        </u-button>
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

  function handleGoogleLogin() {
    usersStore.initiateGoogleLogin();
  }

  async function getRedirect() {
    const redirectQuery = route.query?.redirect;
    let targetPath: string | null = null;

    if (redirectQuery) {
      const potentialPath = Array.isArray(redirectQuery) ? redirectQuery[0] : redirectQuery;

      if (potentialPath) {
        try {
          const decodedPath = decodeURIComponent(potentialPath);
          const resolvedRoute = router.resolve(decodedPath);
          if (resolvedRoute.matched.length > 0 && resolvedRoute.name !== '404') {
            targetPath = resolvedRoute.fullPath;
          }
        } catch (error) {
          console.error(`Erreur de redirection '${potentialPath}':`, error);
        }
      }
    }

    if (targetPath) {
      await router.replace(targetPath);
    } else {
      await redirectToDashboard();
    }
  }

  async function redirectToDashboard() {
    await router.replace({ name: 'dashboard' });
  }

  onMounted(async () => {
    fullscreenLoading.value = true;
    try {
      const mainUrlParams = new URLSearchParams(window.location.search);
      const googleAuthTokenFromMainUrl = mainUrlParams.get('google_auth_token');
      const googleAuthSuccessFromMainUrl = mainUrlParams.get('google_auth_success');

      const { error: oauthErrorQuery, passwordUpdated } = route.query;

      if (googleAuthTokenFromMainUrl && googleAuthSuccessFromMainUrl === 'true') {
        const token = googleAuthTokenFromMainUrl;

        if (token) {
          const loginSuccess = await usersStore.loginWithToken(token);
          if (loginSuccess) {
            $notification.notify({
              title: i18n.global.t('notification.success-title'),
              message: i18n.global.t('login.google-signin-success'),
              type: 'success',
            });

            const url = new URL(window.location.href);
            const paramsToRemoveFromMainUrl = [
              'google_auth_token',
              'google_auth_success',
              'code',
              'scope',
              'authuser',
              'prompt',
              'hd',
              'error',
            ];
            paramsToRemoveFromMainUrl.forEach((param) => url.searchParams.delete(param));

            const newCleanedMainUrl = url.pathname + url.search;
            window.history.replaceState({}, '', newCleanedMainUrl + (window.location.hash || '#/'));

            await router.replace({ name: 'dashboard' });
            return;
          } else {
            console.warn('Login.vue: usersStore.loginWithToken returned false.');
            $errorMsg(i18n.global.t('login.error.google-oauth-generic'));
          }
        } else {
          console.warn('Login.vue: Google auth token was present in URL but evaluated as empty/null.');
          $errorMsg(i18n.global.t('login.error.google-oauth-generic'));
        }
        const url = new URL(window.location.href);
        const paramsToRemoveFromMainUrl = [
          'google_auth_token',
          'google_auth_success',
          'code',
          'scope',
          'authuser',
          'prompt',
          'hd',
          'error',
        ];
        paramsToRemoveFromMainUrl.forEach((param) => url.searchParams.delete(param));
        window.history.replaceState({}, '', url.pathname + url.search + (window.location.hash || '#/'));
      }

      if (oauthErrorQuery) {
        $errorMsg(i18n.global.t('login.error.google-oauth-failed', { error: oauthErrorQuery as string }));
        const url = new URL(window.location.href);
        const paramsToRemoveOnError = ['error', 'code', 'scope', 'authuser', 'prompt', 'hd'];
        paramsToRemoveOnError.forEach((param) => url.searchParams.delete(param));
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      }

      if (passwordUpdated === 'true') {
        $notification.notify({
          title: i18n.global.t('notification.success-title'),
          message: i18n.global.t('login.notification.password-updated'),
          type: 'success',
        });
        const currentHashQuery = { ...route.query };
        delete currentHashQuery.passwordUpdated;

        const url = new URL(window.location.href);
        url.searchParams.delete('passwordUpdated');
        const hashPath = route.hash.split('?')[0];
        window.history.replaceState({}, '', url.pathname + url.search + hashPath);
        await router.replace({ query: currentHashQuery, hash: hashPath });
      }
    } catch (error: any) {
      console.error('Error during onMounted in Login.vue:', error.message);
      const url = new URL(window.location.href);
      const paramsToRemoveOnCatch = [
        'google_auth_token',
        'google_auth_success',
        'code',
        'scope',
        'authuser',
        'prompt',
        'hd',
        'error',
      ];
      paramsToRemoveOnCatch.forEach((param) => url.searchParams.delete(param));
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    } finally {
      fullscreenLoading.value = false;
    }
  });
</script>

<style lang="scss" scoped>
  .login {
    width: auto;
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
        margin-top: 20px;

        .login-button {
          margin-bottom: 20px;
          width: 100%;
        }

        .forgot-password {
          margin-bottom: 15px;
          a {
            font-size: var(--paragraph-02);
            text-decoration: underline;
            &:hover {
              color: var(--color-primary-500);
              text-decoration: underline;
            }
          }
        }

        .signup-prompt {
          font-size: var(--paragraph-02);
          color: var(--color-text-secondary);
          span {
            margin-right: 5px;
          }
          .signup-action-link {
            color: var(--color-primary-500);
            font-weight: 500;
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .or-divider {
        display: flex;
        align-items: center;
        text-align: center;
        color: var(--color-text-secondary);
        font-size: var(--paragraph-02);
        margin: 20px 0;
        span {
          padding: 0 10px;
        }
        &::before,
        &::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--color-border-neutral);
        }
      }

      .google-login-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        .google-logo {
          height: 20px;
          width: auto;
        }
      }
    }
  }
</style>
