<template>
  <home class="login-expired">
    <template v-slot:title>
      <h1>
        {{ $t('login.change.expired.pwd.title') }}
      </h1>
    </template>
    <form class="form" @submit.prevent="onSubmit">
      <u-form-input
        v-model="email"
        :label="$t('login.email.label')"
        input-name="username"
        autocomplete="email"
        :placeholder="$t('login.email.placeholder')"
        :validator="emailValidator"
      />
      <u-form-input
        v-model="oldPassword"
        type="password"
        :label="$t('login.password.label')"
        :validator="oldPasswordValidator"
        autocomplete="current-password"
      />
      <hr class="login-expired-separator" />
      <u-form-input
        v-model="newPassword"
        type="password"
        :label="$t('login.enter.new.password')"
        :validator="newPasswordValidator"
        :rules="passwordRules"
        progress
        autocomplete="new-password"
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

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNotification } from '@/composables/notfication';
  import { isValidEmail } from '@/libs/utils/String';
  import {
    passwordRules,
    getPasswordIndicators,
    isPasswordSecure,
  } from '@/libs/utils/Security';
  import Home from '@/modules/login/_components/Home.vue';
  import { UFormInput, UButton } from '@/modules/ui';
  import PasswordSecurityIndicators from '@/modules/users/_components/PasswordSecurityIndicators.vue';
  import i18n from '@/i18n';

  // Dépendances
  const router = useRouter();
  const route = useRoute();
  const usersStore = useUsersStore();
  const { $errorMsg } = useNotification();

  // Données réactives
  const email = ref('');
  const oldPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');

  // Propriétés calculées
  const passwordIndicators = computed(() =>
    getPasswordIndicators(newPassword.value)
  );
  const canSubmit = computed(() => {
    return (
      !emailValidator(email.value) &&
      !oldPasswordValidator(oldPassword.value) &&
      !newPasswordValidator(newPassword.value) &&
      !confirmPasswordValidator(confirmPassword.value)
    );
  });

  // Hook de cycle de vie
  onMounted(() => {
    if (route.params.email) {
      email.value = route.params.email;
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

  function oldPasswordValidator(value) {
    if (value.length === 0) {
      return i18n.global.t('login.password.required');
    }
    return null;
  }

  function newPasswordValidator(value) {
    if (value.length === 0) {
      return i18n.global.t('login.password.required');
    }
    if (value === oldPassword.value) {
      return i18n.global.t('reset.error.same.password');
    }
    if (!isPasswordSecure(value)) {
      return i18n.global.t('login-expired.password-do-not-respect-rules');
    }
    return null;
  }

  function confirmPasswordValidator(value) {
    if (value.length === 0) {
      return i18n.global.t('login.password.required');
    }
    if (value !== newPassword.value) {
      return i18n.global.t('login-expired.password-are-not-equal');
    }
    return null;
  }

  async function onSubmit() {
    try {
      await usersStore.changeExpiredPassword({
        email: email.value,
        password: oldPassword.value,
        newPassword: newPassword.value,
      });
      router.push({ name: 'send.email' });
    } catch (error) {
      oldPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      if (error === 'BAD_CREDENTIALS' || error === 'ERR_UNAUTHORIZED') {
        $errorMsg('login.bad.credentials');
      } else if (error === 'ERR_PWD_IDENTICAL') {
        $errorMsg('login.reset.error.same.password');
      } else {
        $errorMsg('loginExpired.notification.error');
        console.error('Unknown login expired error!', error);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-expired {
    .form {
      width: 425px;

      :deep(.u-form-input) {
        margin-bottom: 24px;
      }

      .login-expired-separator {
        width: 30%;
        margin: 20px auto 30px auto;
      }

      .form-action {
        margin-top: 12px;
        text-align: center;
      }
    }
  }
</style>
