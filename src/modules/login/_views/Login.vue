<template>
  <home v-loading.fullscreen.lock="fullscreenLoading" class="login">
    <form class="form" data-cy="login-form" @submit.prevent="onSubmit">
      <u-form-input
        v-model="email"
        input-name="username"
        autocomplete="email"
        :label="$t('login.email.label')"
        placeholder="email@example.com"
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
  import { useRouter, useRoute, type LocationQueryValue } from 'vue-router';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNotification } from '@/composables/notfication';
  import { UFormInput, UButton } from '@/modules/common';
  import Home from '../_components/Home.vue';
  import { isValidEmail } from '@/libs/utils/String';
  import i18n from '@/i18n';

  const router = useRouter();
  const route = useRoute();
  const usersStore = useUsersStore();
  const { $notification, $errorMsg } = useNotification();

  // --- State ---
  const fullscreenLoading = ref(false);
  const email = ref('');
  const password = ref('');

  // --- Validation ---
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

  // --- Computed ---
  const canSubmit = computed(() => {
    return !emailValidator(email.value) && !passwordValidator(password.value);
  });

  // --- Methods ---
  async function onSubmit() {
    if (!canSubmit.value) return;

    fullscreenLoading.value = true;
    try {
      console.log(`Attempting login for: ${email.value}`);
      await usersStore.login({
        email: email.value,
        password: password.value,
      });
      console.log('Login successful');

      const redirectPath = getRedirectPath(route.query.redirect);
      console.log(`Redirecting to: ${redirectPath}`);
      await router.push(redirectPath);
    } catch (error: any) {
      console.error('Login failed:', error);
      password.value = '';
      switch (error) {
        case 'BAD_CREDENTIALS':
          $errorMsg(i18n.global.t('login.bad.credentials'));
          break;
        case 'ERR_PWD_EXPIRED':
          $errorMsg(i18n.global.t('login.error.passwordExpired'));
          router.push({
            name: 'login-expired',
            params: { email: email.value },
          });
          break;
        case 'ERR_PWD_VALIDATING':
          $errorMsg(i18n.global.t('login.error.validating.status'));
          break;
        case 'INTERNAL_ONLY':
          $errorMsg(
            i18n.global.t('login.error.internalOnly', 'Internal only!')
          );
          break;
        default:
          $errorMsg(
            i18n.global.t(
              'login.error.generic',
              'An unexpected error occurred. Please try again.'
            )
          );
          console.error('Unknown login error details:', error);
      }
    } finally {
      fullscreenLoading.value = false;
    }
  }

  /**
   * Détermine le chemin de redirection après une connexion réussie.
   * @param redirectQuery Le paramètre 'redirect' de l'URL.
   * @returns Le chemin vers lequel rediriger (par défaut: dashboard).
   */
  function getRedirectPath(
    redirectQuery: LocationQueryValue | LocationQueryValue[] | undefined
  ): string {
    const defaultRedirect = { name: 'dashboard' };

    if (!redirectQuery) {
      return router.resolve(defaultRedirect).fullPath;
    }

    const redirectParam = Array.isArray(redirectQuery)
      ? redirectQuery[0]
      : redirectQuery;

    if (redirectParam) {
      try {
        const decodedPath = decodeURIComponent(redirectParam);
        if (decodedPath.startsWith('/') && !decodedPath.startsWith('//')) {
          const resolvedRoute = router.resolve(decodedPath);
          if (resolvedRoute.matched.length > 0) {
            console.log(`Valid redirect path found: ${decodedPath}`);
            return decodedPath;
          } else {
            console.warn(
              `Redirect path "${decodedPath}" does not match any known route. Falling back to default.`
            );
          }
        } else {
          console.warn(
            `Invalid or external redirect path "${decodedPath}" ignored. Falling back to default.`
          );
        }
      } catch (e) {
        console.error('Error decoding redirect parameter:', e);
      }
    }

    return router.resolve(defaultRedirect).fullPath;
  }

  // --- Lifecycle Hooks ---
  onMounted(() => {
    if (route.query.passwordUpdated === 'true') {
      $notification.notify({
        title: i18n.global.t('notification.successTitle', 'Success'),
        message: i18n.global.t(
          'login.notification.passwordUpdated',
          'Password updated successfully!'
        ),
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
