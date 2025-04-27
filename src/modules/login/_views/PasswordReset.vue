<template>
  <home class="password-reset">
    <template v-slot:title>
      <h1>
        {{ $t('login.change.expired.pwd.title') }}
      </h1>
    </template>
    <form class="form" @submit.prevent="onSubmit">
      <u-form-input
        v-model="email"
        :label="$t('login.email.label')"
        :placeholder="$t('login.email.placeholder')"
        input-name="username"
        autocomplete="email"
        :validator="emailValidator"
      />
      <u-form-input
        v-model="newPassword"
        type="password"
        :label="$t('login.enter.new.password')"
        :validator="newPasswordValidator"
        :rules="passwordRules"
        autocomplete="new-password"
        progress
      />
      <u-form-input
        v-model="confirmPassword"
        type="password"
        :label="$t('login.confirm.new.password')"
        :validator="confirmPasswordValidator"
        autocomplete="new-password"
      />
      <password-security-indicators :indicators="passwordIndicators" />
      <div class="form-action">
        <u-button type="primary" :disabled="!canSubmit">
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
  import { isValidEmail } from '@/libs/utils/String';
  import { useNotification } from '@/composables/notfication';
  import Home from '../_components/Home.vue';
  import { UFormInput, UButton } from '@/modules/common';
  import PasswordSecurityIndicators from '@/modules/users/_components/PasswordSecurityIndicators.vue';
  import i18n from '@/i18n';

  const email = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const token = ref('');

  const { $errorMsg } = useNotification();

  const usersStore = useUsersStore();
  const route = useRoute();
  const router = useRouter();

  const passwordIndicators = computed(() =>
    getPasswordIndicators(newPassword.value)
  );

  const canSubmit = computed(() => {
    return (
      !emailValidator(email.value) &&
      !newPasswordValidator(newPassword.value) &&
      !confirmPasswordValidator(confirmPassword.value)
    );
  });

  function emailValidator(value: string): string | null {
    if (value.length === 0) return i18n.global.t('login.email.required');
    if (!isValidEmail(value)) return i18n.global.t('login.valid.email');
    return null;
  }

  function newPasswordValidator(value: string): string | null {
    if (value.length === 0) return i18n.global.t('login.password.required');
    if (!isPasswordSecure(value))
      return i18n.global.t('login-expired.password-do-not-respect-rules');
    return null;
  }

  function confirmPasswordValidator(value: string): string | null {
    if (value.length === 0) return i18n.global.t('login.password.required');
    if (value !== newPassword.value)
      return i18n.global.t('login-expired.password-are-not-equal');
    return null;
  }

  async function onSubmit() {
    try {
      await usersStore.confirmResetPassword({
        email: email.value,
        password: newPassword.value,
        token: token.value,
      });
      router.push({ name: 'login', params: { updatePassword: 'true' } });
    } catch (error) {
      newPassword.value = '';
      if (error === 'BAD_CREDENTIALS') {
        $errorMsg(i18n.global.t('login.bad.credentials'));
      } else if (error === 'ERR_PWD_IDENTICAL') {
        $errorMsg(i18n.global.t('reset.error.same.password'));
      } else {
        $errorMsg(i18n.global.t('login-expired.notification.error'));
        console.error('Unknown password reset error!', error);
      }
    }
  }

  onMounted(() => {
    if (route.params.email) {
      email.value = route.params.email as string;
    }
    if (route.params.token) {
      token.value = route.params.token as string;
    }
  });
</script>

<style lang="scss" scoped>
  .password-reset {
    .form {
      width: 425px;

      :deep(.u-form-input) {
        margin-bottom: 24px;
      }

      .form-action {
        margin-top: 12px;
        text-align: center;
      }
    }
  }
</style>
