<template>
  <home class="password-reset" v-loading="isLoading">
    <h1>
      {{ $t('login.resetPassword.title') }}
    </h1>

    <form class="form" @submit.prevent="onSubmit" data-cy="reset-password-form">
      <div
        class="email-display"
        v-if="email"
        data-cy="reset-password-email-display"
      >
        {{ $t('login.reset-password.resetting-for', { email: email }) }}
      </div>

      <u-form-input
        v-model="newPassword"
        type="password"
        :label="$t('login.enter.new.password')"
        :placeholder="$t('login.password.placeholder')"
        :validator="newPasswordValidator"
        :rules="passwordRules"
        autocomplete="new-password"
        progress
        :disabled="isLoading"
        data-cy="reset-password-new-input"
      />
      <u-form-input
        v-model="confirmPassword"
        type="password"
        :label="$t('login.confirm.new.password')"
        :placeholder="$t('login.password.placeholder')"
        :validator="confirmPasswordValidator"
        autocomplete="new-password"
        :disabled="isLoading"
        data-cy="reset-password-confirm-input"
      />
      <password-security-indicators :indicators="passwordIndicators" />

      <div class="form-action">
        <u-button
          native-type="submit"
          type="primary"
          :disabled="!canSubmit || isLoading"
          data-cy="reset-password-submit-button"
        >
          {{ $t('commons.form.confirm') }}
        </u-button>
      </div>
    </form>
  </home>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUsersStore } from '@/stores/modules/users/user';
  import {
    passwordRules,
    getPasswordIndicators,
    isPasswordSecure,
  } from '@/libs/utils/Security';
  import { useNotification } from '@/composables/notfication';
  import Home from '../_components/Home.vue';
  import { UFormInput, UButton } from '@/modules/common';
  import PasswordSecurityIndicators from '@/modules/users/_components/PasswordSecurityIndicators.vue';
  import i18n from '@/i18n';

  // --- State ---
  const email = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const code = ref('');
  const isLoading = ref(false);

  const { $errorMsg } = useNotification();
  const usersStore = useUsersStore();
  const route = useRoute();
  const router = useRouter();

  // --- Computed ---
  const passwordIndicators = computed(() =>
    getPasswordIndicators(newPassword.value)
  );

  const canSubmit = computed(() => {
    return (
      !!code.value &&
      !newPasswordValidator(newPassword.value) &&
      !confirmPasswordValidator(confirmPassword.value) &&
      !isLoading.value
    );
  });

  // --- Validation ---
  type ValidatorFn = (value: string) => string | null;
  const newPasswordValidator: ValidatorFn = (value) => {
    if (!value || value.length === 0)
      return i18n.global.t('login.password.required');
    if (!isPasswordSecure(value))
      return i18n.global.t('login.error.password-policy');
    return null;
  };

  const confirmPasswordValidator: ValidatorFn = (value) => {
    if (!value || value.length === 0)
      return i18n.global.t('login.password.required');
    if (value !== newPassword.value)
      return i18n.global.t('login.error.password-mismatch');
    return null;
  };

  // --- Methods ---
  async function onSubmit() {
    if (!canSubmit.value) return;

    isLoading.value = true;
    try {
      console.log(
        `Attempting password reset confirmation with code: ${code.value}`
      );
      await usersStore.confirmResetPassword({
        password: newPassword.value,
        code: code.value,
      });
      console.log('Password reset confirmation successful.');
      router.push({ name: 'login', query: { passwordUpdated: 'true' } });
    } catch (error: any) {
      console.error('Password reset confirmation failed:', error);
      newPassword.value = '';
      confirmPassword.value = '';

      const errorCode =
        error?.response?.data?.data?.code || error?.message || 'UNKNOWN_ERROR';
      let errorKey = `login.error.${errorCode}`;

      if (errorCode === 'ERR_PWD_IDENTICAL') {
        errorKey = 'login.error.password-dentical';
      } else if (error === 'AUTH_VALIDATION_ERROR') {
        errorKey = 'login.error.invalid-code-or-data';
      }

      $errorMsg(
        i18n.global.t(
          errorKey,
          i18n.global.t('login.reset-password.error-generic')
        )
      );
    } finally {
      isLoading.value = false;
    }
  }

  // --- Lifecycle Hooks ---
  onMounted(() => {
    if (route.params.email && typeof route.params.email === 'string') {
      email.value = route.params.email;
    }
    if (route.params.token && typeof route.params.token === 'string') {
      code.value = route.params.token;
    } else {
      console.error('Reset token missing from route parameters.');
      $errorMsg(i18n.global.t('login.reset-password.error-missing-token'));
      router.push({ name: 'login' });
    }
  });
</script>

<style lang="scss" scoped>
  .password-reset {
    .form {
      width: 100%;
      max-width: 450px;
      margin: 0 auto;
      padding: 20px;

      .email-display {
        margin-bottom: 20px;
        padding: 10px 15px;
        background-color: var(--color-neutral-200);
        border-radius: 4px;
        color: var(--color-text-secondary);
        text-align: center;
        font-size: var(--paragraph-03);
      }

      :deep(.u-form-input) {
        margin-bottom: 24px;
      }

      .form-action {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
</style>
